import { getVendorById } from '@/data/vendors';

const VendorBadge = ({ vendorId, size = 'sm' }) => {
  const vendor = getVendorById(vendorId);
  if (!vendor) return null;

  if (size === 'sm') {
    return (
      <span className="vendor-badge vendor-badge-sm">
        <span className="vendor-badge-logo" style={{ backgroundImage: `url(${vendor.logo})` }} />
        <span className="vendor-badge-name">{vendor.name}</span>
        {vendor.verified && <span className="vendor-badge-verified" title="Verified Seller">✓</span>}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="vendor-badge-lg">
        <div className="vendor-badge-lg-logo" style={{ backgroundImage: `url(${vendor.logo})` }} />
        <div className="vendor-badge-lg-info">
          <div className="vendor-badge-lg-name">
            {vendor.name}
            {vendor.verified && <span className="vendor-badge-lg-verified">✓ Verified</span>}
          </div>
          <div className="vendor-badge-lg-meta">
            <span>★ {vendor.rating}</span>
            <span>•</span>
            <span>{vendor.reviewCount} reviews</span>
            <span>•</span>
            <span>{vendor.location}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VendorBadge;
