import { useEffect, useMemo, useState } from 'react';
import { useFeature } from '../hooks/useFeature.js';

export default function TaskComp({ featureId }) {
  const { tasks, loadingTasks, refreshTasks, createTask, updateTask, deleteTask } = useFeature();
  const [draft, setDraft] = useState({ task_name: '', is_done: false });

  useEffect(() => {
    if (featureId) refreshTasks(featureId);
  }, [featureId, refreshTasks]);

  const featureTasks = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

  if (!featureId) return <div className="muted">Select a feature to manage tasks.</div>;

  const add = async () => {
    const task_name = (draft.task_name || '').trim();
    if (!task_name) return;
    await createTask(featureId, { task_name, is_done: !!draft.is_done });
    setDraft({ task_name: '', is_done: false });
    await refreshTasks(featureId);
  };

  const toggleDone = async (task) => {
    await updateTask(task.id, { is_done: !task.is_done });
    await refreshTasks(featureId);
  };

  const remove = async (task) => {
    await deleteTask(task.id);
    await refreshTasks(featureId);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
        <input
          className="input"
          placeholder="Task name"
          value={draft.task_name}
          onChange={(e) => setDraft((s) => ({ ...s, task_name: e.target.value }))}
        />
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#cbd5e1' }}>
          <input type="checkbox" checked={draft.is_done} onChange={(e) => setDraft((s) => ({ ...s, is_done: e.target.checked }))} />
          Done
        </label>
        <button type="button" className="btn btn--primary" onClick={add}>
          Add
        </button>
      </div>

      {loadingTasks ? <div>Loading…</div> : null}

      {!loadingTasks && featureTasks.length === 0 ? (
        <div className="muted" style={{ padding: 8 }}>
          No tasks yet.
        </div>
      ) : null}

      {!loadingTasks && featureTasks.length ? (
        <ul className="taskList">
          {featureTasks.map((t) => (
            <li key={t.id} className="taskItem">
              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="checkbox" checked={!!t.is_done} onChange={() => toggleDone(t)} />
                <span style={{ textDecoration: t.is_done ? 'line-through' : 'none' }}>{t.task_name}</span>
              </label>
              <button type="button" className="btn btn--danger" onClick={() => remove(t)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

