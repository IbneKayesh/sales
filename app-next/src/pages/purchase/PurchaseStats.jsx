import StatsRow from '../../components/erp/StatsRow';
import { purchaseStats } from './purchaseConfig';

export default function PurchaseStats({ pos, suppliers }) {
  return <StatsRow stats={purchaseStats({ pos, suppliers })} />;
}
