import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  IconPlus,
  IconEdit,
  IconDelete,
  IconSave,
  IconSearch,
  IconBackArrow,
  IconClose,
} from "@/assets/icons";
import PageShell from "@/components/PageShell/PageShell";
import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import useProduction from "@/hooks/M05/useProduction.js";
import ProductFormView from "./ProductFormView.jsx";

const ProductionPage = () => {
  const {
    //hooks
    pageAuth,
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    //functions
    handleAddNew,
    handleChange,
  } = useProduction();

  const crButtons = useMemo(
    () => [
      {
        id: "new",
        label: "New",
        icon: <IconPlus />,
        onClick: handleAddNew,
        views: ["SYS_LST_1"],
      },
    ],
    [crView],
  );

  
  const vsButtons = useMemo(() => {
    return crButtons.filter((btn) => btn.views.includes(crView));
  }, [crButtons, crView]);

  const handleTbAction = useCallback(
    (id) => {
      const btn = vsButtons.find((b) => b.id === id);
      if (btn?.onClick) btn.onClick();
    },
    [vsButtons],
  );


  return (
    <PageShell title="Production" subtitle="Production Items" compact>
      <PageShell.Actions>
        {vsButtons.length > 0 && (
          <ButtonGroup
            buttons={vsButtons}
            activeId={null}
            onChange={handleTbAction}
            size="sm"
            variant="filled"
            ariaLabel="Products actions"
          />
        )}
      </PageShell.Actions>
      <PageShell.Stats></PageShell.Stats>
      <PageShell.Body>
        <ProductFormView/>
      </PageShell.Body>
      <PageShell.Footer></PageShell.Footer>
    </PageShell>
  );
};
export default ProductionPage;
