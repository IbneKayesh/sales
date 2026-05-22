import { useEffect, useState } from 'react';
import TaskComp from './TaskComp.jsx';


const FEATURE_TYPES = [
  { key: 'project', label: 'project' },
  { key: 'module', label: 'module' },
  { key: 'submodule', label: 'submodule' },
  { key: 'feature', label: 'feature' },
];

function FeatureForm({ value, onChange }) {
  const patch = (k, v) => onChange((s) => ({ ...s, [k]: v }));

  return (
    <div>
      <div className="formGrid">
        <div className="formRow">
          <label className="label">Name</label>
          <input className="input" value={value.feature_name || ''} onChange={(e) => patch('feature_name', e.target.value)} />
        </div>
        <div className="formRow">
          <label className="label">Feature type</label>
          <select
            className="input"
            value={value.feature_type || 'project'}
            onChange={(e) => patch('feature_type', e.target.value)}
          >
            {FEATURE_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="formRow" style={{ gridColumn: '1 / -1' }}>
          <label className="label">Description (optional)</label>
          <textarea
            className="textarea"
            value={value.feature_description || ''}
            onChange={(e) => patch('feature_description', e.target.value)}
          />
        </div>
        <div className="formRow">
          <label className="label">Status</label>
          <input className="input" value={value.feature_status || 'planned'} onChange={(e) => patch('feature_status', e.target.value)} />
        </div>
        <div className="formRow">
          <label className="label">Priority</label>
          <input className="input" value={value.feature_priority || 'medium'} onChange={(e) => patch('feature_priority', e.target.value)} />
        </div>
        <div className="formRow">
          <label className="label">Work type</label>
          <input className="input" value={value.work_type || 'development'} onChange={(e) => patch('work_type', e.target.value)} />
        </div>
        <div className="formRow">
          <label className="label">Work user</label>
          <input className="input" value={value.work_user || 'developer'} onChange={(e) => patch('work_user', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export default function FeatureSidebar({ feature, onCreate, onUpdate, onDelete }) {
  const [mode, setMode] = useState('view');
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    queueMicrotask(() => {
      if (feature) {
        setDraft(feature);
        setMode('view');
        return;
      }

      setDraft({
        feature_name: '',
        feature_type: 'project',
        feature_description: '',
        feature_status: 'planned',
        feature_priority: 'medium',
        work_type: 'development',
        work_user: 'developer',
      });
      setMode('create');
    });
  }, [feature]);



  const showEdit = !!feature;


  return (
    <div>
      {!draft ? null : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>
              {feature ? `${feature.feature_name}` : 'Create feature'}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {showEdit && mode === 'view' ? (
                <button type="button" className="btn btn--secondary" onClick={() => setMode('edit')}>
                  Edit
                </button>
              ) : null}
              {showEdit && mode === 'edit' ? (
                <button type="button" className="btn btn--ghost" onClick={() => setMode('view')}>
                  Cancel
                </button>
              ) : null}
              {!showEdit ? (
                <button type="button" className="btn btn--secondary" onClick={() => setMode('create')}>
                  New
                </button>
              ) : null}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <FeatureForm value={draft} onChange={setDraft} />
          </div>

          <div className="formActions" style={{ marginTop: 14 }}>
            {mode === 'edit' && feature ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={async () => {
                  const { id, feature_name, feature_type, feature_description, feature_status, feature_priority, work_type, work_user } = draft;
                  await onUpdate(id, {
                    feature_name: feature_name?.trim(),
                    feature_type,
                    feature_description: feature_description?.trim() || null,
                    feature_status,
                    feature_priority,
                    work_type,
                    work_user,
                  });
                  setMode('view');
                }}
              >
                Save feature
              </button>
            ) : null}

            {(!feature && mode === 'create') || (feature && mode === 'view') ? null : null}

            {!feature && (mode === 'create') ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={async () => {
                  const payload = {
                    feature_name: (draft.feature_name || '').trim(),
                    feature_type: draft.feature_type,
                    feature_description: (draft.feature_description || '').trim() || null,
                    feature_status: draft.feature_status,
                    feature_priority: draft.feature_priority,
                    work_type: draft.work_type,
                    work_user: draft.work_user,
                    parent_feature_id: null,
                    serial_number: null,
                    start_date: null,
                    end_date: null,
                    progress_percent: null,
                  };
                  if (!payload.feature_name) return;
                  await onCreate(payload);
                }}
              >
                Create
              </button>
            ) : null}

            {feature && mode === 'view' ? (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  setDraft({
                    feature_name: '',
                    feature_type: feature.feature_type ? feature.feature_type : 'module',
                    feature_description: '',
                    feature_status: 'planned',
                    feature_priority: 'medium',
                    work_type: 'development',
                    work_user: 'developer',
                    parent_feature_id: feature.id,
                  });
                  setMode('create');
                }}
              >
                Add child
              </button>
            ) : null}

            {mode === 'create' && feature ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={async () => {
                  const payload = {
                    feature_name: (draft.feature_name || '').trim(),
                    feature_type: draft.feature_type,
                    feature_description: (draft.feature_description || '').trim() || null,
                    feature_status: draft.feature_status,
                    feature_priority: draft.feature_priority,
                    work_type: draft.work_type,
                    work_user: draft.work_user,
                    parent_feature_id: feature?.id || draft.parent_feature_id || null,
                  };
                  if (!payload.feature_name) return;
                  await onCreate(payload);
                  setMode('view');
                }}
              >
                Create
              </button>
            ) : null}

            {mode === 'edit' && feature ? (
              <button
                type="button"
                className="btn btn--danger"
                onClick={async () => {
                  await onDelete(feature.id);
                }}
              >
                Delete
              </button>
            ) : null}
          </div>

          {feature ? (
            <div style={{ marginTop: 16 }}>
              <div className="panel__title" style={{ marginBottom: 10 }}>
                Tasks
              </div>
              <TaskComp featureId={feature.id} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

