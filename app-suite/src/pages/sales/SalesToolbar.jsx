import React from 'react';
import { IconSearch, IconPlus } from '@/assets/icons';
import styles from './SalesToolbar.module.css';

const SalesToolbar = ({ searchQuery, setSearchQuery, productFilter, setProductFilter, productsList, onAddTrigger }) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <h2 className={styles.title}>Sales Transactions</h2>
      </div>
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <IconSearch className={styles.searchIcon} />
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
          <IconPlus className={styles.addIcon} />
          New Sale
        </button>
      </div>
    </div>
  );
};

export default SalesToolbar;
