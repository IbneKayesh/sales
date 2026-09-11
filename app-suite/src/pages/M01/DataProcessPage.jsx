import { useState } from "react";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
  PageCardFooter,
} from "@/components/PageCard";
import DataCard, { DataCardGrid } from "@/components/DataCard";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { IconInfo, IconPurchase } from "@/icons";
import Dropdown from "@/components/Dropdown";
import useDataProcess from "@/hooks/M01/useDataProcess";

const setupGroups = [
  {
    id: "M04",
    name: "Inventory",
    desc: "Products and Stock",
    icon: <IconPurchase size={20} />,
    sections: [
      {
        id: "M04-M01",
        name: "Average Cost",
        desc: "Process average cost",
        icon: <IconPurchase size={20} />,
        action: "PRODUCT_AVG_COST",
      },
      {
        id: "M04-M02",
        name: "Booking Purchase",
        desc: "Process average cost",
        icon: <IconPurchase size={20} />,
        action: "PRODUCT_AVG_COST",
      },
      {
        id: "M04-M03",
        name: "Booking Sales",
        desc: "Process average cost",
        icon: <IconPurchase size={20} />,
        action: "PRODUCT_AVG_COST",
      },
    ],
  },
  {
    id: "M08",
    name: "Accounts",
    desc: "Journal and Balance",
    icon: <IconPurchase size={20} />,
    sections: [
      {
        id: "M08-M02",
        name: "Sub-Ledger Current Balance",
        desc: "Process Calculate Current Balance",
        icon: <IconPurchase size={20} />,
        action: "SUB_LEDGER_CURRENT_BALANCE",
      },
    ],
  },
];

const DataProcessPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    tcVisibleItem,
    readOnly,
    stopEdit,
    listData,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    dpart_Options,
    //functions
    handleChange,
    handleEdit,
    handleCancel,
    handleSubmit,
  } = useDataProcess();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Pending Process"
            subtitle={`Some data are still unmergerd · need your quick actions · execute them`}
          />
          <PageCardActions>
            <div className="col-span-12">
              <Dropdown
                label="Department"
                options={dpart_Options}
                value={formData.dpart_id}
                onChange={(e) => handleChange("dpart_id", e.target.value)}
                error={formErrors.dpart_id}
                placeholder="Select..."
                required={true}
                //disabled={readOnly}
                optionValue="id"
                optionLabel="dpart_cname"
              />
            </div>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="module-page__list">
            {setupGroups.map((module) => (
              <PageCard key={module.id}>
                <PageCardHeader>
                  <div className="module-page__card-header">
                    <div className="module-page__card-icon">{module.icon}</div>
                    <PageCardTitle title={module.name} subtitle={module.desc} />
                  </div>
                  <PageCardActions>
                    <Badge variant="info" dot>
                      {module.sections.length} Process options
                    </Badge>
                  </PageCardActions>
                </PageCardHeader>
                <PageCardBody>
                  <DataCardGrid cols={module.sections.length > 1 ? 3 : 1}>
                    {module.sections.map((section) => (
                      <DataCard
                        key={section.id}
                        value={section.name}
                        label={section.desc}
                        icon={section.icon}
                        onClick={() => {
                          handleSubmit(section.action);
                        }}
                      >
                        <Button variant="outline" size="sm">
                          Execute
                        </Button>
                      </DataCard>
                    ))}
                  </DataCardGrid>
                </PageCardBody>
              </PageCard>
            ))}
          </div>
        </PageCardBody>
        <PageCardFooter>
          <Badge variant="info" icon={<IconInfo size={12} />}>
            Changes apply instantly to database
          </Badge>
        </PageCardFooter>
      </PageCard>
    </div>
  );
};

export default DataProcessPage;
