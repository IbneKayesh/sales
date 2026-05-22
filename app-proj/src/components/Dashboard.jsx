import React from 'react';
import useDashboard from '../hooks/useDashboard';
import { formatDate } from '../utils/dateUtils';
import StatusBadge from './shared/StatusBadge';
import PriorityBadge from './shared/PriorityBadge';
import ProgressBar from './shared/ProgressBar';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

export default function Dashboard() {
  const { stats, activityLog, loading, error, refresh } = useDashboard();

  if (loading) {
    return <LoadingState message="Loading dashboard statistics..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  const {
    counts = { projects: 0, modules: 0, submodules: 0, features: 0, tables: 0 },
    projectStatuses = {},
    featureStatuses = {},
    overdue = [],
    avgProgress = 0,
  } = stats || {};

  // Formats relative time
  const getRelativeTime = (dateString) => {
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'yesterday';
      return formatDate(dateString);
    } catch (e) {
      return formatDate(dateString);
    }
  };

  // Helper to format activity action descriptions nicely
  const renderActivityDetails = (log) => {
    const details = log.details || {};
    const changes = [];
    if (details.status) changes.push(`status: ${details.status}`);
    if (details.priority) changes.push(`priority: ${details.priority}`);
    if (details.progress !== undefined) changes.push(`progress: ${details.progress}%`);

    const changeText = changes.length > 0 ? ` (${changes.join(', ')})` : '';
    const actionColorClass = `action-${log.action.toLowerCase()}`;

    return (
      <span className="activity-details-text">
        <span className={`activity-action-tag ${actionColorClass}`}>{log.action}</span>{' '}
        <strong className="entity-name-highlight">{log.entity_name}</strong>{' '}
        <span className="entity-type-label">({log.entity_type})</span>
        {changeText}
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-row">
        <div>
          <h2 className="dashboard-title">System Overview</h2>
          <p className="dashboard-subtitle">Real-time metrics, status breakdowns, and developer activities.</p>
        </div>
        <button className="btn btn-secondary btn-refresh" onClick={refresh} title="Refresh dashboard data">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* KPI Counters Grid */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-card animated-card">
          <div className="kpi-icon icon-project">📁</div>
          <div className="kpi-info">
            <span className="kpi-label">Projects</span>
            <span className="kpi-value">{counts.projects}</span>
            <span className="kpi-subtext">Active: {projectStatuses.active || 0}</span>
          </div>
        </div>

        <div className="kpi-card animated-card">
          <div className="kpi-icon icon-module">📦</div>
          <div className="kpi-info">
            <span className="kpi-label">Modules</span>
            <span className="kpi-value">{counts.modules}</span>
            <span className="kpi-subtext">Submodules: {counts.submodules}</span>
          </div>
        </div>

        <div className="kpi-card animated-card">
          <div className="kpi-icon icon-feature">⚡</div>
          <div className="kpi-info">
            <span className="kpi-label">Features</span>
            <span className="kpi-value">{counts.features}</span>
            <span className="kpi-subtext">Done: {featureStatuses.done || 0}</span>
          </div>
        </div>

        <div className="kpi-card animated-card">
          <div className="kpi-icon icon-table">🗄️</div>
          <div className="kpi-info">
            <span className="kpi-label">Schema Tables</span>
            <span className="kpi-value">{counts.tables}</span>
            <span className="kpi-subtext">Fields modeled</span>
          </div>
        </div>
      </div>

      {/* Average Progress Dashboard Segment */}
      <div className="progress-banner-card animated-card">
        <div className="progress-banner-info">
          <h3>Average Project Completion</h3>
          <p>Composite health indicator across all current workspace projects.</p>
        </div>
        <div className="progress-banner-bar">
          <ProgressBar progress={avgProgress} size="lg" />
        </div>
      </div>

      {/* Dashboard Two-Column Layout */}
      <div className="dashboard-main-grid">
        {/* Left Side: Overdue & Distributions */}
        <div className="dashboard-left-col">
          {/* Overdue Items Alert Panel */}
          <div className="dashboard-section-card animated-card">
            <div className="card-header-styled">
              <span className="header-icon">⚠️</span>
              <h4>Overdue & Missing Deadlines</h4>
              <span className="overdue-badge-count">{overdue.length}</span>
            </div>
            <div className="card-body-styled">
              {overdue.length === 0 ? (
                <div className="empty-overdue-state">
                  <span className="check-icon">✓</span> All active schedule milestones are currently on track.
                </div>
              ) : (
                <ul className="overdue-list">
                  {overdue.map((item, idx) => (
                    <li key={`${item.type}-${item.id}-${idx}`} className="overdue-item">
                      <div className="overdue-item-main">
                        <span className={`overdue-type-badge ${item.type}`}>
                          {item.type.toUpperCase()}
                        </span>
                        <span className="overdue-title">{item.title}</span>
                      </div>
                      <div className="overdue-item-meta">
                        <span className="overdue-owner">Owner: {item.owner || 'Unassigned'}</span>
                        <span className="overdue-date">Due: {formatDate(item.end_date)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Project Status Breakdowns */}
          <div className="dashboard-section-card animated-card">
            <div className="card-header-styled">
              <span className="header-icon">📊</span>
              <h4>Project Status Distribution</h4>
            </div>
            <div className="card-body-styled status-distribution-body">
              {Object.keys(projectStatuses).length === 0 ? (
                <div className="empty-distribution-state">No project records found.</div>
              ) : (
                <div className="distribution-bars">
                  {Object.entries(projectStatuses).map(([status, count]) => {
                    const pct = Math.round((count / counts.projects) * 100) || 0;
                    return (
                      <div key={status} className="distribution-row">
                        <div className="distribution-info">
                          <StatusBadge status={status} />
                          <span className="distribution-count">{count} {count === 1 ? 'project' : 'projects'}</span>
                        </div>
                        <ProgressBar progress={pct} size="sm" showValue={true} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Feature Status Breakdowns */}
          <div className="dashboard-section-card animated-card">
            <div className="card-header-styled">
              <span className="header-icon">⚙️</span>
              <h4>Feature Implementation Status</h4>
            </div>
            <div className="card-body-styled status-distribution-body">
              {Object.keys(featureStatuses).length === 0 ? (
                <div className="empty-distribution-state">No feature records found.</div>
              ) : (
                <div className="distribution-bars">
                  {Object.entries(featureStatuses).map(([status, count]) => {
                    const pct = Math.round((count / counts.features) * 100) || 0;
                    return (
                      <div key={status} className="distribution-row">
                        <div className="distribution-info">
                          <StatusBadge status={status} />
                          <span className="distribution-count">{count} {count === 1 ? 'feature' : 'features'}</span>
                        </div>
                        <ProgressBar progress={pct} size="sm" showValue={true} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Activity Log Feed */}
        <div className="dashboard-right-col">
          <div className="dashboard-section-card animated-card activity-feed-card">
            <div className="card-header-styled">
              <span className="header-icon">🕒</span>
              <h4>Recent Workspaces Activity</h4>
            </div>
            <div className="card-body-styled activity-feed-body">
              {activityLog.length === 0 ? (
                <div className="empty-activity-state">No activity logs recorded yet. Try creating or updating some entities.</div>
              ) : (
                <div className="activity-timeline">
                  {activityLog.map((log) => (
                    <div key={log.id} className="activity-timeline-item">
                      <div className="activity-marker" />
                      <div className="activity-content">
                        {renderActivityDetails(log)}
                        <span className="activity-time-stamp" title={new Date(log.created_at).toLocaleString()}>
                          {getRelativeTime(log.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
