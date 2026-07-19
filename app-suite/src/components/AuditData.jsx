import Badge from "@/components/Badge";
import { IconClose, IconCheck } from "@/icons";
import { formatDateTime } from "@/utils/datetime.js";

const AuditData = ({ actve, cname, cdate, uname, udate, rvnmr }) => {
  return (
    <div
      className="grid text-muted rounded-lg badge--primary"
      style={{ padding: "10px", fontSize: "12px" }}
    >
      <div className="col-span-2">
        {
          <Badge variant={actve ? "success" : "danger"}>
            {actve ? <IconCheck size={12} /> : <IconClose size={12} />}
            {actve ? "Active" : "Inactive"}
          </Badge>
        }
      </div>
      <div className="col-span-2">{cname}</div>
      <div className="col-span-2">{formatDateTime(cdate)}</div>
      <div className="col-span-2">{uname}</div>
      <div className="col-span-2">{formatDateTime(udate)}</div>
      <div className="col-span-2">{rvnmr}</div>
    </div>
  );
};
export default AuditData;
