import { useEffect, useMemo, useState } from 'react';

import { useFeature } from '../hooks/useFeature.js';
import EmptyState from './components/EmptyState.jsx';
import LoadingState from './components/LoadingState.jsx';
import FeatureSidebar from './FeatureSidebar.jsx';

function FeatureTreeRow({ feature, depth, isSelected, onSelect }) {
  return (
    <div
      className={`featureRow ${isSelected ? 'featureRow--selected' : ''}`}
      style={{ paddingLeft: 10 + depth * 16 }}
    >
      <button type="button" className="featureRow__btn" onClick={() => onSelect(feature.id)}>
        {feature.feature_name}
      </button>
    </div>
  );
}

export default function Features() {
  const {
    features,
    loadingFeatures,
    refreshFeatures,
    createFeature,
    updateFeature,
    deleteFeature,
    refreshFeatureTables,
    refreshTasks,
  } = useFeature();

  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  const selectedFeature = useMemo(() => features.find((f) => f.id === selectedFeatureId) || null, [features, selectedFeatureId]);

  useEffect(() => {
    // select first item by default
    if (!selectedFeatureId && features.length) {
      queueMicrotask(() => {
        setSelectedFeatureId(features[0].id);
      });
    }
  }, [features, selectedFeatureId]);



  const depthFromType = (type) => {
    const t = String(type || '').toLowerCase();
    if (t.includes('project')) return 0;
    if (t.includes('module')) return 1;
    if (t.includes('submodule')) return 2;
    return 3;
  };

  return (
    <div className="grid">
      <div className="panel">
        <div className="panel__title">Features</div>

        {loadingFeatures ? <LoadingState /> : null}

        {!loadingFeatures && features.length === 0 ? (
          <EmptyState title="No features" actionLabel="Create your first project" onAction={() => setSelectedFeatureId(null)} />
        ) : null}

        <div className="featureList">
          {features.map((f) => (
            <FeatureTreeRow
              key={f.id}
              feature={f}
              depth={depthFromType(f.feature_type)}
              isSelected={f.id === selectedFeatureId}
              onSelect={(id) => {
                setSelectedFeatureId(id);
                refreshFeatureTables(id);
                refreshTasks(id);
              }}
            />
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel__title">Feature details</div>
        <FeatureSidebar
          feature={selectedFeature}
          onCreate={async (payload) => {
            await createFeature(payload);
            await refreshFeatures();
          }}
          onUpdate={async (featureId, patch) => {
            await updateFeature(featureId, patch);
            await refreshFeatures();
          }}
          onDelete={async (featureId) => {
            await deleteFeature(featureId);
            setSelectedFeatureId(null);
            await refreshFeatures();
          }}
        />
      </div>
    </div>
  );
}

