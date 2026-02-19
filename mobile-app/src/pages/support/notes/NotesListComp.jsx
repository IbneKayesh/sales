import { Button } from "primereact/button";
import { formatDateTime } from "@/utils/datetime";

const NotesListComp = ({ dataList, onEdit, onDelete }) => {
  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  const statusMap = {
    "In Progress": {
      label: "In Progress",
      class: "badge-inprogress",
      icon: "pi-spinner",
    },
    Scheduled: {
      label: "Scheduled",
      class: "badge-scheduled",
      icon: "pi-calendar-plus",
    },
    Completed: {
      label: "Completed",
      class: "badge-completed",
      icon: "pi-check-circle",
    },
    Cancelled: {
      label: "Cancelled",
      class: "badge-cancelled",
      icon: "pi-times-circle",
    },
  };

  const getStatusInfo = (note) => {
    const status =
      note.notes_stat || (note.notes_actve ? "In Progress" : "Completed");
    if (status === "In Progress" && isExpired(note.notes_dudat)) {
      return {
        label: "Overdue",
        class: "badge-overdue",
        icon: "pi-exclamation-circle",
      };
    }
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
        <p className="text-600 font-medium">No notes found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid mt-1">
      {dataList.map((note) => {
        const status = getStatusInfo(note);
        const isFinished =
          note.notes_stat === "Completed" ||
          note.notes_stat === "Cancelled" ||
          (!note.notes_stat && !note.notes_actve);

        return (
          <div key={note.id} className="col-12 md:col-4 lg:col-3">
            <div className={`note-item-card ${isFinished ? "completed" : ""}`}>
              <div className={`note-card-header ${status?.class || ""}`}>
                <div className="flex align-items-center gap-2">
                  <i className={`pi ${status?.icon || "pi-tag"}`}></i>
                  <h3 className="note-card-title">{note.notes_title}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    className="text-500 hover:text-indigo-500"
                    size="small"
                    onClick={() => onEdit(note)}
                  />
                  <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    className="text-500 hover:text-red-500"
                    size="small"
                    onClick={() => onDelete(note)}
                  />
                </div>
              </div>

              <div className="note-card-body">
                {note.notes_descr || "No description provided."}
              </div>

              <div className="note-card-footer">
                <div className="note-date-tag">
                  <i className="pi pi-calendar"></i>
                  <span className="text-xs">{formatDateTime(note.notes_dudat)}</span>
                </div>
                <span className={`note-status-badge ${status.class}`}>
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

export default NotesListComp;
