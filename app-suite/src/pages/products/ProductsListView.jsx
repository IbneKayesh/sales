import React from 'react';
import { fmtCurrency, fmtDate } from '@/utils/dataFormat';
import DataTable from '@/components/DataTable/DataTable';
import Skeleton from '@/components/Skeleton/Skeleton';
import { IconPackage, IconEyeOpen, IconEdit, IconDelete } from '@/assets/icons';
import styles from './ProductsPage.module.css';

const ListSkeleton = () => (
  <>
    <div className={styles.statsRow}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.statItem}>
          <Skeleton.Line width="60%" height={20} />
          <Skeleton.Line width="40%" height={10} />
        </div>
      ))}
    </div>
    <div className={styles.tableSkeleton}>
      {/* Table header */}
      <div className={styles.tableSkeletonHeader}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton.Line key={i} height={12} width={i === 0 ? 180 : 80} />
        ))}
      </div>
      {/* Table rows */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className={styles.tableSkeletonRow}>
          <div className={styles.tableSkeletonCell}>
            <Skeleton.Circle size={26} />
            <Skeleton.Text lines={2} lineHeight={9} gap={4} />
          </div>
          <Skeleton.Line width={70} height={10} />
          <Skeleton.Line width={60} height={10} />
          <Skeleton.Line width={70} height={10} />
          <Skeleton.Line width={50} height={10} />
          <Skeleton.Line width={80} height={10} />
        </div>
      ))}
    </div>
  </>
);

const ProductsListView = ({
  loading,
  products,
  onAdd,
  onView,
  onEdit,
  onDelete,
  deletingId,
  totalProducts,
  avgMargin,
  totalValue,
}) => {
  if (loading) return <ListSkeleton />;

  return (
    <>
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{totalProducts}</span>
          <span className={styles.statLabel}>Total Products</span>
        </div>
        <div className={styles.statItem}>
          <span
            className={`${styles.statValue} ${avgMargin >= 30 ? styles.marginGood : avgMargin >= 10 ? styles.marginOk : styles.marginBad}`}
          >
            {avgMargin}%
          </span>
          <span className={styles.statLabel}>Avg. Margin</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{fmtCurrency(totalValue)}</span>
          <span className={styles.statLabel}>Portfolio Value</span>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            label: 'Product',
            sortable: true,
            render: (val, row) => {
              const vCount = row.variants ? row.variants.length : 0;
              return (
                <div className={styles.productCell}>
                  <div className={styles.productIcon}><IconPackage /></div>
                  <div className={styles.productInfo}>
                    <span className={styles.productName}>{val}</span>
                    <div className={styles.productMeta}>
                      <code className={styles.productSku}>{row.sku}</code>
                      {vCount > 0 && (
                        <span className={styles.variantCountBadge}>{vCount} var.</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            },
          },
          {
            key: 'category',
            label: 'Category',
            sortable: true,
            render: (val) => <span className={styles.categoryBadge}>{val}</span>,
          },
          {
            key: 'costPrice',
            label: 'Cost',
            align: 'right',
            sortable: true,
            render: (val) => <span className={styles.muted}>{fmtCurrency(val)}</span>,
          },
          {
            key: 'sellingPrice',
            label: 'Selling Price',
            align: 'right',
            sortable: true,
            render: (val) => <span className={styles.priceVal}>{fmtCurrency(val)}</span>,
          },
          {
            key: 'margin',
            label: 'Margin',
            align: 'right',
            sortable: true,
            render: (val) => (
              <span className={`${styles.marginBadge} ${val >= 30 ? styles.marginGood : val >= 10 ? styles.marginOk : styles.marginBad}`}>
                {val}%
              </span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Created',
            sortable: true,
            render: (val) => <span className={styles.muted}>{fmtDate(val)}</span>,
          },
          {
            key: 'actions',
            label: '',
            width: 110,
            render: (_, row) => (
              <div className={styles.actionsCell}>
                <button className={styles.viewBtn} onClick={() => onView(row.id)} aria-label="View product details">
                  <IconEyeOpen />
                </button>
                <button className={styles.editBtn} onClick={() => onEdit(row.id)} aria-label="Edit product">
                  <IconEdit />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onDelete(row.id, row.name)}
                  disabled={deletingId === row.id}
                  aria-label="Delete product"
                >
                  {deletingId === row.id ? (
                    <span className={styles.spinnerSmall} />
                  ) : (
                    <IconDelete />
                  )}
                </button>
              </div>
            ),
          },
        ]}
        data={products}
        keyField="id"
        sortable
        paginated
        pageSize={15}
        emptyMessage="No products found"
        emptyAction={{ label: 'Add Product', onClick: onAdd }}
        searchable={false}
        exportable
        exportFilename="products"
      />
    </>
  );
};

export default ProductsListView;
