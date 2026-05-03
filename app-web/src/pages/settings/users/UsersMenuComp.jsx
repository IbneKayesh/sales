import { useState, useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import "./UsersMenuComp.css";

const UsersMenuComp = ({ pageAuth, dataList, onEdit }) => {
  const [nodes, setNodes] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]);

  useEffect(() => {
    if (dataList && dataList.length > 0) {
      // Build tree structure based on menus_id
      const map = {};
      const tree = [];

      dataList.forEach((item) => {
        map[item.menus_id] = { key: item.menus_id, data: item, children: [] };
      });

      dataList.forEach((item) => {
        const parts = item.menus_id.split("-");
        parts.pop();
        const parentId = parts.join("-");

        if (parentId && map[parentId]) {
          map[parentId].children.push(map[item.menus_id]);
        } else {
          tree.push(map[item.menus_id]);
        }
      });

      setNodes(tree);
      setExpandedNodes(tree.map((n) => n.key));
    } else {
      setNodes([]);
    }
  }, [dataList]);

  const toggleNode = (nodeKey) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeKey)
        ? prev.filter((id) => id !== nodeKey)
        : [...prev, nodeKey]
    );
  };

  const handleCheckboxChange = (nodeData, field, checked) => {
    if (onEdit) {
      onEdit({ ...nodeData, [field]: checked });
    }
  };

  const renderTreeNodes = (treeNodes, level = 0) => {
    if (!treeNodes || treeNodes.length === 0) return null;
    return treeNodes.map((node) => {
      const hasSubItems = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.includes(node.key);

      // We add padding based on the level so nested items indent,
      // but the background and right-side checkboxes remain full width and aligned.
      const paddingLeft = `${1 + level * 2}rem`;

      return (
        <div key={node.key} className="menu-group">
          <div
            className={`menu-item ${isExpanded ? "expanded" : ""}`}
            onClick={() => toggleNode(node.key)}
            style={{ paddingLeft: paddingLeft }}
          >
            <i
              className={`icon pi ${
                node.data.menus_micon ||
                (level === 0 ? "pi-apps" : "pi-circle-fill text-xs")
              }`}
            ></i>
            <span className="label">
              {node.data.menus_mname}
              <span className="text-500 text-sm ml-3 font-normal">
                ID: {node.data.menus_id}
              </span>
            </span>

            {hasSubItems && (
              <i className="chevron pi pi-chevron-right mr-3"></i>
            )}

            <div
              className="menu-item-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`extpr-${node.key}`}
                  checked={node.data.mnusr_extpr || false}
                  onChange={(e) =>
                    handleCheckboxChange(node.data, "mnusr_extpr", e.checked)
                  }
                />
                <label
                  htmlFor={`extpr-${node.key}`}
                  className="text-sm cursor-pointer"
                >
                  Export
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`addpr-${node.key}`}
                  checked={node.data.mnusr_addpr || false}
                  onChange={(e) =>
                    handleCheckboxChange(node.data, "mnusr_addpr", e.checked)
                  }
                />
                <label
                  htmlFor={`addpr-${node.key}`}
                  className="text-sm cursor-pointer"
                >
                  Add
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`edtpr-${node.key}`}
                  checked={node.data.mnusr_edtpr || false}
                  onChange={(e) =>
                    handleCheckboxChange(node.data, "mnusr_edtpr", e.checked)
                  }
                />
                <label
                  htmlFor={`edtpr-${node.key}`}
                  className="text-sm cursor-pointer"
                >
                  Edit
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`delpr-${node.key}`}
                  checked={node.data.mnusr_delpr || false}
                  onChange={(e) =>
                    handleCheckboxChange(node.data, "mnusr_delpr", e.checked)
                  }
                />
                <label
                  htmlFor={`delpr-${node.key}`}
                  className="text-sm cursor-pointer"
                >
                  Delete
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`actve-${node.key}`}
                  checked={node.data.mnusr_actve || false}
                  onChange={(e) =>
                    handleCheckboxChange(node.data, "mnusr_actve", e.checked)
                  }
                />
                <label
                  htmlFor={`actve-${node.key}`}
                  className="text-sm cursor-pointer"
                >
                  Active
                </label>
              </div>
            </div>
          </div>

          {hasSubItems && (
            <div className="sub-menu" style={{ paddingLeft: 0 }}>
              {renderTreeNodes(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-3">
      {nodes.length > 0 ? (
        <div className="menu-list">{renderTreeNodes(nodes)}</div>
      ) : (
        <p className="text-500">No menus found.</p>
      )}
    </div>
  );
};

export default UsersMenuComp;
