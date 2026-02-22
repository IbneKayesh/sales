import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

const OrderList = ({
  dataList,
  isBusy,
  searchData,
  setSearchData,
  orderStatusOptions,
  filteredOrders,
}) => {
  const op = useRef(null);

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
                options={orderStatusOptions}
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
        <div className="lite-card-item">
          <div className="lite-card-item-left">
            <div className="lite-card-item-left-title">Title</div>
            <div className="lite-card-item-left-subtitle">Subtitle</div>
          </div>
          <div className="lite-card-item-right">
            <div className="lite-card-item-right-value">Value</div>
            <div className="lite-card-item-right-tag">tag</div>
          </div>
          <div className="lite-card-item-footer">
            button 1, button 2, button 3, align right
          </div>
        </div>

        <div className="lite-card-item">
          <div className="lite-card-item-left">
            <div className="lite-card-item-left-title">Title</div>
            <div className="lite-card-item-left-subtitle">Subtitle</div>
          </div>
          <div className="lite-card-item-right">
            <div className="lite-card-item-right-value">Value</div>
            <div className="lite-card-item-right-tag">tag</div>
          </div>
          <div className="lite-card-item-footer">
            button 1, button 2, button 3, align right
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderList;
