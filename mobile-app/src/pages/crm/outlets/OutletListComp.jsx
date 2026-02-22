import React from "react";
import { Search, Plus, UserPlus, ChevronRight, Star } from "lucide-react";

const OutletListComp = ({
  outlets,
  searchTerm,
  setSearchTerm,
  handleViewDetail,
  handleAdd,
}) => {
  return (
    <div className="app-content">
      <div className="search-container">
        <div className="search-inner">
          <div className="search-box">
            <Search size={18} className="search-icon-global" />
            <input
              type="text"
              placeholder="Search outlets..."
              className="form-input search-input-global"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleAdd} className="header-side-btn">
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      <div className="list-container">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="card list-item-card"
            onClick={() => handleViewDetail(outlet.id)}
          >
            <div className="list-item-row">
              <div className="list-item-left">
                <div className="avatar-round">{outlet.initials}</div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span className="item-main-text">{outlet.name}</span>
                    {outlet.tag === "VIP" && (
                      <Star size={14} color="#F97316" fill="#F97316" />
                    )}
                  </div>
                  <div className="item-sub-text">{outlet.phone}</div>
                  <div
                    className="item-tag"
                    style={{
                      background: `${outlet.color}15`,
                      color: outlet.color,
                    }}
                  >
                    {outlet.tag}
                  </div>
                </div>
              </div>

              <div className="list-item-right">
                <div className="label-small">Total Spent</div>
                <div className="value-bold">
                  ${outlet.spent.toLocaleString()}
                </div>
                <ChevronRight
                  size={18}
                  color="var(--border)"
                  style={{ marginTop: "4px" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleAdd} className="btn-fab">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default OutletListComp;
