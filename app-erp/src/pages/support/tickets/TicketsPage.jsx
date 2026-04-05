import { useState, useMemo } from "react";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import TicketsListComp from "./TicketsListComp";
import TicketsFormComp from "./TicketsFormComp";
import { useTickets } from "@/hooks/support/useTickets";
import "./TicketsUI.css";

const TicketsPage = () => {
  const {
    dataList,
    isBusy,
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
  } = useTickets();

  const [searchQuery, setSearchQuery] = useState("");

  const isList = currentView === "list";

  const filteredData = useMemo(() => {
    if (!Array.isArray(dataList)) return [];

    const lowerQuery = (searchQuery || "").toLowerCase().trim();
    if (!lowerQuery) return dataList;

    return dataList.filter((ticket) => {
      if (!ticket) return false;
      return (
        ticket.tickt_types?.toLowerCase().includes(lowerQuery) ||
        ticket.tickt_cmnte?.toLowerCase().includes(lowerQuery) ||
        ticket.tickt_rsnte?.toLowerCase().includes(lowerQuery)
      );
    });
  }, [dataList, searchQuery]);

  const sections = useMemo(() => {
    const data = filteredData || [];

    const opened = data.filter(
      (t) =>
        t && (t.tickt_cmsts === "Opened" || (!t.tickt_cmsts && t.tickt_actve)),
    );
    const pending = data.filter((t) => t && t.tickt_cmsts === "Pending");
    const resolved = data.filter(
      (t) =>
        t &&
        (t.tickt_cmsts === "Resolved" || (!t.tickt_cmsts && !t.tickt_actve)),
    );
    const closed = data.filter((t) => t && t.tickt_cmsts === "Closed");

    return { opened, pending, resolved, closed };
  }, [filteredData]);

  return (
    <div className="tickets-page-container">
      <div className="tickets-header-section flex flex-column md:flex-row md:align-items-center justify-content-between gap-4">
        <div>
          <h1 className="tickets-title">
            {isList
              ? "Support Tickets"
              : formData.id
                ? "Edit Ticket"
                : "Raise New Ticket"}
          </h1>
          <p className="tickets-subtitle">
            {isList
              ? "Track and manage your requests."
              : "Provide details about your issue or feedback."}
          </p>
        </div>

        <div className="flex flex-column md:flex-row md:align-items-center gap-3 w-full md:w-auto mt-3 md:mt-0">
          {isList && (
            <div className="relative w-full md:w-20rem">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search text-500" />
                <InputText
                  placeholder="Search tickets..."
                  className="w-full border-round-xl border-1 border-200 focus:border-pink-500 transition-all opacity-90 pr-6"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </IconField>
              {searchQuery && (
                <i
                  className="pi pi-times absolute cursor-pointer text-400 hover:text-600"
                  style={{
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
          )}

          <div className="flex gap-2">
            {isList ? (
              <>
                <Button
                  icon="pi pi-refresh"
                  className="action-btn-ghost"
                  onClick={handleRefresh}
                  tooltip="Refresh"
                  tooltipOptions={{ position: "bottom" }}
                />
                <Button
                  label="New Ticket"
                  icon="pi pi-plus"
                  className="action-btn-primary"
                  onClick={handleAddNew}
                />
              </>
            ) : (
              <Button
                label="Back to List"
                icon="pi pi-arrow-left"
                className="action-btn-ghost"
                onClick={handleCancel}
              />
            )}
          </div>
        </div>
      </div>

      {isList && (
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon-wrapper stats-icon-blue">
              <i className="pi pi-info-circle"></i>
            </div>
            <div className="stats-info">
              <span className="stats-label">Opened</span>
              <span className="stats-value">{sections.opened.length}</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon-wrapper stats-icon-red">
              <i className="pi pi-clock"></i>
            </div>
            <div className="stats-info">
              <span className="stats-label">Pending</span>
              <span className="stats-value">{sections.pending.length}</span>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon-wrapper stats-icon-green">
              <i className="pi pi-check-circle"></i>
            </div>
            <div className="stats-info">
              <span className="stats-label">Resolved</span>
              <span className="stats-value">{sections.resolved.length}</span>
            </div>
          </div>
        </div>
      )}

      <div className="content-area">
        {currentView === "list" ? (
          <TabView className="tickets-tabview">
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>Opened</span>
                  <Badge value={sections.opened.length} severity="info"></Badge>
                </div>
              }
            >
              <TicketsListComp
                dataList={sections.opened}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>Pending</span>
                  <Badge
                    value={sections.pending.length}
                    severity="warning"
                  ></Badge>
                </div>
              }
            >
              <TicketsListComp
                dataList={sections.pending}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>Resolved</span>
                  <Badge
                    value={sections.resolved.length}
                    severity="success"
                  ></Badge>
                </div>
              }
            >
              <TicketsListComp
                dataList={sections.resolved}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel
              header={
                <div className="flex align-items-center gap-2">
                  <span>Closed</span>
                  <Badge
                    value={sections.closed.length}
                    severity="secondary"
                  ></Badge>
                </div>
              }
            >
              <TicketsListComp
                dataList={sections.closed}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel header="Full History">
              <TicketsListComp
                dataList={filteredData}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabPanel>
          </TabView>
        ) : (
          <div className="flex justify-content-center">
            <div style={{ width: "100%", maxWidth: "800px" }}>
              <TicketsFormComp
                isBusy={isBusy}
                errors={errors}
                formData={formData}
                onChange={handleChange}
                onSave={handleSave}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
