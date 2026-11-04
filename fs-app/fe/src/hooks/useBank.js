import { useState } from "react";
import { useBanking } from "./useBanking";
import { useToast } from "./useToast";
import { banksApi } from "../lib/api/repositories";

export function useBank() {
  const {
    banks,
    accounts,
    dps,
    fd,
    transactions,
    loading,
    reload,
    upsert,
    remove,
  } = useBanking();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = search.trim().toLowerCase();
  const rows = banks.filter((bank) =>
    !query
      ? true
      : [bank.name, bank.branch, bank.notes].some((field) =>
          (field || "").toLowerCase().includes(query)
        )
  );

  const stats = {
    total: banks.length,
    active: banks.filter((bank) => bank.status !== "inactive").length,
    accountCount: accounts.length,
    childCount: dps.length + fd.length,
  };

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(bank) {
    setEditing(bank);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function save(values) {
    const saved = editing
      ? await banksApi.update(editing._id, values)
      : await banksApi.create(values);

    upsert("banks", saved);
    toast.success(editing ? "Bank updated" : "Bank added");
    closeForm();
    return saved;
  }

  function requestDelete(bank) {
    toast.confirm({
      title: `Delete ${bank.name}?`,
      message:
        "The bank is removed from the list. Its accounts and child accounts stay in storage.",
      confirmLabel: "Yes, delete",
      onConfirm: async () => {
        try {
          await banksApi.remove(bank._id);
          remove("banks", bank._id);
          toast.success("Bank deleted");
        } catch (err) {
          toast.error(err.message);
        }
      },
    });
  }

  return {
    rows,
    banks,
    accounts,
    dps,
    fd,
    transactions,
    loading,
    reload,
    search,
    setSearch,
    stats,
    formOpen,
    editing,
    openCreate,
    openEdit,
    closeForm,
    save,
    requestDelete,
  };
}
