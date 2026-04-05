import { Button } from "primereact/button";
import { formatDateTime } from "@/utils/datetime";

const TicketsListComp = ({ dataList, onEdit, onDelete }) => {
  const statusMap = {
    Opened: {
      label: "Opened",
      class: "badge-opened",
      icon: "pi-info-circle",
    },
    Pending: {
      label: "Pending",
      class: "badge-pending",
      icon: "pi-clock",
    },
    Resolved: {
      label: "Resolved",
      class: "badge-resolved",
      icon: "pi-check-circle",
    },
    Closed: {
      label: "Closed",
      class: "badge-closed",
      icon: "pi-lock",
    },
  };

  const getStatusInfo = (ticket) => {
    const status =
      ticket.tickt_cmsts || (ticket.tickt_actve ? "Opened" : "Resolved");
    return (
      statusMap[status] || {
        label: status,
        class: "badge-pending",
        icon: "pi-tag",
      }
    );
  };

  if (!dataList || dataList.length === 0) {
    return (
      <div className="text-center p-8 bg-white border-round-xl border-1 border-300">
        <i className="pi pi-folder-open text-4xl text-400 mb-3"></i>
        <p className="text-600 font-medium">
          No tickets found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid mt-1">
      {dataList.map((ticket) => {
        const status = getStatusInfo(ticket);
        const isFinished =
          ticket.tickt_cmsts === "Resolved" ||
          ticket.tickt_cmsts === "Closed" ||
          (!ticket.tickt_cmsts && !ticket.tickt_actve);

        return (
          <div key={ticket.id} className="col-12 md:col-6 lg:col-4">
            <div className={`ticket-item-card ${isFinished ? "resolved" : ""}`}>
              <div className={`ticket-card-header ${status?.class || ""}`}>
                <div className="flex align-items-center gap-2">
                  <i className={`pi ${status?.icon || "pi-tag"}`}></i>
                  <h3 className="ticket-card-title">{ticket.tickt_types}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    className="text-500 hover:text-pink-500"
                    size="small"
                    onClick={() => onEdit(ticket)}
                  />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    className="text-500 hover:text-red-500"
                    size="small"
                    onClick={() => onDelete(ticket)}
                  />
                </div>
              </div>

              <div className="ticket-card-body">
                {ticket.tickt_cmnte || "No comment provided."}
              </div>

              <div className="ticket-card-footer">
                <div className="ticket-date-tag">
                  <i className="pi pi-calendar"></i>
                  <span className="text-xs">
                    {formatDateTime(ticket.tickt_cmdat)}
                  </span>
                </div>
                <span className={`ticket-status-badge ${status.class}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketsListComp;
