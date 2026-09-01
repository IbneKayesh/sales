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
    id: "M02",
    name: "Purchase (M02)",
    desc: "Purchase module column settings",
    icon: <IconPurchase size={20} />,
    screens: [
      {
        id: "MRR_DIRECT",
        name: "MRR (Direct)",
        desc: "Material Receipt Report",
        sections: [
          {
            id: "entry",
            name: "Entry",
            icon: <IconEdit size={14} />,
            options: [
              {
                id: "SYS_MRR_DIRECT_FORM",
                name: "Form Column",
                desc: "Configure visible columns in the MRR Entry form",
                modal: "SYS_MRR_DIRECT",
                table: "SYS_MRR_DIRECT_FORM",
                variant: "accent",
                icon: <IconSettings size={20} />,
                enabled: false,
              },
              {
                id: "SYS_MRR_DIRECT_ITEMS",
                name: "Form Item Grid",
                desc: "Configure visible columns in the MRR Entry item grid",
                modal: "SYS_MRR_DIRECT",
                table: "SYS_MRR_DIRECT_ITEMS",
                variant: "secondary",
                icon: <IconBox size={20} />,
                enabled: true,
              },
              {
                id: "SYS_MRR_DIRECT_PAYMENT",
                name: "Form Payment Grid",
                desc: "Configure visible columns in the MRR Entry payment grid",
                modal: "SYS_MRR_DIRECT",
                table: "SYS_MRR_DIRECT_PAYMENT",
                variant: "success",
                icon: <IconDollar size={20} />,
                enabled: false,
              },
              {
                id: "SYS_MRR_DIRECT_COSTING",
                name: "Form Costing Grid",
                desc: "Configure visible columns in the MRR Entry costing grid",
                modal: "SYS_MRR_DIRECT",
                table: "SYS_MRR_DIRECT_COSTING",
                variant: "warning",
                icon: <IconChart size={20} />,
                enabled: false,
              },
            ],
          },
          {
            id: "list",
            name: "List",
            icon: <IconMenu size={14} />,
            options: [
              {
                id: "SYS_MRR_DIRECT_LIST",
                name: "MRR Grid",
                desc: "Configure visible columns in the MRR list",
                modal: "SYS_MRR_DIRECT",
                table: "SYS_MRR_DIRECT_LIST",
                variant: "accent",
                icon: <IconFile size={20} />,
                enabled: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "M04",
    name: "Inventory (M04)",
    desc: "Inventory module column settings",
    icon: <IconBox size={20} />,
    screens: [
      {
        id: "ITEM",
        name: "Item",
        desc: "Inventory item records & pricing",
        sections: [
          {
            id: "entry",
            name: "Entry",
            icon: <IconEdit size={14} />,
            options: [
              {
                id: "SYS_ITEM_FORM",
                name: "Item Form Column",
                desc: "Configure visible columns in the Item entry form",
                modal: "SYS_INVENTORY_ITEMS",
                table: "SYS_ITEM_FORM",
                variant: "accent",
                icon: <IconSettings size={20} />,
                enabled: false,
              },
              {
                id: "SYS_ITEM_PRICE_FORM",
                name: "Price Form Column",
                desc: "Configure visible columns in the Item entry form",
                modal: "SYS_INVENTORY_ITEMS",
                table: "SYS_ITEM_PRICE_FORM",
                variant: "accent",
                icon: <IconSettings size={20} />,
                enabled: false,
              },
            ],
          },
          {
            id: "list",
            name: "List",
            icon: <IconMenu size={14} />,
            options: [
              {
                id: "SYS_INVENTORY_ITEMS_LIST",
                name: "Item Grid",
                desc: "Configure visible columns in the Item list",
                modal: "SYS_INVENTORY_ITEMS",
                table: "SYS_INVENTORY_ITEMS_LIST",
                variant: "warning",
                icon: <IconBox size={20} />,
                enabled: true,
              },
              {
                id: "SYS_INVENTORY_ITEMS_PRICE_LIST",
                name: "Item Grid > Price Grid",
                desc: "Configure visible columns in the Item price list",
                modal: "SYS_INVENTORY_ITEMS",
                table: "SYS_INVENTORY_ITEMS_PRICE_LIST",
                variant: "success",
                icon: <IconDollar size={20} />,
                enabled: true,
              },
            ],
          },
        ],
      },
      {
        id: "STOCK",
        name: "Stock",
        desc: "Inventory stock records",
        sections: [
          {
            id: "list",
            name: "List",
            icon: <IconMenu size={14} />,
            options: [
              {
                id: "SYS_INVENTORY_STOCK_ITEMS_LIST",
                name: "Stock Grid",
                desc: "Configure visible columns in the Stock list",
                modal: "SYS_INVENTORY_STOCK",
                table: "SYS_INVENTORY_STOCK_ITEMS_LIST",
                variant: "accent",
                icon: <IconFile size={20} />,
                enabled: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

const GridOptionsPage = () => {
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
    listTablColumns,
    //functions
    handleChange,
    //modal
    showModal,
    modalTitle,
    handleShowModal,
    handleHideModal,
  } = useGridOptions();
  
  const [searchQuery, setSearchQuery] = useState("");

  const searchLC = searchQuery.trim().toLowerCase();
  const isSearching = searchLC.length > 0;

  const matches = (option, module, screen, section) =>
    option.name.toLowerCase().includes(searchLC) ||
    option.desc.toLowerCase().includes(searchLC) ||
    section.name.toLowerCase().includes(searchLC) ||
    screen.name.toLowerCase().includes(searchLC) ||
    module.name.toLowerCase().includes(searchLC);

  const visibleGroups = setupGroups
    .map((module) => ({
      ...module,
      screens: module.screens
        .map((screen) => ({
          ...screen,
          sections: screen.sections
            .map((section) => ({
              ...section,
              options: section.options.filter((option) =>
                matches(option, module, screen, section),
              ),
            }))
            .filter((section) => section.options.length > 0),
        }))
        .filter((screen) => screen.sections.length > 0),
    }))
    .filter((module) => module.screens.length > 0);

  const countOptions = (modules) =>
    modules.reduce(
      (sum, module) =>
        sum +
        module.screens.reduce(
          (s, screen) =>
            s +
            screen.sections.reduce(
              (ss, section) => ss + section.options.length,
              0,
            ),
          0,
        ),
      0,
    );

  const totalOptions = countOptions(setupGroups);
  const readyOptions = countOptions(
    setupGroups.map((module) => ({
      ...module,
      screens: module.screens.map((screen) => ({
        ...screen,
        sections: screen.sections.map((section) => ({
          ...section,
          options: section.options.filter((option) => option.enabled),
        })),
      })),
    })),
  );

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Setup"
            subtitle={`${totalOptions} settings · ${readyOptions} ready · configure column visibility`}
          />
          <PageCardActions>
            <InputText
              placeholder="Search options…"
              icon={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dense
              aria-label="Search setup options"
            />
            {isSearching && (
              <Button
                variant="outline"
                size="sm"
                icon={<IconClose size={14} />}
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          {isSearching && visibleGroups.length === 0 ? (
            <EmptyState
              variant="noResults"
              title="No matching options"
              message={`Nothing matches “${searchQuery}”`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              }
            />
          ) : (
            <div className="module-page__list">
              {visibleGroups.map((module) => (
                <PageCard key={module.id}>
                  <PageCardHeader>
                    <div className="module-page__card-header">
                      <div className="module-page__card-icon">
                        {module.icon}
                      </div>
                      <PageCardTitle
                        title={module.name}
                        subtitle={module.desc}
                      />
                    </div>
                    <PageCardActions>
                      <Badge variant="info" dot>
                        {countOptions([module])} grid
                        {countOptions([module]) === 1 ? "" : "s"}
                      </Badge>
                    </PageCardActions>
                  </PageCardHeader>
                  <PageCardBody>
                    <div className="module-page__list">
                      {module.screens.map((screen) => (
                        <div key={screen.id}>
                          <div>
                            <PageCardTitle
                              title={screen.name}
                              subtitle={screen.desc}
                            />
                          </div>
                          {screen.sections.map((section) => (
                            <div key={section.id}>
                              <div className="module-page__card-header">
                                <Chip
                                  variant="outline"
                                  size="sm"
                                  icon={section.icon}
                                >
                                  {section.name}
                                </Chip>
                                <Badge variant="muted">
                                  {section.options.length}
                                </Badge>
                              </div>
                              <DataCardGrid
                                cols={section.options.length > 1 ? 2 : 1}
                              >
                                {section.options.map((option) => (
                                  <DataCard
                                    key={option.id}
                                    variant={option.variant}
                                    icon={option.icon}
                                    value={option.name}
                                    label={option.desc}
                                    onClick={
                                      option.enabled
                                        ? () =>
                                            handleShowModal(
                                              option.modal,
                                              option.table,
                                            )
                                        : undefined
                                    }
                                  >
                                    <Chip
                                      variant={
                                        option.enabled ? "outline" : "default"
                                      }
                                      size="sm"
                                      icon={
                                        option.enabled ? (
                                          <IconSettings size={12} />
                                        ) : undefined
                                      }
                                    >
                                      {option.enabled
                                        ? "Configure"
                                        : "Coming soon"}
                                    </Chip>
                                  </DataCard>
                                ))}
                              </DataCardGrid>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </PageCardBody>
                </PageCard>
              ))}
            </div>
          )}
        </PageCardBody>
        <PageCardFooter>
          <Badge variant="info" icon={<IconInfo size={12} />}>
            Changes apply instantly to list views
          </Badge>
        </PageCardFooter>
      </PageCard>

      {(showModal.modal === "SYS_MRR_DIRECT" ||
        showModal.modal === "SYS_INVENTORY_ITEMS" ||
        showModal.modal === "SYS_INVENTORY_STOCK") && (
        <TableColumns
          title={modalTitle.title}
          open={showModal}
          onClose={handleHideModal}
          cfColumns={listTablColumns}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default GridOptionsPage;
