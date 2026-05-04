import { useState, useEffect } from "react";
import { Tree } from "primereact/tree";
import { Checkbox } from "primereact/checkbox";

const UsersMenuComp = ({ pageAuth, dataList, onEdit, formData }) => {
  const [nodes, setNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});

  useEffect(() => {
    if (dataList && dataList.length > 0) {
      const map = {};
      const tree = [];
      const expKeys = {};

      dataList.forEach((item) => {
        map[item.menus_id] = {
          key: item.menus_id,
          label: item.menus_mname,
          data: item,
          icon:
            item.menus_micon && item.menus_micon !== "default"
              ? item.menus_micon
              : "pi pi-fw pi-folder",
          children: [],
        };
        expKeys[item.menus_id] = true;
      });

      dataList.forEach((item) => {
        const parentId = item.menus_menus;

        // If parentId exists in the map and it's not "NA", it's a child node.
        // Also support fallback: if menus_menus is not reliably matching, but parentId from ID format works,
        // we can adjust. Based on user's sample JSON, menus_menus contains the parent ID or "NA".
        if (parentId && parentId !== "NA" && map[parentId]) {
          map[parentId].children.push(map[item.menus_id]);
        } else if (parentId === "NA" || !parentId || !map[parentId]) {
          tree.push(map[item.menus_id]);
        }
      });

      setNodes(tree);
      setExpandedKeys(expKeys);
    } else {
      setNodes([]);
      setExpandedKeys({});
    }
  }, [dataList]);

  const nodeTemplate = (node) => {
    return (
      <div className="flex align-items-center justify-content-between w-full p-2 umc-text">
        <span className="font-semibold text-lg">{node.label}</span>
        <div className="flex align-items-center gap-4 ml-auto pl-4">
          {node.data.menus_mlink !== "NA" && (
            <>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`extpr-${node.key}`}
                  checked={node.data.mnusr_extpr || false}
                  onChange={(e) => onEdit(node.data, "mnusr_extpr", e.checked)}
                />
                <label
                  htmlFor={`extpr-${node.key}`}
                  className="text-sm cursor-pointer umc-label"
                >
                  Export
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`addpr-${node.key}`}
                  checked={node.data.mnusr_addpr || false}
                  onChange={(e) => onEdit(node.data, "mnusr_addpr", e.checked)}
                />
                <label
                  htmlFor={`addpr-${node.key}`}
                  className="text-sm cursor-pointer umc-label"
                >
                  Add
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`edtpr-${node.key}`}
                  checked={node.data.mnusr_edtpr || false}
                  onChange={(e) => onEdit(node.data, "mnusr_edtpr", e.checked)}
                />
                <label
                  htmlFor={`edtpr-${node.key}`}
                  className="text-sm cursor-pointer umc-label"
                >
                  Edit
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`delpr-${node.key}`}
                  checked={node.data.mnusr_delpr || false}
                  onChange={(e) => onEdit(node.data, "mnusr_delpr", e.checked)}
                />
                <label
                  htmlFor={`delpr-${node.key}`}
                  className="text-sm cursor-pointer umc-label"
                >
                  Delete
                </label>
              </div>
            </>
          )}
          <div className="flex align-items-center gap-2">
            <Checkbox
              inputId={`actve-${node.key}`}
              checked={node.data.mnusr_actve || false}
              onChange={(e) => onEdit(node.data, "mnusr_actve", e.checked)}
            />
            <label
              htmlFor={`actve-${node.key}`}
              className="text-sm cursor-pointer umc-label"
            >
              Active
            </label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3">
      <span className="text-lg font-bold text-primary-700"><i className="pi pi-user mr-1"></i> {formData.users_uname}</span>
      <style>{`
        .umc-tree-content:hover {
          background-color: var(--primary-light) !important;
          color: var(--text-soft) !important;
        }
        .umc-tree-content:hover .umc-text,
        .umc-tree-content:hover .umc-label {
          color: var(--text-soft) !important;
        }
        .umc-text {
          color: var(--text-soft);
        }
        .umc-label {
          color: var(--text-muted);
        }
      `}</style>
      {nodes.length > 0 ? (
        <Tree
          value={nodes}
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
          nodeTemplate={nodeTemplate}
          className="w-full border-none p-0"
          pt={{
            root: { className: "w-full" },
            container: { className: "w-full" },
            content: {
              className:
                "w-full p-2 border-round transition-colors duration-200 ease-in-out umc-tree-content",
            },
            label: { className: "w-full flex" },
          }}
        />
      ) : (
        <p className="umc-label">No menus found.</p>
      )}
    </div>
  );
};

export default UsersMenuComp;
