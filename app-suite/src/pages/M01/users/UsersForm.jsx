import { useState, useMemo } from "react";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import AuditData from "@/components/AuditData";
import Badge from "@/components/Badge";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
  PageCardFooter,
} from "@/components/PageCard";
import { IconClose, IconSave, IconSearch, IconCheck } from "@/icons";
import Chip from "@/components/Chip";
import EmptyState from "@/components/EmptyState";
import InputLabel from "@/components/InputLabel";
import { bool_Options } from "@/utils/vtable.js";

const UsersForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  listData = [],
  setListDataItem,
  onSubmitMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedModules, setExpandedModules] = useState({});

  const roleOptions = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
    { value: "SADMIN", label: "Super Admin" },
  ];

  // Helper to update individual menu item in permissions list
  const handleUpdateItem = (menuId, key, value) => {
    const updated = listData.map((item) => {
      if (item.menuId === menuId) {
        const next = { ...item, [key]: value };
        // If enabling access, default add/edt/del to true if not set
        if (key === "assigned" && value === true) {
          if (next.menup_addpr === undefined) next.menup_addpr = true;
          if (next.menup_edtpr === undefined) next.menup_edtpr = true;
          if (next.menup_delpr === undefined) next.menup_delpr = true;
        }
        return next;
      }
      return item;
    });
    setListDataItem(updated);
  };

  // Bulk actions across all menus
  const handleGrantAll = (fullAccess = false) => {
    const updated = listData.map((item) => ({
      ...item,
      assigned: true,
      menup_extpr: fullAccess ? true : (item.menup_extpr ?? false),
      menup_addpr: true,
      menup_edtpr: true,
      menup_delpr: true,
    }));
    setListDataItem(updated);
  };

  const handleRevokeAll = () => {
    const updated = listData.map((item) => ({
      ...item,
      assigned: false,
    }));
    setListDataItem(updated);
  };

  // Bulk actions per module
  const handleToggleModule = (moduleId, assign) => {
    const updated = listData.map((item) => {
      if (item.moduleId === moduleId) {
        return {
          ...item,
          assigned: assign,
          menup_addpr: assign ? (item.menup_addpr ?? true) : item.menup_addpr,
          menup_edtpr: assign ? (item.menup_edtpr ?? true) : item.menup_edtpr,
          menup_delpr: assign ? (item.menup_delpr ?? true) : item.menup_delpr,
        };
      }
      return item;
    });
    setListDataItem(updated);
  };

  // Bulk actions per group
  const handleToggleGroup = (moduleId, groupId, assign) => {
    const updated = listData.map((item) => {
      if (item.moduleId === moduleId && item.groupId === groupId) {
        return {
          ...item,
          assigned: assign,
          menup_addpr: assign ? (item.menup_addpr ?? true) : item.menup_addpr,
          menup_edtpr: assign ? (item.menup_edtpr ?? true) : item.menup_edtpr,
          menup_delpr: assign ? (item.menup_delpr ?? true) : item.menup_delpr,
        };
      }
      return item;
    });
    setListDataItem(updated);
  };

  // Toggle module collapse state
  const toggleModuleCollapse = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: prev[moduleId] === undefined ? false : !prev[moduleId],
    }));
  };

  const expandAllModules = () => {
    const state = {};
    modulesGrouped.forEach((mod) => {
      state[mod.moduleId] = true;
    });
    setExpandedModules(state);
  };

  const collapseAllModules = () => {
    const state = {};
    modulesGrouped.forEach((mod) => {
      state[mod.moduleId] = false;
    });
    setExpandedModules(state);
  };

  // Group menus hierarchically by Module -> Group
  const modulesGrouped = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const map = new Map();

    listData.forEach((item) => {
      const matchSearch =
        !q ||
        item.menuName?.toLowerCase().includes(q) ||
        item.menuId?.toLowerCase().includes(q) ||
        item.moduleName?.toLowerCase().includes(q) ||
        item.groupName?.toLowerCase().includes(q) ||
        item.desc?.toLowerCase().includes(q);

      if (!matchSearch) return;

      if (!map.has(item.moduleId)) {
        map.set(item.moduleId, {
          moduleId: item.moduleId,
          moduleName: item.moduleName,
          moduleColor: item.moduleColor || "#7c3aed",
          moduleIcon: item.moduleIcon,
          groups: new Map(),
          totalMenus: 0,
          assignedMenus: 0,
        });
      }

      const mod = map.get(item.moduleId);
      mod.totalMenus += 1;
      if (item.assigned) mod.assignedMenus += 1;

      if (!mod.groups.has(item.groupId)) {
        mod.groups.set(item.groupId, {
          groupId: item.groupId,
          groupName: item.groupName,
          menus: [],
          totalMenus: 0,
          assignedMenus: 0,
        });
      }

      const grp = mod.groups.get(item.groupId);
      grp.totalMenus += 1;
      if (item.assigned) grp.assignedMenus += 1;
      grp.menus.push(item);
    });

    return Array.from(map.values()).map((mod) => ({
      ...mod,
      groups: Array.from(mod.groups.values()),
    }));
  }, [listData, searchQuery]);

  const totalAssignedCount = useMemo(
    () => listData.filter((m) => m.assigned).length,
    [listData],
  );

  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-2">
          <InputLabel label="Code" value={formData.emply_ccode} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Name" value={formData.emply_cname} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Contact" value={formData.emply_cntno} />
        </div>
        <div className="col-span-2">
          <InputText
            label="Password"
            placeholder="Enter password"
            value={formData.emply_pswrd || ""}
            onChange={(e) => onChange("emply_pswrd", e.target.value)}
            error={formErrors.emply_pswrd}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Allow Login"
            options={bool_Options}
            value={formData.emply_islgn}
            onChange={(e) => onChange("emply_islgn", e.target.value)}
            error={formErrors.emply_islgn}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Role"
            options={roleOptions}
            value={formData.emply_urole}
            onChange={(e) => onChange("emply_urole", e.target.value)}
            error={formErrors.emply_urole}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
      </div>

      {formData?.id && (
        <AuditData
          actve={formData.emply_actve}
          cname={formData.crusr_cname}
          cdate={formData.emply_crdat}
          uname={formData.upusr_cname}
          udate={formData.emply_updat}
          rvnmr={formData.emply_rvnmr}
        />
      )}
      {/* Main User Save / Cancel Actions */}
      <div className="form-actions" style={{ marginTop: "1.5rem" }}>
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update User" : "Create User"}
        </Button>
      </div>

      {/* User Wise Menu Permissions Section */}
      {formData?.id && listData.length > 0 && (
        <PageCard style={{ marginTop: "1.5rem" }}>
          <PageCardHeader style={{ flexWrap: "wrap", gap: "0.5rem" }}>
            <PageCardTitle
              title="Menu Permissions"
              subtitle="Configure accessible menus and action permissions (Export, Add, Edit, Delete) for this user."
            />
            <PageCardActions>
              <Badge variant={totalAssignedCount > 0 ? "success" : "secondary"}>
                {totalAssignedCount} / {listData.length} Granted
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGrantAll(false)}
                disabled={isBusy}
                title="Grant view and standard CRUD access to all menus"
              >
                Grant All Menus
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGrantAll(true)}
                disabled={isBusy}
                title="Grant full access including Export to all menus"
              >
                Full Access (All)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeAll}
                disabled={isBusy}
                title="Revoke access to all menus"
              >
                Revoke All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={expandAllModules}
                disabled={isBusy}
              >
                Expand All
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={collapseAllModules}
                disabled={isBusy}
              >
                Collapse All
              </Button>
              <Button
                variant="info"
                size="sm"
                onClick={onSubmitMenu}
                disabled={isBusy}
              >
                <IconSave size={14} className="icon-left" />
                Save Permissions ({totalAssignedCount} Selected)
              </Button>
            </PageCardActions>
          </PageCardHeader>

          <PageCardBody>
            {/* Search bar */}
            <div className="menu-permissions__search">
              <InputText
                placeholder="Filter menus by name or module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isBusy}
                icon={<IconSearch size={16} />}
                dense
              />
            </div>

            {/* Modules and Menus List */}
            {modulesGrouped.length === 0 ? (
              <EmptyState
                variant="noResults"
                title="No matching menus found"
                message={`Nothing matches "${searchQuery}"`}
                compact
              />
            ) : (
              <div className="menu-permissions__modules">
                {modulesGrouped.map((mod) => {
                  const isExpanded = expandedModules[mod.moduleId] !== false; // Default expanded
                  const isAllInModAssigned =
                    mod.totalMenus > 0 && mod.assignedMenus === mod.totalMenus;
                  const isSomeInModAssigned =
                    mod.assignedMenus > 0 && mod.assignedMenus < mod.totalMenus;

                  return (
                    <PageCard
                      key={mod.moduleId}
                      className="menu-permissions__module"
                    >
                      {/* Module Header */}
                      <PageCardHeader
                        className="menu-permissions__module-header"
                        onClick={() => toggleModuleCollapse(mod.moduleId)}
                      >
                        <div className="menu-permissions__module-title">
                          <span
                            className={`menu-permissions__chevron${isExpanded ? " menu-permissions__chevron--open" : ""}`}
                          >
                            ▶
                          </span>
                          <span
                            className="menu-permissions__dot"
                            style={{ backgroundColor: mod.moduleColor }}
                          />
                          <PageCardTitle title={mod.moduleName} />
                          <Badge
                            variant={
                              mod.assignedMenus > 0 ? "info" : "secondary"
                            }
                          >
                            {mod.assignedMenus} / {mod.totalMenus}
                          </Badge>
                        </div>

                        <div
                          className="menu-permissions__module-actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            label="Grant Module"
                            checked={isAllInModAssigned}
                            indeterminate={isSomeInModAssigned}
                            onChange={(e) =>
                              handleToggleModule(mod.moduleId, e.target.checked)
                            }
                            disabled={isBusy}
                          />
                        </div>
                      </PageCardHeader>

                      {/* Module Groups and Menus Table */}
                      {isExpanded && (
                        <PageCardBody className="menu-permissions__module-body">
                          {mod.groups.map((grp) => {
                            const isAllInGrpAssigned =
                              grp.totalMenus > 0 &&
                              grp.assignedMenus === grp.totalMenus;
                            const isSomeInGrpAssigned =
                              grp.assignedMenus > 0 &&
                              grp.assignedMenus < grp.totalMenus;

                            return (
                              <div
                                key={grp.groupId}
                                className="menu-permissions__group"
                              >
                                {/* Group Header */}
                                <div className="menu-permissions__group-header">
                                  <div className="menu-permissions__group-title">
                                    <Chip variant="outline" size="sm">
                                      {grp.groupName}
                                    </Chip>
                                    <Badge variant="muted">
                                      {grp.assignedMenus}/{grp.totalMenus}
                                    </Badge>
                                  </div>
                                  <Checkbox
                                    label="Select Group"
                                    checked={isAllInGrpAssigned}
                                    indeterminate={isSomeInGrpAssigned}
                                    onChange={(e) =>
                                      handleToggleGroup(
                                        mod.moduleId,
                                        grp.groupId,
                                        e.target.checked,
                                      )
                                    }
                                    disabled={isBusy}
                                  />
                                </div>

                                {/* Menus Rows */}
                                <div className="menu-permissions__table-wrap">
                                  <table className="menu-permissions__table">
                                    <thead>
                                      <tr>
                                        <th className="menu-permissions__th menu-permissions__th--menu">
                                          Menu
                                        </th>
                                        <th className="menu-permissions__th menu-permissions__th--perm">
                                          Export
                                        </th>
                                        <th className="menu-permissions__th menu-permissions__th--perm">
                                          Add
                                        </th>
                                        <th className="menu-permissions__th menu-permissions__th--perm">
                                          Edit
                                        </th>
                                        <th className="menu-permissions__th menu-permissions__th--perm">
                                          Delete
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {grp.menus.map((menuItem) => {
                                        const isAssigned = !!menuItem.assigned;
                                        return (
                                          <tr
                                            key={menuItem.menuId}
                                            className={`menu-permissions__row${isAssigned ? " menu-permissions__row--assigned" : ""}`}
                                          >
                                            {/* Access & Menu Info */}
                                            <td className="menu-permissions__td menu-permissions__td--menu">
                                              <div className="menu-permissions__menu-info">
                                                <Checkbox
                                                  label={menuItem.menuName}
                                                  checked={isAssigned}
                                                  onChange={(e) =>
                                                    handleUpdateItem(
                                                      menuItem.menuId,
                                                      "assigned",
                                                      e.target.checked,
                                                    )
                                                  }
                                                  disabled={isBusy}
                                                />
                                                <div className="menu-permissions__menu-meta">
                                                  <code>{menuItem.menuId}</code>
                                                  {menuItem.desc && (
                                                    <span>
                                                      • {menuItem.desc}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </td>

                                            {/* Export Permission */}
                                            <td className="menu-permissions__td menu-permissions__td--perm">
                                              <div className="menu-permissions__cell-center">
                                                <Checkbox
                                                  checked={
                                                    !!menuItem.menup_extpr &&
                                                    isAssigned
                                                  }
                                                  onChange={(e) =>
                                                    handleUpdateItem(
                                                      menuItem.menuId,
                                                      "menup_extpr",
                                                      e.target.checked,
                                                    )
                                                  }
                                                  disabled={
                                                    !isAssigned || isBusy
                                                  }
                                                />
                                              </div>
                                            </td>

                                            {/* Add Permission */}
                                            <td className="menu-permissions__td menu-permissions__td--perm">
                                              <div className="menu-permissions__cell-center">
                                                <Checkbox
                                                  checked={
                                                    !!menuItem.menup_addpr &&
                                                    isAssigned
                                                  }
                                                  onChange={(e) =>
                                                    handleUpdateItem(
                                                      menuItem.menuId,
                                                      "menup_addpr",
                                                      e.target.checked,
                                                    )
                                                  }
                                                  disabled={
                                                    !isAssigned || isBusy
                                                  }
                                                />
                                              </div>
                                            </td>

                                            {/* Edit Permission */}
                                            <td className="menu-permissions__td menu-permissions__td--perm">
                                              <div className="menu-permissions__cell-center">
                                                <Checkbox
                                                  checked={
                                                    !!menuItem.menup_edtpr &&
                                                    isAssigned
                                                  }
                                                  onChange={(e) =>
                                                    handleUpdateItem(
                                                      menuItem.menuId,
                                                      "menup_edtpr",
                                                      e.target.checked,
                                                    )
                                                  }
                                                  disabled={
                                                    !isAssigned || isBusy
                                                  }
                                                />
                                              </div>
                                            </td>

                                            {/* Delete Permission */}
                                            <td className="menu-permissions__td menu-permissions__td--perm">
                                              <div className="menu-permissions__cell-center">
                                                <Checkbox
                                                  checked={
                                                    !!menuItem.menup_delpr &&
                                                    isAssigned
                                                  }
                                                  onChange={(e) =>
                                                    handleUpdateItem(
                                                      menuItem.menuId,
                                                      "menup_delpr",
                                                      e.target.checked,
                                                    )
                                                  }
                                                  disabled={
                                                    !isAssigned || isBusy
                                                  }
                                                />
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })}
                        </PageCardBody>
                      )}
                    </PageCard>
                  );
                })}
              </div>
            )}
          </PageCardBody>

          {/* Bottom Save Action */}
          <PageCardFooter>
            <Button
              variant="info"
              size="sm"
              onClick={onSubmitMenu}
              disabled={isBusy}
            >
              <IconSave size={14} className="icon-left" />
              Save Permissions ({totalAssignedCount} Selected)
            </Button>
          </PageCardFooter>
        </PageCard>
      )}
    </div>
  );
};
export default UsersForm;
