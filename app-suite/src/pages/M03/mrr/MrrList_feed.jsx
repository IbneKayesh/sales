import React from "react";
import Badge from "@/components/Badge";
import ActionButton from "@/components/ActionButton";
import NegativeValue from "@/components/common/NegativeValue";
import { getRelativeDays } from "@/utils/datetime.js";
import "./MrrList.css";

const MrrList_feed = ({ listData, onEdit, onDelete }) => {
  if (!listData || listData.length === 0) {
    return <div className="text-center p-4 text-gray-500">No data found</div>;
  }

  return (
    <div className="mrr-feed-container">
      {listData.map((row, index) => (
        <div key={row.mrrdm_trnno || index} className="mrr-post-card">
          <div className="mrr-post-header">
            <div className="mrr-post-user-info">
              <div className="mrr-post-avatar">
                {row.cntct_cname
                  ? row.cntct_cname.charAt(0).toUpperCase()
                  : "S"}
              </div>
              <div className="mrr-post-meta">
                <span className="mrr-post-supplier">
                  {row.cntct_cname || "Unknown Supplier"}
                </span>
                <span className="mrr-post-dept">
                  {row.dpart_cname || "No Department"} •{" "}
                  <span
                    className={`${!row.mrrdm_actve && "text-red-500 font-semibold"}`}
                  >
                    {row.mrrdm_trnno}
                  </span>
                </span>
              </div>
            </div>
            <div className="mrr-post-date">
              {getRelativeDays(row.mrrdm_trdat)}
            </div>
          </div>

          <div className="mrr-post-body">
            <div className="mrr-post-ref">
              Reference No: <strong>{row.mrrdm_refno || "N/A"}</strong>
            </div>
            <div className="mrr-post-stats">
              <div className="mrr-post-stat-item">
                <span className="mrr-post-stat-label">Amount</span>
                <span className="mrr-post-stat-val">
                  <NegativeValue value={row.mrrdm_tramt} />
                </span>
              </div>
              <div className="mrr-post-stat-item">
                <span className="mrr-post-stat-label">Payable</span>
                <span className="mrr-post-stat-val">
                  <NegativeValue value={row.mrrdm_pyamt} />
                </span>
              </div>
              <div className="mrr-post-stat-item">
                <span className="mrr-post-stat-label">Due</span>
                <span className="mrr-post-stat-val">
                  <NegativeValue value={row.mrrdm_duamt} />
                </span>
              </div>
            </div>
          </div>

          <div className="mrr-post-footer">
            <div>
              <Badge
                variant={row.mrrdm_ispst ? "success" : "secondary"}
                size="sm"
              >
                {row.mrrdm_ispst ? "Posted" : "Not Posted"}
              </Badge>
            </div>
            <div className="mrr-post-actions">
              <ActionButton
                rowData={row}
                actve={row.mrrdm_actve}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MrrList_feed;
