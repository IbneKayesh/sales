import React from "react";
import { Search, Plus, UserPlus, ChevronRight, Star } from "lucide-react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { formatDate } from "@/utils/datetime";

const OutletListComp = ({
  dataList,
  isBusy,
  searchData,
  setSearchData,
  onCreateNew,
}) => {
  const op = useRef(null);
  const handleViewDetail = (id) => {
    console.log("View detail:", id);
  };
  return (
    <div className="lite-card">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <IconField iconPosition="left" className="search-field">
            <InputIcon className="pi pi-search" />
            <InputText
              placeholder="Search"
              size="small"
              className="w-full"
              value={searchData.search}
              onChange={(e) =>
                setSearchData({ ...searchData, search: e.target.value })
              }
            />
          </IconField>
          <Button
            icon="pi pi-filter"
            rounded
            text
            severity="secondary"
            size="small"
            className="search-filter-btn"
            onClick={(e) => op.current.toggle(e)}
          />
        </div>

        <OverlayPanel ref={op} dismissable>
          <div className="grid w-20rem">
            <div className="col-12">
              <label className="filter-label">Filter by Status</label>
            </div>
            <div className="col-12">
              <Dropdown
                value={searchData.status}
                onChange={(e) =>
                  setSearchData({ ...searchData, status: e.value })
                }
                placeholder="Select Status"
                className="w-full"
                size="small"
              />
            </div>

            <div className="col-12">
              <Calendar
                value={searchData.date}
                onChange={(e) =>
                  setSearchData({ ...searchData, date: e.value })
                }
                placeholder="Select Date"
                className="w-full"
                size="small"
              />
            </div>
          </div>
        </OverlayPanel>
      </div>

      <div className="lite-card-divider"></div>
      <div className="list-container">
        {dataList.length === 0 && (
          <div className="lite-card-item">
            <div className="lite-card-item-left">
              <div className="lite-card-item-left-title">No outlets found</div>
            </div>
          </div>
        )}
        {dataList.map((item) => (
          <div key={item.id} className="lite-card-item">
            <div className="lite-card-item-left">
              <div className="lite-card-item-left-title">
                {item.cntct_cntnm}
              </div>
              <div className="lite-card-item-left-subtitle">
                {item.cntct_cntps}, {item.cntct_cntno}
              </div>
            </div>
            <div className="lite-card-item-right">
              <div className="lite-card-item-right-value">
                {item.cntct_ofadr}
              </div>
              <div className="lite-card-item-right-tag">
                <span className="badge-pill">{item.tarea_tname}, {item.dzone_dname}</span>
              </div>
            </div>
            <div className="lite-card-item-footer">
              <>
                <button className="lite-button lite-button-info lite-button-sm">
                  <span className="pi pi-eye mr-1 text-xs"></span>
                  View
                </button>

                <button className="lite-button lite-button-info lite-button-sm">
                  <span className="pi pi-pencil mr-1 text-xs"></span>
                  Edit
                </button>
              </>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletListComp;
