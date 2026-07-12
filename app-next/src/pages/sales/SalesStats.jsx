import StatsRow from '../../components/erp/StatsRow';
import { salesStats } from './salesConfig';

export default function SalesStats({ orders, invoices }) {
  return <StatsRow stats={salesStats({ orders, invoices })} />;
}
