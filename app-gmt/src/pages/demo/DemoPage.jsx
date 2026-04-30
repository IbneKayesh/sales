import React, { useState } from "react";
import Layout from "../layout/Layout";
import JCard from "../../components/common/JCard";
import JButton from "../../components/common/JButton";
import JInput from "../../components/common/JInput";
import JCalendar from "../../components/common/JCalendar";
import JDropdown from "../../components/common/JDropdown";
import JTable from "../../components/common/JTable";
import JBusy from "../../components/common/JBusy";
import { useAppUI } from "../../hooks/useAppUI";

// Sample data for JTable
const sampleTableData = [
  { id: 1, name: "John Smith", email: "john.smith@company.com", department: "Engineering", status: "Active", salary: 85000 },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@company.com", department: "Marketing", status: "Active", salary: 72000 },
  { id: 3, name: "Michael Brown", email: "m.brown@company.com", department: "Sales", status: "Active", salary: 68000 },
  { id: 4, name: "Emily Davis", email: "emily.d@company.com", department: "HR", status: "Inactive", salary: 65000 },
  { id: 5, name: "David Wilson", email: "d.wilson@company.com", department: "Finance", status: "Active", salary: 78000 },
  { id: 6, name: "Lisa Anderson", email: "lisa.a@company.com", department: "Engineering", status: "Active", salary: 92000 },
  { id: 7, name: "James Taylor", email: "j.taylor@company.com", department: "Operations", status: "Active", salary: 62000 },
  { id: 8, name: "Jennifer Martinez", email: "jennifer.m@company.com", department: "Marketing", status: "Active", salary: 71000 },
  { id: 9, name: "Robert Garcia", email: "r.garcia@company.com", department: "Sales", status: "Active", salary: 69000 },
  { id: 10, name: "Amanda Lee", email: "amanda.l@company.com", department: "Engineering", status: "Active", salary: 88000 },
  { id: 11, name: "Christopher Hall", email: "c.hall@company.com", department: "Finance", status: "Active", salary: 82000 },
  { id: 12, name: "Michelle White", email: "m.white@company.com", department: "HR", status: "Active", salary: 64000 },
];

const tableColumns = [
  { key: "id", header: "ID", width: "60px" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "department", header: "Department" },
  { 
    key: "status", 
    header: "Status",
    render: (val) => (
      <span style={{ 
        padding: "2px 8px", 
        borderRadius: "10px", 
        fontSize: "11px",
        background: val === "Active" ? "var(--accent-light)" : "var(--border-color)",
        color: val === "Active" ? "var(--primary)" : "var(--text-secondary)"
      }}>
        {val}
      </span>
    )
  },
  { 
    key: "salary", 
    header: "Salary",
    render: (val) => `$${val.toLocaleString()}`
  },
];

const DemoPage = () => {
  const { showToast, showAlert, showDialog, hideDialog } = useAppUI();
  
  // Form state
  const [formData, setFormData] = useState({
    username: "John Doe",
    email: "john@example.com",
    password: "",
    dateofbirth: "2026-01-01",
    start_date_time: "",
    gender: "male",
    department: "",
    notes: "",
    isActive: true,
  });

  // Select options
  const [genderList] = useState([
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]);

  const [departmentList] = useState([
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "hr", label: "Human Resources" },
    { value: "finance", label: "Finance" },
    { value: "operations", label: "Operations" },
  ]);

  const [multiSelectList] = useState([
    { value: "read", label: "Read" },
    { value: "write", label: "Write" },
    { value: "delete", label: "Delete" },
    { value: "admin", label: "Admin" },
  ]);

  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [isBusy, setIsBusy] = useState(false);

  // Handlers
  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, values) => {
    setFormData((prev) => ({ ...prev, [field]: values.join(",") }));
  };

  const handleShowDialog = () => {
    showDialog({
      title: "Demo Dialog",
      body: (
        <div style={{ padding: "10px 0" }}>
          <p style={{ marginBottom: "15px", fontSize: "13px", opacity: 0.8 }}>
            This is a premium J-series dialog template. You can embed any
            component here.
          </p>
          <JInput label="Feedback" placeholder="How is the UI?" size="sm" />
        </div>
      ),
      footer: (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <JButton variant="secondary" size="sm" onClick={hideDialog}>
            Cancel
          </JButton>
          <JButton
            variant="primary"
            size="sm"
            onClick={() => {
              showToast("Feedback received!", "success");
              hideDialog();
            }}
          >
            Submit
          </JButton>
        </div>
      ),
    });
  };

  const handleShowBusy = () => {
    setIsBusy(true);
    setTimeout(() => setIsBusy(false), 2000);
  };

  const handleExport = () => {
    showToast("Data exported to CSV!", "success");
  };

  return (
    <Layout>
      <div className="erp-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}>
        
        {/* ============ INPUT COMPONENTS ============ */}
        <JCard title="1. Input Components" subtitle="Text, Number, Password, Search, Multi-select">
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <JInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => onChange("username", e.target.value)}
              placeholder="Enter username"
              size="md"
            />
            
            <JInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="Enter email"
              error="Please enter a valid email"
              size="md"
            />

            <JInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Enter password"
              size="md"
            />

            <JInput
              label="Search"
              name="search"
              type="search"
              placeholder="Search..."
              size="md"
            />

            <JInput
              label="Number Input"
              name="age"
              type="number"
              placeholder="Enter age"
              size="md"
            />

            <JDropdown
              label="Multi-Select Demo"
              name="permissions"
              value={selectedPermissions.join(",")}
              onChange={(val) => setSelectedPermissions(val ? val.split(",") : [])}
              options={multiSelectList}
              placeholder="Select permissions..."
              size="md"
            />
          </div>
        </JCard>

        {/* ============ CALENDAR ============ */}
        <JCard title="2. Calendar Components" subtitle="Date and DateTime pickers">
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <JCalendar
              label="Date of Birth"
              name="dateofbirth"
              value={formData.dateofbirth}
              onChange={(e) => onChange("dateofbirth", e.target.value)}
              format="date"
              size="md"
            />

            <JCalendar
              label="Start Date & Time"
              name="start_date_time"
              value={formData.start_date_time}
              onChange={(e) => onChange("start_date_time", e.target.value)}
              format="datetime"
              size="md"
            />
          </div>
        </JCard>

        {/* ============ DROPDOWN ============ */}
        <JCard title="3. Dropdown Components" subtitle="Single and Multi-select">
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <JDropdown
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={(val) => onChange("gender", val)}
              options={genderList}
              placeholder="Select gender..."
              size="md"
            />

            <JDropdown
              label="Department"
              name="department"
              value={formData.department}
              onChange={(val) => onChange("department", val)}
              options={departmentList}
              placeholder="Select department..."
              size="md"
            />
          </div>
        </JCard>

        {/* ============ TEXTAREA ============ */}
        <JCard title="4. Textarea" subtitle="Multi-line text input">
          <JInput
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Enter additional notes..."
            rows={3}
            size="md"
          />
        </JCard>

        {/* ============ BUTTONS ============ */}
        <JCard title="5. Button Variants" subtitle="All button styles and states">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Button Sizes */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", opacity: 0.7 }}>Sizes</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <JButton variant="primary" size="sm">Small</JButton>
                <JButton variant="primary" size="md">Medium</JButton>
                <JButton variant="primary" size="lg">Large</JButton>
              </div>
            </div>

            {/* Button Variants */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", opacity: 0.7 }}>Variants</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <JButton variant="primary">Primary</JButton>
                <JButton variant="secondary">Secondary</JButton>
                <JButton variant="success">Success</JButton>
                <JButton variant="danger">Danger</JButton>
                <JButton variant="info">Info</JButton>
                <JButton variant="warning">Warning</JButton>
                <JButton variant="outline">Outline</JButton>
                <JButton variant="ghost">Ghost</JButton>
              </div>
            </div>

            {/* Button States */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "10px", opacity: 0.7 }}>States</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <JButton variant="primary">Normal</JButton>
                <JButton variant="primary" disabled>Disabled</JButton>
                <JButton variant="primary" loading>Loading</JButton>
                <JButton variant="primary" icon="✏️">With Icon</JButton>
              </div>
            </div>
          </div>
        </JCard>

        {/* ============ TOASTS & ALERTS ============ */}
        <JCard title="6. Toast Notifications & Alerts" subtitle="Interactive feedback">
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "5px", opacity: 0.7 }}>Toast Types</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <JButton variant="success" size="sm" onClick={() => showToast("Operation successful!", "success")}>
                Success Toast
              </JButton>
              <JButton variant="info" size="sm" onClick={() => showToast("System notification", "info")}>
                Info Toast
              </JButton>
              <JButton variant="danger" size="sm" onClick={() => showToast("Critical Error", "danger", "Details: Server unreachable")}>
                Danger Toast
              </JButton>
              <JButton variant="warning" size="sm" onClick={() => showToast("Warning: Low disk space", "warning")}>
                Warning Toast
              </JButton>
            </div>

            <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "5px", opacity: 0.7, marginTop: "10px" }}>Alert & Dialog</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <JButton variant="warning" size="sm" onClick={() => showAlert("Confirm data deletion?", () => showToast("Record deleted", "success"))}>
                Test Alert
              </JButton>
              <JButton variant="primary" size="sm" onClick={handleShowDialog}>
                Test Dialog
              </JButton>
              <JButton variant="primary" size="sm" onClick={handleShowBusy}>
                Show Busy
              </JButton>
            </div>
          </div>
        </JCard>

        {/* ============ DATA TABLE ============ */}
        <JCard title="7. Data Table (JTable)" subtitle="Sortable, searchable, paginated">
          <JTable
            columns={tableColumns}
            data={sampleTableData}
            compact={true}
            onExport={handleExport}
            itemsPerPage={5}
          />
        </JCard>

        {/* ============ FORM STATE ============ */}
        <JCard title="8. Form State" subtitle="Live data preview">
          <pre
            style={{
              background: "var(--bg-main)",
              border: "1px solid var(--border-color)",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "11px",
              color: "var(--text-main)",
              lineHeight: 1.6,
              overflow: "auto",
              maxHeight: "200px",
            }}
          >
            {JSON.stringify(formData, null, 2)}
          </pre>
        </JCard>

        {/* ============ CALENDAR VIEW ============ */}
        <JCard title="9. Calendar View" subtitle="Monthly calendar display">
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px", opacity: 0.7 }}>Monthly View</div>
              <JCalendar
                value=""
                onChange={(e) => console.log("Selected:", e.target.value)}
                format="date"
              />
            </div>
          </div>
        </JCard>

        {/* ============ BUTTON ACTIONS ============ */}
        <JCard title="10. Action Buttons" subtitle="Primary actions for forms">
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <JButton variant="secondary" onClick={() => setFormData({
              username: "",
              email: "",
              password: "",
              dateofbirth: "",
              start_date_time: "",
              gender: "",
              department: "",
              notes: "",
              isActive: false,
            })}>
              Cancel
            </JButton>
            <JButton variant="primary" onClick={() => showToast("Form saved!", "success")}>
              Save Changes
            </JButton>
          </div>
        </JCard>

      </div>

      {/* Busy Overlay */}
      {isBusy && <JBusy fullApp message="Fetching data from server..." />}
    </Layout>
  );
};

export default DemoPage;
