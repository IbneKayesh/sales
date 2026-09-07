import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import { IconSearch, IconClose, IconPlus, IconSave } from "@/icons";
import Button from "@/components/Button";
import useUsers from "@/hooks/M01/useUsers";
import UsersList from "./UsersList";
import UsersForm from "./UsersForm";

const UsersPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //functions
    handleChange,
    handleEdit,
    handleDelete,
    handleSearch,
    handleAddNew,
    handleCancel,
    handleSubmit,
    handleSubmitMenu,
    handleUpdateMenus,
  } = useUsers();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle title="Users" subtitle={`${listData.length} Users`} />
          <PageCardActions>
            {pgView === "SYS_VW_LST_1" && (
              <>
                <Button variant="info" size="sm" onClick={handleSearch}>
                  <IconSearch size={14} className="icon-left" />
                  Search
                </Button>
                <Button variant="info" size="sm" onClick={handleAddNew}>
                  <IconPlus size={14} className="icon-left" />
                  Add New
                </Button>
              </>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                <IconClose size={14} className="icon-left" />
                Cancel
              </Button>
            )}
            {pgView === "SYS_VW_FRM_1" && (
              <Button variant="info" size="sm" onClick={handleSubmit}>
                <IconSave size={14} className="icon-left" />
                {formData?.id ? "Update" : "Create"}
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {pgView === "SYS_VW_LST_1" && (
            <UsersList
              listData={listData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {pgView === "SYS_VW_FRM_1" && (
            <UsersForm
              isBusy={isBusy}
              readOnly={readOnly}
              stopEdit={stopEdit}
              formData={formData}
              formErrors={formErrors}
              onChange={handleChange}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              listData={listDataItem}
              setListDataItem={handleUpdateMenus}
              onSubmitMenu={handleSubmitMenu}
            />
          )}
        </PageCardBody>
      </PageCard>
    </div>
  );
};
export default UsersPage;
