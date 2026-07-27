import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Chip from "@/components/Chip";
import TreeView from "@/components/TreeView";
import { IconCheck, IconChevronRight } from "@/icons";

/* ─── Sample tree data ─── */

const inventoryTree = [
  {
    id: "cat-1",
    label: "Electronics",
    children: [
      {
        id: "sub-1",
        label: "Laptops",
        children: [
          { id: "item-1", label: "Gaming Laptop" },
          { id: "item-2", label: "Ultrabook" },
          { id: "item-3", label: "Chromebook" },
        ],
      },
      {
        id: "sub-2",
        label: "Phones",
        children: [
          { id: "item-4", label: "Smartphone" },
          { id: "item-5", label: "Feature Phone" },
        ],
      },
      {
        id: "sub-3",
        label: "Tablets",
        children: [
          { id: "item-6", label: "iPad" },
          { id: "item-7", label: "Android Tablet" },
        ],
      },
    ],
  },
  {
    id: "cat-2",
    label: "Furniture",
    children: [
      {
        id: "sub-4",
        label: "Chairs",
        children: [
          { id: "item-8", label: "Office Chair" },
          { id: "item-9", label: "Gaming Chair" },
          { id: "item-10", label: "Recliner" },
        ],
      },
      {
        id: "sub-5",
        label: "Desks",
        children: [
          { id: "item-11", label: "Standing Desk" },
          { id: "item-12", label: "Corner Desk" },
        ],
      },
    ],
  },
  {
    id: "cat-3",
    label: "Accessories",
    children: [
      { id: "item-13", label: "Cables" },
      { id: "item-14", label: "Chargers" },
      { id: "item-15", label: "Headphones" },
    ],
  },
];

const permissionsTree = [
  {
    id: "perm-1",
    label: "User Management",
    children: [
      {
        id: "perm-1a",
        label: "Create Users",
        children: [
          { id: "perm-1a1", label: "With Roles" },
          { id: "perm-1a2", label: "Without Roles" },
        ],
      },
      { id: "perm-1b", label: "Edit Users" },
      { id: "perm-1c", label: "Delete Users" },
    ],
  },
  {
    id: "perm-2",
    label: "Content Management",
    children: [
      { id: "perm-2a", label: "Create Content" },
      { id: "perm-2b", label: "Publish Content" },
      {
        id: "perm-2c",
        label: "Moderate Content",
        children: [
          { id: "perm-2c1", label: "Approve Comments" },
          { id: "perm-2c2", label: "Flag Content" },
          { id: "perm-2c3", label: "Ban Users" },
        ],
      },
    ],
  },
  {
    id: "perm-3",
    label: "System Settings",
    children: [
      { id: "perm-3a", label: "Configure Email" },
      {
        id: "perm-3b",
        label: "Security",
        children: [
          { id: "perm-3b1", label: "2FA Settings" },
          { id: "perm-3b2", label: "IP Whitelist" },
        ],
      },
    ],
  },
];

const orgChartTree = [
  {
    id: "org-1",
    label: "Executive",
    children: [
      {
        id: "org-1a",
        label: "CEO Office",
        children: [
          { id: "org-1a1", label: "Executive Assistant" },
          { id: "org-1a2", label: "Strategy Team" },
        ],
      },
      {
        id: "org-1b",
        label: "Board of Directors",
        children: [
          { id: "org-1b1", label: "Chairperson" },
          { id: "org-1b2", label: "Vice Chairperson" },
        ],
      },
    ],
  },
  {
    id: "org-2",
    label: "Engineering",
    children: [
      {
        id: "org-2a",
        label: "Product Development",
        children: [
          { id: "org-2a1", label: "Frontend Team" },
          { id: "org-2a2", label: "Backend Team" },
          { id: "org-2a3", label: "DevOps Team" },
        ],
      },
      {
        id: "org-2b",
        label: "QA",
        children: [
          { id: "org-2b1", label: "Manual Testing" },
          { id: "org-2b2", label: "Automation Testing" },
        ],
      },
    ],
  },
  {
    id: "org-3",
    label: "Operations",
    children: [
      { id: "org-3a", label: "HR" },
      { id: "org-3b", label: "Finance" },
      {
        id: "org-3c",
        label: "Facilities",
        children: [
          { id: "org-3c1", label: "Office Management" },
          { id: "org-3c2", label: "IT Support" },
        ],
      },
    ],
  },
];

/* ─── Helpers ─── */
function collectAllIds(nodes) {
  const ids = [];
  const walk = (list) => {
    for (const n of list) {
      ids.push(n.id);
      if (n.children?.length) walk(n.children);
    }
  };
  walk(nodes);
  return ids;
}

function findLabelInTree(nodes, targetId) {
  const walk = (list) => {
    for (const n of list) {
      if (n.id === targetId) return n.label;
      if (n.children?.length) {
        const found = walk(n.children);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(nodes) || targetId;
}

export default function TreeViewExamplesPage() {
  const navigate = useNavigate();

  // ── Demo 1: Interactive Selection ──
  const [invChecked, setInvChecked] = useState([]);
  const allInvIds = useMemo(() => collectAllIds(inventoryTree), []);

  const handleSelectAll = useCallback(() => {
    setInvChecked([...allInvIds]);
  }, [allInvIds]);

  const handleClearAll = useCallback(() => {
    setInvChecked([]);
  }, []);

  // ── Demo 2: Controlled Expansion ──
  const [permExpanded, setPermExpanded] = useState(() => {
    const all = new Set();
    const walk = (list) => {
      for (const n of list) {
        all.add(n.id);
        if (n.children?.length) walk(n.children);
      }
    };
    walk(permissionsTree);
    return Array.from(all);
  });

  const handleExpandAll = useCallback(() => {
    const all = [];
    const walk = (list) => {
      for (const n of list) {
        all.push(n.id);
        if (n.children?.length) walk(n.children);
      }
    };
    walk(permissionsTree);
    setPermExpanded(all);
  }, []);

  const handleCollapseAll = useCallback(() => {
    // Only root nodes are shown when collapsed
    const rootIds = permissionsTree.map((n) => n.id);
    setPermExpanded(rootIds);
  }, []);

  // ── Demo 3: Multiple Independent Trees ──
  const [orgCheckedA, setOrgCheckedA] = useState([]);
  const [orgCheckedB, setOrgCheckedB] = useState([]);

  // ── Count helpers ──
  const totalInvItems = allInvIds.length;

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{ padding: "var(--sp-4) 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          <Button variant="ghost" size="sm" onClick={() => navigate("/examples")}>
            <span style={{ display: "flex", alignItems: "center", gap: "var(--sp-1)" }}>
              <IconChevronRight size={14} style={{ transform: "rotate(180deg)" }} />
              Back
            </span>
          </Button>
          <div>
            <h2 style={{ margin: 0, fontSize: "var(--fs-xl)", fontWeight: 700 }}>
              Tree View Examples
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "var(--fs-sm)", color: "var(--text-secondary)" }}>
              Checkbox trees with expand/collapse, selection tracking, controlled expansion, and multiple data sources
            </p>
          </div>
        </div>
      </div>

      {/* ── Demo 1: Interactive Selection ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Interactive Selection"
            subtitle="Check/uncheck items with cascading parent/child behavior"
          />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: "var(--sp-5)" }}>
            <div className="col-span-6">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", marginBottom: "var(--sp-3)" }}>
                <Badge variant="primary" icon={<IconCheck size={12} />}>
                  {invChecked.length} of {totalInvItems} selected
                </Badge>
                <div style={{ marginLeft: "auto", display: "flex", gap: "var(--sp-2)" }}>
                  <Button size="sm" variant="ghost" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleClearAll}>
                    Clear All
                  </Button>
                </div>
              </div>
              <TreeView
                data={inventoryTree}
                checked={invChecked}
                onCheckedChange={setInvChecked}
                label="Inventory Categories"
              />
            </div>
            <div
              className="col-span-6"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-3)",
              }}
            >
              <h4
                className="h4"
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "var(--fs-sm)",
                }}
              >
                Selected Items
              </h4>
              <div
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  minHeight: 120,
                }}
              >
                {invChecked.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-1)" }}>
                    {invChecked.map((id) => (
                      <Chip
                        key={id}
                        variant="primary"
                        size="sm"
                        onRemove={() => {
                          setInvChecked((prev) => prev.filter((i) => i !== id));
                        }}
                      >
                        {findLabelInTree(inventoryTree, id)}
                      </Chip>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>
                    Click checkboxes in the tree to select items
                  </span>
                )}
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Demo 2: Controlled Expansion ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Controlled Expansion"
            subtitle="Programmatically expand or collapse all nodes"
          />
        </PageCardHeader>
        <PageCardBody>
          <div style={{ display: "flex", gap: "var(--sp-2)", marginBottom: "var(--sp-4)" }}>
            <Button size="sm" variant="primary" onClick={handleExpandAll}>
              Expand All
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCollapseAll}>
              Collapse All
            </Button>
          </div>
          <div className="grid" style={{ gap: "var(--sp-5)" }}>
            <div className="col-span-6">
              <TreeView
                data={permissionsTree}
                expanded={permExpanded}
                onExpandedChange={setPermExpanded}
                label="System Permissions"
              />
            </div>
            <div
              className="col-span-6"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-3)",
              }}
            >
              <h4
                className="h4"
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "var(--fs-sm)",
                }}
              >
                Expanded Nodes
              </h4>
              <div
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                <span>
                  <strong style={{ color: "var(--text-primary)" }}>
                    {permExpanded.length}
                  </strong>{" "}
                  node{permExpanded.length !== 1 ? "s" : ""} currently expanded
                </span>
                <div style={{ marginTop: "var(--sp-2)", display: "flex", flexWrap: "wrap", gap: "var(--sp-1)" }}>
                  {permExpanded.map((id) => (
                    <Badge key={id} variant="muted">
                      {findLabelInTree(permissionsTree, id)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Demo 3: Multiple Independent Trees ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Multiple Independent Trees"
            subtitle="Two separate trees with independent selection state"
          />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: "var(--sp-5)" }}>
            <div className="col-span-6">
              <TreeView
                data={orgChartTree}
                checked={orgCheckedA}
                onCheckedChange={setOrgCheckedA}
                label="Team Alpha"
              />
              {orgCheckedA.length > 0 && (
                <div style={{ marginTop: "var(--sp-2)" }}>
                  <Badge variant="success" size="sm">
                    {orgCheckedA.length} member{orgCheckedA.length !== 1 ? "s" : ""} selected
                  </Badge>
                </div>
              )}
            </div>
            <div className="col-span-6">
              <TreeView
                data={orgChartTree}
                checked={orgCheckedB}
                onCheckedChange={setOrgCheckedB}
                label="Team Beta"
              />
              {orgCheckedB.length > 0 && (
                <div style={{ marginTop: "var(--sp-2)" }}>
                  <Badge variant="warning" size="sm">
                    {orgCheckedB.length} member{orgCheckedB.length !== 1 ? "s" : ""} selected
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </PageCardBody>
      </PageCard>

      {/* ── Demo 4: Large Dataset Tree ── */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Large Dataset Tree"
            subtitle="A more extensive tree demonstrating scrolling and performance with many nodes"
          />
        </PageCardHeader>
        <PageCardBody>
          <div className="grid" style={{ gap: "var(--sp-5)" }}>
            <div className="col-span-6">
              <TreeView
                data={[
                  {
                    id: "big-1",
                    label: "Department A",
                    children: Array.from({ length: 8 }, (_, i) => ({
                      id: `big-1-${i}`,
                      label: `Team ${String.fromCharCode(65 + i)}`,
                      children: Array.from({ length: 4 }, (_, j) => ({
                        id: `big-1-${i}-${j}`,
                        label: `Member ${j + 1}`,
                      })),
                    })),
                  },
                  {
                    id: "big-2",
                    label: "Department B",
                    children: Array.from({ length: 5 }, (_, i) => ({
                      id: `big-2-${i}`,
                      label: `Team ${String.fromCharCode(75 + i)}`,
                      children: Array.from({ length: 3 }, (_, j) => ({
                        id: `big-2-${i}-${j}`,
                        label: `Member ${j + 1}`,
                      })),
                    })),
                  },
                  {
                    id: "big-3",
                    label: "Department C",
                    children: Array.from({ length: 4 }, (_, i) => ({
                      id: `big-3-${i}`,
                      label: `Team ${String.fromCharCode(80 + i)}`,
                      children: Array.from({ length: 6 }, (_, j) => ({
                        id: `big-3-${i}-${j}`,
                        label: `Member ${j + 1}`,
                      })),
                    })),
                  },
                ]}
                label="Organization Structure (80+ nodes)"
              />
            </div>
            <div
              className="col-span-6"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-3)",
              }}
            >
              <h4
                className="h4"
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "var(--fs-sm)",
                }}
              >
                Performance Notes
              </h4>
              <div
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                <ul style={{ margin: 0, paddingLeft: "var(--sp-4)" }}>
                  <li>3 departments with nested teams and members</li>
                  <li>80+ total nodes in the hierarchy</li>
                  <li>All nodes initially expanded</li>
                  <li>Checkboxes cascade to all descendants</li>
                  <li>Indeterminate state shown on partially-selected parents</li>
                </ul>
              </div>
            </div>
          </div>
        </PageCardBody>
      </PageCard>
    </div>
  );
}
