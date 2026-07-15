import React from 'react';
import { fmtCurrency, fmtDateLong } from '@/utils/dataFormat';
import CollapsiblePanel from '@/components/CollapsiblePanel/CollapsiblePanel';
import Skeleton from '@/components/Skeleton/Skeleton';
import { IconPackage, IconDollar, IconClock, IconEdit, IconDelete, IconBackArrow } from '@/assets/icons';
import styles from './ProductsPage.module.css';

const DetailSkeleton = () => (
  <div className={styles.detailArea}>
    <div className={styles.detailSkeletonHeader}>
      <Skeleton.Circle size={48} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <Skeleton.Line width="40%" height={18} />
        <Skeleton.Line width="25%" height={12} />
      </div>
    </div>

    <div className={styles.detailSkeletonPanel}>
      <Skeleton.Line width="30%" height={11} className={styles.skeletonPanelTitle} />
      <div className={styles.detailSkeletonGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Skeleton.Line width="50%" height={9} />
            <Skeleton.Line width="70%" height={13} />
          </div>
        ))}
      </div>
    </div>

    <div className={styles.detailSkeletonPanel}>
      <Skeleton.Line width="30%" height={11} className={styles.skeletonPanelTitle} />
      <div className={styles.detailSkeletonGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Skeleton.Line width="40%" height={9} />
            <Skeleton.Line width="50%" height={13} />
          </div>
        ))}
      </div>
    </div>

    <div className={styles.detailSkeletonActions}>
      <Skeleton.Block width={110} height={34} />
      <Skeleton.Block width={80} height={34} />
      <Skeleton.Block width={110} height={34} />
    </div>
  </div>
);

const ProductsDetailsView = ({ loading, product, onEdit, onDelete, onBack }) => {
  if (loading) return <DetailSkeleton />;

  const margin = product.margin || 0;
  const marginClass = margin >= 30 ? styles.marginGood : margin >= 10 ? styles.marginOk : styles.marginBad;
  const profit = Number(product.sellingPrice) - Number(product.costPrice || 0);

  return (
    <div className={styles.detailArea}>
      {/* Header card */}
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderIcon}>
          <IconPackage />
        </div>
        <div className={styles.detailHeaderInfo}>
          <h2 className={styles.detailTitle}>{product.name}</h2>
          <div className={styles.detailMeta}>
            <span className={styles.categoryBadge}>{product.category}</span>
            <code className={styles.productSku}>{product.sku}</code>
          </div>
        </div>
      </div>

      {/* Product Info Panel */}
      <CollapsiblePanel title="Product Information" icon={<IconPackage />} defaultOpen size="md" className={styles.collapsiblePanel}>
        <div className={styles.detailGrid}>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Product Name</span>
            <span className={styles.detailValue}>{product.name}</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>SKU</span>
            <code className={styles.detailValueMono}>{product.sku}</code>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Category</span>
            <span className={styles.categoryBadge}>{product.category}</span>
          </div>
          {product.description && (
            <div className={`${styles.detailField} ${styles.fieldFull}`}>
              <span className={styles.detailLabel}>Description</span>
              <span className={styles.detailValue}>{product.description}</span>
            </div>
          )}
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Created</span>
            <span className={styles.detailValue}>
              <IconClock className={styles.detailIconInline} />
              {fmtDateLong(product.createdAt)}
            </span>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Pricing Panel */}
      <CollapsiblePanel title="Pricing Information" icon={<IconDollar />} defaultOpen size="md" className={styles.collapsiblePanel}>
        <div className={styles.detailGrid}>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Cost Price</span>
            <span className={styles.detailValueMuted}>{fmtCurrency(Number(product.costPrice))}</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Selling Price</span>
            <span className={styles.detailValue}>{fmtCurrency(Number(product.sellingPrice))}</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Tax Rate</span>
            <span className={styles.detailValue}>{product.taxRate || 0}%</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Margin</span>
            <span className={`${styles.detailMargin} ${marginClass}`}>{margin}%</span>
          </div>
          {Number(product.costPrice) > 0 && Number(product.sellingPrice) > 0 && (
            <div className={`${styles.detailField} ${styles.fieldFull}`}>
              <div className={styles.priceSummary}>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Cost</span>
                  <span className={styles.priceCost}>{fmtCurrency(Number(product.costPrice))}</span>
                </div>
                <div className={styles.priceArrow}><span>→</span></div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Sell</span>
                  <span className={styles.priceSell}>{fmtCurrency(Number(product.sellingPrice))}</span>
                </div>
                <div className={styles.priceArrow}><span>→</span></div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Profit</span>
                  <span className={`${styles.priceProfit} ${profit >= 0 ? styles.marginGood : styles.marginBad}`}>
                    {fmtCurrency(profit)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapsiblePanel>

      {/* Variants Panel */}
      {product.variants && product.variants.length > 0 && (
        <CollapsiblePanel title={`Variants (${product.variants.length})`} icon={<IconPackage />} defaultOpen size="md" className={styles.collapsiblePanel}>
          <div className={styles.variantsDetailTable}>
            <div className={styles.variantsDetailHeader}>
              <span className={styles.variantsDetailTh}>#</span>
              <span className={styles.variantsDetailTh}>Name</span>
              <span className={styles.variantsDetailTh}>SKU</span>
              <span className={styles.variantsDetailTh}>Size</span>
              <span className={styles.variantsDetailTh}>Color</span>
              <span className={styles.variantsDetailTh}>Price Adj.</span>
              <span className={styles.variantsDetailTh}>Stock</span>
            </div>
            {product.variants.map((v, idx) => (
              <div key={v.id} className={styles.variantsDetailRow}>
                <span className={styles.variantsDetailTd}>{idx + 1}</span>
                <span className={styles.variantsDetailTd}><span className={styles.variantName}>{v.name}</span></span>
                <span className={styles.variantsDetailTd}><code className={styles.variantSku}>{v.sku}</code></span>
                <span className={styles.variantsDetailTd}>{v.size || '—'}</span>
                <span className={styles.variantsDetailTd}>
                  {v.color ? (
                    <><span className={styles.variantSwatchDetail} style={{ backgroundColor: v.color }} />{v.color}</>
                  ) : '—'}
                </span>
                <span className={styles.variantsDetailTd}>
                  {v.priceAdjustment !== 0 ? (
                    <span className={`${styles.variantPriceAdj} ${v.priceAdjustment > 0 ? styles.variantPriceUp : styles.variantPriceDown}`}>
                      {v.priceAdjustment > 0 ? '+' : ''}{fmtCurrency(v.priceAdjustment)}
                    </span>
                  ) : '—'}
                </span>
                <span className={styles.variantsDetailTd}>
                  <span className={`${styles.variantStock} ${v.stock <= 0 ? styles.variantStockNone : v.stock < 10 ? styles.variantStockLow : ''}`}>
                    {v.stock}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </CollapsiblePanel>
      )}

      {/* Action bar */}
      <div className={styles.detailActions}>
        <button className={styles.detailEditBtn} onClick={onEdit}>
          <IconEdit />
          Edit Product
        </button>
        <button className={styles.detailDeleteBtn} onClick={onDelete}>
          <IconDelete />
          Delete
        </button>
        <button className={styles.detailBackBtn} onClick={onBack}>
          <IconBackArrow />
          Back to List
        </button>
      </div>
    </div>
  );
};

export default ProductsDetailsView;
