import ErpPage from '../../components/erp/ErpPage';
import { fixedAssets, assetFormFields, getAssetColumns, assetsStats, renderAssetCard } from './assetsConfig';

export default function Assets() {
  return (
    <ErpPage
      title="Asset"
      data={fixedAssets}
      columns={getAssetColumns}
      formFields={assetFormFields}
      idPrefix="AST"
      stats={assetsStats()}
      renderCard={renderAssetCard}
      onTransformNew={(data, id) => ({ id, ...data, depreciation: Math.round(data.value / data.life) })}
    />
  );
}
