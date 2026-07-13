import React, { useState } from 'react';
import { useSales } from '../../context/SalesContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import SalesToolbar from './SalesToolbar';
import SalesTable from './SalesTable';
import SaleForm from './SaleForm';
import styles from './SalesApp.module.css';

const SalesApp = () => {
  const { sales, addSale, updateSale, deleteSale } = useSales();
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [currentSaleId, setCurrentSaleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('All');

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = productFilter === 'All' || sale.product === productFilter;
    return matchesSearch && matchesProduct;
  });

  const handleAdd = (saleData) => {
    addSale(saleData);
    addToast({ message: `Sale transaction for ${saleData.customerName} created`, type: 'success' });
    setView('list');
  };

  const handleEdit = (saleData) => {
    updateSale(currentSaleId, saleData);
    addToast({ message: `Sale transaction for ${saleData.customerName} updated`, type: 'success' });
    setView('list');
    setCurrentSaleId(null);
  };

  const handleDelete = async (id, customerName) => {
    const isConfirmed = await confirm(
      'Delete Transaction',
      `Are you sure you want to delete the sale transaction for "${customerName}"? This action cannot be undone.`,
      { confirmLabel: 'Delete', cancelLabel: 'Keep', danger: true }
    );

    if (isConfirmed) {
      deleteSale(id);
      addToast({ message: `Transaction for ${customerName} deleted`, type: 'success' });
    }
  };

  const startEdit = (id) => {
    setCurrentSaleId(id);
    setView('edit');
  };

  const activeEditSale = sales.find((s) => s.id === currentSaleId);
  const productsList = ['All', ...new Set(sales.map((s) => s.product))];

  return (
    <div className={styles.container}>
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
          <div className={styles.content}>
            {filteredSales.length === 0 ? (
              <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <h3>No Transactions Found</h3>
                <p>Try refining your search terms or create a new sale entry to begin.</p>
                <button className={styles.emptyAddBtn} onClick={() => setView('add')}>
                  Create Transaction
                </button>
              </div>
            ) : (
              <SalesTable
                sales={filteredSales}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </>
      )}

      {view === 'add' && (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>Create New Sale</h2>
            <button className={styles.backBtn} onClick={() => setView('list')}>Cancel</button>
          </div>
          <SaleForm onSubmit={handleAdd} />
        </div>
      )}

      {view === 'edit' && activeEditSale && (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>Edit Sale</h2>
            <button className={styles.backBtn} onClick={() => {
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
