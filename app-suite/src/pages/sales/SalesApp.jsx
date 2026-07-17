import { useState } from 'react';

import { IconMinusCircle } from '@/assets/icons';
import useSales from '../../hooks/useSales';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import SalesToolbar from './SalesToolbar';
import SalesTable from './SalesTable';
import SaleForm from './SaleForm';
import './SalesApp.css';
const SalesApp = () => {
  const { sales, addSale, updateSale, deleteSale } = useSales();
  const { addToast, addActionToast } = useToast();
  const { confirmWithAction } = useConfirm();
  const [view, setView] = useState('list');
  const [currentSaleId, setCurrentSaleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = productFilter === 'All' || sale.product === productFilter;
    return matchesSearch && matchesProduct;
  });

  const handleAdd = async (saleData) => {
    // Simulate network latency so the loading spinner is visible
    await new Promise((resolve) => setTimeout(resolve, 500));
    addSale(saleData);
    addToast({ message: `Sale transaction for ${saleData.customerName} created`, type: 'success' });
    await addActionToast(`Transaction for ${saleData.customerName} has been recorded`, 'success', 'sales');
    setView('list');
  };

  const handleEdit = async (saleData) => {
    // Simulate network latency so the loading spinner is visible
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateSale(currentSaleId, saleData);
    addToast({ message: `Sale transaction for ${saleData.customerName} updated`, type: 'success' });
    await addActionToast(`Transaction for ${saleData.customerName} has been updated`, 'success', 'sales');
    setView('list');
    setCurrentSaleId(null);
  };

  const handleDelete = async (id, customerName) => {
    await confirmWithAction(
      'Delete Transaction',
      `Are you sure you want to delete the sale transaction for "${customerName}"? This action cannot be undone.`,
      async () => {
        setDeletingId(id);
        await new Promise((resolve) => setTimeout(resolve, 500));
        deleteSale(id);
        setDeletingId(null);
        await addActionToast(`Transaction for ${customerName} has been deleted`, 'info', 'sales');
      },
      { confirmLabel: 'Delete', cancelLabel: 'Keep', danger: true, windowId: 'sales' }
    );
  };

  const startEdit = (id) => {
    setCurrentSaleId(id);
    setView('edit');
  };

  const activeEditSale = sales.find((s) => s.id === currentSaleId);
  const productsList = ['All', ...new Set(sales.map((s) => s.product))];

  return (
    <div className="container">
      {view === 'list' && (
        <>
          <SalesToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            productsList={productsList}
            onAddTrigger={() => setView('add')}
          />
          <div className="content">
            {filteredSales.length === 0 ? (
              <div className="emptyState">
                <IconMinusCircle className="emptyIcon" />
                <h3>No Transactions Found</h3>
                <p>Try refining your search terms or create a new sale entry to begin.</p>
                <button className="emptyAddBtn" onClick={() => setView('add')}>
                  Create Transaction
                </button>
              </div>
            ) : (
              <SalesTable
                sales={filteredSales}
                onEdit={startEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            )}
          </div>
        </>
      )}

      {view === 'add' && (
        <div className="formContainer">
          <div className="formHeader">
            <h2>Create New Sale</h2>
            <button className="backBtn" onClick={() => setView('list')}>Cancel</button>
          </div>
          <SaleForm onSubmit={handleAdd} />
        </div>
      )}

      {view === 'edit' && activeEditSale && (
        <div className="formContainer">
          <div className="formHeader">
            <h2>Edit Sale</h2>
            <button className="backBtn" onClick={() => {
              setView('list');
              setCurrentSaleId(null);
            }}>Cancel</button>
          </div>
          <SaleForm initialData={activeEditSale} onSubmit={handleEdit} />
        </div>
      )}
    </div>
  );
};

export default SalesApp;
