
import { IconSearch, IconPlus } from '@/assets/icons';
import './SalesToolbar.css';

const SalesToolbar = ({ searchQuery, setSearchQuery, productFilter, setProductFilter, productsList, onAddTrigger }) => {
  return (
    <div className="d-flex ai-center jc-between flex-wrap gap-3 px-5 py-4 border-bottom" style={{backgroundColor:'rgba(0,0,0,0.15)'}}>
      <div>
        <h2 className="fs-16 fw-600 text-primary" style={{fontFamily:'var(--font-display)', margin:0}}>Sales Transactions</h2>
      </div>
      <div className="d-flex ai-center gap-2">
        <div className="pos-relative d-flex ai-center">
          <IconSearch className="pos-absolute pointer-events-none" style={{left:'10px', width:'14px', height:'14px', color:'var(--color-text-muted)'}} />
          <input
            type="text"
            className="search-input"
            style={{padding:'7px 10px 7px 32px', borderRadius:'6px', border:'1px solid var(--glass-border)', backgroundColor:'var(--glass-bg-hover-light)', color:'var(--color-text-primary)', fontFamily:'inherit', fontSize:'12px', outline:'none', width:'200px', transition:'all 0.15s ease'}}
            placeholder="Search customer or product…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          style={{padding:'7px 10px', borderRadius:'6px', border:'1px solid var(--glass-border)', backgroundColor:'var(--glass-bg-hover-light)', color:'var(--color-text-primary)', fontFamily:'inherit', fontSize:'12px', outline:'none', cursor:'pointer', transition:'border-color 0.15s ease'}}
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          aria-label="Filter by product"
        >
          {productsList.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={onAddTrigger}>
          <IconPlus style={{width:'13px', height:'13px'}} />
          New Sale
        </button>
      </div>
    </div>
  );
};

export default SalesToolbar;
