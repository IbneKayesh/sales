import { useState, useEffect } from "react";
import { brandsAPI } from "@/api/inventory/brandsAPI";
import validate, { generateDataModel } from "@/models/validator";
import { generateGuid } from "@/utils/guid";
import tmib_brand from "@/models/inventory/tmib_brand.json";
import { useAuth } from "@/hooks/useAuth";
import { useBusy, useNotification } from "@/hooks/useAppUI";
import type { Brand, BrandFormData } from "@/models/inventory/tmib_brand";

const dataModel: Brand = generateDataModel(tmib_brand as any, { edit_stop: 0 });

export const useBrands = () => {
  const { user } = useAuth();
  const { isBusy, setIsBusy } = useBusy();
  const { notify } = useNotification();
  const [dataList, setDataList] = useState<Brand[]>([]);
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Brand>(dataModel);

  const loadBrands = async () => {
    try {
      setIsBusy(true);
      const response = await brandsAPI.getAll({ muser_id: user.users_users });
      setDataList(response.data);
    } catch (error: any) {
      console.error("Error loading data:", error);
      notify({
        severity: "error",
        summary: "Brand",
        detail: error?.message || "Failed to load data",
        toast: true,
        notification: true,
      });
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleChange = (field: string, value: any) => {
    const updatedForm = { ...formData, [field]: value };
    setFormData(updatedForm);
    const newErrors = validate(updatedForm, tmib_brand as any);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEdit = (data: Brand) => {
    setFormData(data);
    setCurrentView("form");
  };

  const handleDelete = async (rowData: Brand) => {
    try {
      setIsBusy(true);
      const formDataNew: BrandFormData = {
        ...rowData,
        brand_brnam: rowData.brand_brnam, // Ensure required fields are present
        muser_id: user.users_users,
        suser_id: user.id,
      };
      const response = await brandsAPI.delete(formDataNew);

      if (response.success) {
        setDataList((prev) => prev.filter((u) => u.id !== rowData.id));
      }

      notify({
        severity: response.success ? "info" : "error",
        summary: "Delete",
        detail: `Brand - ${rowData.brand_brnam} ${
          response.success ? "is deleted by" : "delete failed by"
        } ${user.users_oname}`,
        toast: true,
        log: true,
      });
    } catch (error: any) {
      console.error("Error deleting data:", error);
      notify({
        severity: "error",
        summary: "Brand",
        detail: error?.message || "Failed to delete data",
        toast: true,
        notification: true,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleRefresh = () => {
    loadBrands();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newErrors = validate(formData, tmib_brand as any);
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      setIsBusy(true);
      const formDataNew: BrandFormData = {
        ...formData,
        brand_brnam: formData.brand_brnam, // Ensure required fields
        id: formData.id || generateGuid(),
        muser_id: user.users_users,
        suser_id: user.id,
      };

      let response;
      if (formData.id) {
        response = await brandsAPI.update(formDataNew);
      } else {
        response = await brandsAPI.create(formDataNew);
      }

      notify({
        severity: response.success ? "success" : "error",
        summary: "Submit",
        detail: `Brand - ${formDataNew.brand_brnam} ${
          response.success
            ? formData.id
              ? "modified"
              : "created"
            : formData.id
              ? "modification failed"
              : "creation failed"
        } by ${user.users_oname}`,
        toast: true,
        log: true,
      });

      if (response.success) {
        handleClear();
        setCurrentView("list");
        await loadBrands();
      }
    } catch (error: any) {
      console.error("Error saving data:", error);
      notify({
        severity: "error",
        summary: "Brand",
        detail: error?.message || "Failed to save data",
        toast: true,
        notification: true,
      });
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    dataList,
    currentView,
    errors,
    formData,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleSave,
  };
};
