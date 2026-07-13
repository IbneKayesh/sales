import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import StatsRow from '../../components/erp/StatsRow';
import { useToast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';
import { returns as initialReturns } from '../../data/mockData';

const statusColors = {
  approved: '#059669',
  pending: '#d97706',
  rejected: '#dc2626',
};

const refundColors = {
  completed: '#059669',
  pending: '#d97706',
  none: '#6b7280',
};

const returnColumns = [
  { key: 'id', label: 'Return ID' },
  { key: 'orderId', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  {
    key: 'amount', label: 'Amount',
    render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span>,
  },
  { key: 'reason', label: 'Reason', render: (val) => (
    <span style={{ maxWidth: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={val}>
      {val}
    </span>
  )},
  {
    key: 'status', label: 'Status',
    render: (val) => <Badge variant={val}>{val}</Badge>,
  },
  {
    key: 'refundStatus', label: 'Refund',
    render: (val) => <span style={{ color: refundColors[val] || '#6b7280', fontWeight: 600, textTransform: 'capitalize', fontSize: 13 }}>{val}</span>,
  },
  { key: 'date', label: 'Requested' },
];

export default function ReturnsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [returns, setReturns] = useState(initialReturns);

  const stats = useMemo(() => {
    const totalRefunded = returns
      .filter(r => r.status === 'approved' && r.refundStatus === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    const pendingReturns = returns.filter(r => r.status === 'pending').length;
    return [
      {
        title: 'Total Refunded', value: totalRefunded, prefix: '$', color: '#059669',
        change: 12.3,
        icon: '<path d=\"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/>',
      },
      {
        title: 'Pending Returns', value: pendingReturns, color: '#d97706',
        change: -8.5,
        icon: '<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>',
      },
      {
        title: 'Approved', value: returns.filter(r => r.status === 'approved').length, color: '#6366f1',
        change: 5.2,
        icon: '<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/>',
      },
      {
        title: 'Total Requests', value: returns.length, color: '#8b5cf6',
        change: 18.7,
        icon: '<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"/>',
      },
    ];
  }, [returns]);

  const handleProcess = async (ret) => {
    if (ret.status !== 'pending') {
      toast.info(`Return ${ret.id} has already been ${ret.status}`);
      return;
    }

    const action = await confirm(
      `How would you like to process return ${ret.id} from ${ret.customer}?`,
      {
        title: 'Process Return',
        confirmText: 'Approve',
        cancelText: 'Reject',
        variant: 'default',
        icon: 'info',
      }
    );

    if (action === true) {
      setReturns(prev => prev.map(r =>
        r.id === ret.id ? { ...r, status: 'approved', refundStatus: 'completed', processedBy: 'Admin User' } : r
      ));
      toast.success(`Return ${ret.id} approved — refund processed`);
    } else if (action === false) {
      setReturns(prev => prev.map(r =>
        r.id === ret.id ? { ...r, status: 'rejected', refundStatus: 'none', processedBy: 'Admin User', rejectionReason: 'Declined by management' } : r
      ));
      toast.error(`Return ${ret.id} rejected`);
    }
  };

  const handleRowClick = (row) => handleProcess(row);

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <button className="btn-ghost" onClick={() => navigate('/sales')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Sales
        </button>
        <h2>Returns Management</h2>
      </div>

      <StatsRow stats={stats} />

      <div className="subpage-card">
        <div className="subpage-card-header">
          <h3>Return Requests</h3>
          <p>Manage and process customer return requests</p>
        </div>
        <DataTable
          columns={returnColumns}
          data={returns}
          searchable
          searchPlaceholder="Search returns..."
          onRowClick={handleRowClick}
          expandable
          exportable
          exportFilename="sales-returns"
          renderExpanded={(row) => (
            <div className="expanded-fields">
              <div className="expanded-field">
                <span className="expanded-field-label">Return ID</span>
                <span className="expanded-field-value" style={{ fontWeight: 700 }}>{row.id}</span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Order</span>
                <span className="expanded-field-value">{row.orderId}</span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Customer</span>
                <span className="expanded-field-value">{row.customer}</span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Product</span>
                <span className="expanded-field-value">{row.product}</span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Amount</span>
                <span className="expanded-field-value" style={{ fontWeight: 700, color: 'var(--accent)' }}>${row.amount.toLocaleString()}</span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Reason</span>
                <span className="expanded-field-value">{row.reason}</span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Status</span>
                <span className="expanded-field-value"><Badge variant={row.status}>{row.status}</Badge></span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Refund</span>
                <span className="expanded-field-value" style={{ color: refundColors[row.refundStatus], fontWeight: 600 }}>{row.refundStatus}</span>
              </div>
              <div className="expanded-field">
                <span className="expanded-field-label">Processed By</span>
                <span className="expanded-field-value">{row.processedBy}</span>
              </div>
              {row.rejectionReason && (
                <div className="expanded-field">
                  <span className="expanded-field-label">Rejection Reason</span>
                  <span className="expanded-field-value" style={{ color: '#dc2626' }}>{row.rejectionReason}</span>
                </div>
              )}
              <div className="expanded-field">
                <span className="expanded-field-label">Requested</span>
                <span className="expanded-field-value">{row.date}</span>
              </div>
              <div className="expanded-actions" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                {row.status === 'pending' && (
                  <>
                    <button className="btn-primary btn-sm" onClick={() => handleProcess({ ...row, status: 'approved' })}>
                      Approve & Refund
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => handleProcess({ ...row, status: 'rejected' })}>
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
