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
import Chip from "@/components/Chip";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import EmptyState from "@/components/EmptyState";
import TableColumns from "@/components/common/TableColumns";
import {
  IconBox,
  IconChart,
  IconClose,
  IconDollar,
  IconEdit,
  IconFile,
  IconInfo,
  IconMenu,
  IconPurchase,
  IconSearch,
  IconSettings,
} from "@/icons";
import useGridOptions from "@/hooks/M01/useGridOptions";

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

const PendingProcessPage = () => {
  const {
    isBusy,
    pgView,
    pageAuth,
    readOnly,
    stopEdit,
    formData,
    listDataItem,
    formDataItem,
    formErrors,
    //others
    //functions
    handleChange,
    handleSubmit,
    //modal
  } = useGridOptions();

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Pending Process"
            subtitle={`Some data are still unmergerd · need your quick actions · execute them`}
          />
          <PageCardActions></PageCardActions>
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

export default PendingProcessPage;
