import React from 'react';
import styles from './SalesToolbar.module.css';

const SalesToolbar = ({ searchQuery, setSearchQuery, productFilter, setProductFilter, productsList, onAddTrigger }) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <h2 className={styles.title}>Sales Transactions</h2>
      </div>
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search customer or product…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          aria-label="Filter by product"
        >
          {productsList.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button className={styles.addBtn} onClick={onAddTrigger}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.addIcon}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Sale
        </button>
      </div>
    </div>
  );
};

export default SalesToolbar;
