import StatsRow from '../../components/erp/StatsRow';
import { inventoryStats } from './inventoryConfig';

export default function InventoryStats({ products }) {
  return <StatsRow stats={inventoryStats({ products })} />;
}
