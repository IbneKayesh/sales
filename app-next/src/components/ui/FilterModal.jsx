import { useState, useEffect, useCallback } from 'react';
import Modal from './Modal';

let fieldIdCounter = 0;
const uid = () => `fltr_${++fieldIdCounter}_${Date.now()}`;

/**
 * Advanced filter builder modal with AND/OR groups and rules.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Array<{key, label, type: 'text'|'select'|'number'|'date', options?}>} props.fields
 * @param {Object} props.initialFilters — Pre-existing filter state
 * @param {Function} props.onApply — Called with filter tree on apply
 */
export default function FilterModal({ open, onClose, fields = [], initialFilters, onApply }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (open) {
      setGroups(initialFilters?.groups || [
        { id: uid(), conjunction: 'AND', rules: [{ id: uid(), field: '', operator: 'contains', value: '' }] },
      ]);
    }
  }, [open]);

  const addRule = (groupId) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, rules: [...g.rules, { id: uid(), field: '', operator: 'contains', value: '' }] } : g
    ));
  };

  const removeRule = (groupId, ruleId) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, rules: g.rules.filter(r => r.id !== ruleId) } : g
    ).filter(g => g.rules.length > 0));
  };

  const updateRule = (groupId, ruleId, updates) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, rules: g.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r) } : g
    ));
  };

  const addGroup = () => {
    setGroups(prev => [...prev, { id: uid(), conjunction: 'AND', rules: [{ id: uid(), field: '', operator: 'contains', value: '' }] }]);
  };

  const removeGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const toggleConjunction = (groupId) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, conjunction: g.conjunction === 'AND' ? 'OR' : 'AND' } : g
    ));
  };

  const getOperators = (fieldType) => {
    switch (fieldType) {
      case 'number': return ['=', '!=', '>', '>=', '<', '<='];
      case 'select': return ['is', 'is not', 'in'];
      case 'date': return ['is', 'is before', 'is after', 'between'];
      default: return ['contains', 'not contains', 'equals', 'starts with', 'ends with', 'is empty'];
    }
  };

  const getFieldType = (fieldKey) => fields.find(f => f.key === fieldKey)?.type || 'text';

  const getFieldOptions = (fieldKey) => fields.find(f => f.key === fieldKey)?.options || [];

  const handleApply = useCallback(() => {
    onApply?.({ groups });
    onClose();
  }, [groups, onApply, onClose]);

  const hasValue = groups.some(g => g.rules.some(r => r.field && r.value));

  const footer = (
    <div className="filter-footer">
      <div className="filter-footer-left">
        <button className="wizard-btn wizard-btn-skip" onClick={addGroup}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Group
        </button>
      </div>
      <div className="filter-footer-right">
        <button className="form-btn form-btn-cancel" onClick={onClose}>Cancel</button>
        <button className="form-btn form-btn-submit" onClick={handleApply} disabled={!hasValue}>
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title="Advanced Filters" size="lg" footer={footer}>
      <div className="filter-container">
        {groups.length === 0 && (
          <div className="filter-empty">
            <p>No filter groups. Click "Add Group" to get started.</p>
          </div>
        )}

        {groups.map((group, gi) => (
          <div key={group.id} className="filter-group">
            {/* Group conjunction badge */}
            {gi > 0 && (
              <div className="filter-conjunction-row">
                <button className="filter-conjunction-btn" onClick={() => toggleConjunction(group.id)}>
                  {group.conjunction}
                </button>
              </div>
            )}

            <div className="filter-group-card">
              <div className="filter-group-header">
                {groups.length > 1 && (
                  <button className="filter-group-remove" onClick={() => removeGroup(group.id)} title="Remove group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
                <span className="filter-group-title">Group {gi + 1}</span>
                <button className="filter-group-add-rule" onClick={() => addRule(group.id)}>
                  + Add Rule
                </button>
              </div>

              <div className="filter-rules">
                {group.rules.map((rule, ri) => (
                  <div key={rule.id} className="filter-rule">
                    {ri > 0 && <span className="filter-rule-conjunction">{group.conjunction}</span>}

                    <select
                      className="filter-select"
                      value={rule.field}
                      onChange={(e) => updateRule(group.id, rule.id, { field: e.target.value, operator: 'contains', value: '' })}
                    >
                      <option value="">Select field</option>
                      {fields.map(f => (
                        <option key={f.key} value={f.key}>{f.label}</option>
                      ))}
                    </select>

                    <select
                      className="filter-select filter-select-sm"
                      value={rule.operator}
                      onChange={(e) => updateRule(group.id, rule.id, { operator: e.target.value })}
                      disabled={!rule.field}
                    >
                      {getOperators(getFieldType(rule.field)).map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>

                    {getFieldType(rule.field) === 'select' ? (
                      <select
                        className="filter-select"
                        value={rule.value}
                        onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                        disabled={!rule.field}
                      >
                        <option value="">Select value</option>
                        {getFieldOptions(rule.field).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={getFieldType(rule.field) === 'number' ? 'number' : getFieldType(rule.field) === 'date' ? 'date' : 'text'}
                        className="filter-input"
                        value={rule.value}
                        onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                        placeholder="Value"
                        disabled={!rule.field || rule.operator === 'is empty'}
                      />
                    )}

                    <button className="filter-rule-remove" onClick={() => removeRule(group.id, rule.id)} title="Remove rule">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
