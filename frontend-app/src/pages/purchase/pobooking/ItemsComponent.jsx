  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formDataList || formDataList.length === 0) return;

    const extraCost =
      (formData.include_cost || 0) + (formData.exclude_cost || 0);

    // Calculate grand total of all items (before extra cost distribution)
    const grandTotal = formDataList.reduce(
      (sum, item) => sum + (item.total_amount || 0),
      0
    );

    if (grandTotal === 0) return;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataList.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = item.total_amount / item.product_qty;

      // Calculate this item's share of extra cost (proportional to its total_amount)
      const extraCostShare = (item.total_amount / grandTotal) * extraCost;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostShare / item.product_qty;

      return {
        ...item,
        cost_price: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some(
      (item, index) => item.cost_price !== formDataList[index].cost_price
    );

    if (hasChanged) {
      setFormDataList(updatedItems);
    }
  }, [formData?.include_cost, formData?.exclude_cost, formDataList.length]);
