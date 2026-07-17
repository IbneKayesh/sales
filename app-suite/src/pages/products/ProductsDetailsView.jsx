
import { fmtCurrency, fmtDateLong } from '@/utils/dataFormat';
import CollapsiblePanel from '@/components/CollapsiblePanel/CollapsiblePanel';
import Skeleton from '@/components/Skeleton/Skeleton';
import { IconPackage, IconDollar, IconClock, IconEdit, IconDelete, IconBackArrow } from '@/assets/icons';
import './ProductsPage.css';
const DetailSkeleton = () => (
  <div className="detailArea">
    <div className="detailSkeletonHeader">
      <Skeleton.Circle size={48} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <Skeleton.Line width="40%" height={18} />
        <Skeleton.Line width="25%" height={12} />
      </div>
    </div>

    <div className="detailSkeletonPanel">
      <Skeleton.Line width="30%" height={11} className="skeletonPanelTitle" />
      <div className="detailSkeletonGrid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Skeleton.Line width="50%" height={9} />
            <Skeleton.Line width="70%" height={13} />
          </div>
        ))}
      </div>
    </div>

    <div className="detailSkeletonPanel">
      <Skeleton.Line width="30%" height={11} className="skeletonPanelTitle" />
      <div className="detailSkeletonGrid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Skeleton.Line width="40%" height={9} />
            <Skeleton.Line width="50%" height={13} />
          </div>
        ))}
      </div>
    </div>

    <div className="detailSkeletonActions">
      <Skeleton.Block width={110} height={34} />
      <Skeleton.Block width={80} height={34} />
      <Skeleton.Block width={110} height={34} />
    </div>
  </div>
);

const ProductsDetailsView = ({ loading, product, onEdit, onDelete, onBack }) => {
  if (loading) return <DetailSkeleton />;

  const margin = product.margin || 0;
  const marginClass = margin >= 30 ? 'marginGood' : margin >= 10 ? 'marginOk' : 'marginBad';
  const profit = Number(product.sellingPrice) - Number(product.costPrice || 0);

  return (
    <div className="detailArea">
      {/* Header card */}
      <div className="detailHeader">
        <div className="detailHeaderIcon">
          <IconPackage />
        </div>
        <div className="detailHeaderInfo">
          <h2 className="detailTitle">{product.name}</h2>
          <div className="detailMeta">
            <span className="categoryBadge">{product.category}</span>
            <code className="productSku">{product.sku}</code>
          </div>
        </div>
      </div>

      {/* Product Info Panel */}
      <CollapsiblePanel title="Product Information" icon={<IconPackage />} defaultOpen size="md" className="collapsiblePanel">
        <div className="detailGrid">
          <div className="detailField">
            <span className="detailLabel">Product Name</span>
            <span className="detailValue">{product.name}</span>
          </div>
          <div className="detailField">
            <span className="detailLabel">SKU</span>
            <code className="detailValueMono">{product.sku}</code>
          </div>
          <div className="detailField">
            <span className="detailLabel">Category</span>
            <span className="categoryBadge">{product.category}</span>
          </div>
          {product.description && (
            <div className={`detailField fieldFull`}>
              <span className="detailLabel">Description</span>
              <span className="detailValue">{product.description}</span>
            </div>
          )}
          <div className="detailField">
            <span className="detailLabel">Created</span>
            <span className="detailValue">
              <IconClock className="detailIconInline" />
              {fmtDateLong(product.createdAt)}
            </span>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Pricing Panel */}
      <CollapsiblePanel title="Pricing Information" icon={<IconDollar />} defaultOpen size="md" className="collapsiblePanel">
        <div className="detailGrid">
          <div className="detailField">
            <span className="detailLabel">Cost Price</span>
            <span className="detailValueMuted">{fmtCurrency(Number(product.costPrice))}</span>
          </div>
          <div className="detailField">
            <span className="detailLabel">Selling Price</span>
            <span className="detailValue">{fmtCurrency(Number(product.sellingPrice))}</span>
          </div>
          <div className="detailField">
            <span className="detailLabel">Tax Rate</span>
            <span className="detailValue">{product.taxRate || 0}%</span>
          </div>
          <div className="detailField">
            <span className="detailLabel">Margin</span>
            <span className={`detailMargin ${marginClass}`}>{margin}%</span>
          </div>
          {Number(product.costPrice) > 0 && Number(product.sellingPrice) > 0 && (
            <div className={`detailField fieldFull`}>
              <div className="priceSummary">
                <div className="priceItem">
                  <span className="priceLabel">Cost</span>
                  <span className="priceCost">{fmtCurrency(Number(product.costPrice))}</span>
                </div>
                <div className="priceArrow"><span>→</span></div>
                <div className="priceItem">
                  <span className="priceLabel">Sell</span>
                  <span className="priceSell">{fmtCurrency(Number(product.sellingPrice))}</span>
                </div>
                <div className="priceArrow"><span>→</span></div>
                <div className="priceItem">
                  <span className="priceLabel">Profit</span>
                  <span className={`priceProfit ${profit >= 0 ? 'marginGood' : 'marginBad'}`}>
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
        <CollapsiblePanel title={`Variants (${product.variants.length})`} icon={<IconPackage />} defaultOpen size="md" className="collapsiblePanel">
          <div className="variantsDetailTable">
            <div className="variantsDetailHeader">
              <span className="variantsDetailTh">#</span>
              <span className="variantsDetailTh">Name</span>
              <span className="variantsDetailTh">SKU</span>
              <span className="variantsDetailTh">Size</span>
              <span className="variantsDetailTh">Color</span>
              <span className="variantsDetailTh">Price Adj.</span>
              <span className="variantsDetailTh">Stock</span>
            </div>
            {product.variants.map((v, idx) => (
              <div key={v.id} className="variantsDetailRow">
                <span className="variantsDetailTd">{idx + 1}</span>
                <span className="variantsDetailTd"><span className="variantName">{v.name}</span></span>
                <span className="variantsDetailTd"><code className="variantSku">{v.sku}</code></span>
                <span className="variantsDetailTd">{v.size || '—'}</span>
                <span className="variantsDetailTd">
                  {v.color ? (
                    <><span className="variantSwatchDetail" style={{ backgroundColor: v.color }} />{v.color}</>
                  ) : '—'}
                </span>
                <span className="variantsDetailTd">
                  {v.priceAdjustment !== 0 ? (
                    <span className={`variantPriceAdj ${v.priceAdjustment > 0 ? 'variantPriceUp' : 'variantPriceDown'}`}>
                      {v.priceAdjustment > 0 ? '+' : ''}{fmtCurrency(v.priceAdjustment)}
                    </span>
                  ) : '—'}
                </span>
                <span className="variantsDetailTd">
                  <span className={`variantStock ${v.stock <= 0 ? 'variantStockNone' : v.stock < 10 ? 'variantStockLow' : ''}`}>
                    {v.stock}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </CollapsiblePanel>
      )}

      {/* Action bar */}
      <div className="detailActions">
        <button className="detailEditBtn" onClick={onEdit}>
          <IconEdit />
          Edit Product
        </button>
        <button className="detailDeleteBtn" onClick={onDelete}>
          <IconDelete />
          Delete
        </button>
        <button className="detailBackBtn" onClick={onBack}>
          <IconBackArrow />
          Back to List
        </button>
      </div>
    </div>
  );
};

export default ProductsDetailsView;
