import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import useDashboard from './useDashboard';
import BoxComp from './BoxComp';
import BarChartComp from './BarChartComp';
import PieChartComp from './PieChartComp';
import DoughnutChartComp from './DoughnutChartComp';
import TableComp from './TableComp';
import dashboardConfig from './dashboardConfig.json';

import './DashboardPage.css';

const DashboardPage = () => {
  const {
    currentLayer,
    data,
    loading,
    error,
    history,
    searchTerm,
    setSearchTerm,
    searchResults,
    drillDown,
    goBack,
    jumpToLayer,
    navigateToSearchResult
  } = useDashboard(dashboardConfig);

  const isRoot = history.length === 1;

  const renderComponent = (item, isSearch = false) => {
    const componentData = isSearch ? { value: 'View Details', change: '' } : data[item.dataKey];
    const hasChildren = !!item.children;
    
    // In search mode, we don't have real-time data for all boxes, so we show placeholders or just titles
    const value = isSearch ? (item.componentType === 'box' ? 'Open Layer' : 'View Component') : componentData;
    const subNumber = isSearch ? null : data[`${item.dataKey}_change`];

    switch (item.componentType) {
      case 'box':
        return (
          <BoxComp
            title={item.title}
            subtitle={isSearch ? item.fullPath : item.subtitle}
            value={value}
            subNumber={subNumber}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            hasChildren={hasChildren || isSearch}
            isLoading={loading && !isSearch}
            onClick={() => isSearch ? navigateToSearchResult(item) : drillDown(item.children)}
          />
        );
      case 'bar':
        return (
          <div onClick={() => (hasChildren || isSearch) && (isSearch ? navigateToSearchResult(item) : drillDown(item.children))} className={(hasChildren || isSearch) ? 'cursor-pointer' : ''}>
            <BarChartComp
              title={item.title}
              data={componentData}
              isLoading={loading && !isSearch}
            />
          </div>
        );
      case 'pie':
        return (
          <div onClick={() => (hasChildren || isSearch) && (isSearch ? navigateToSearchResult(item) : drillDown(item.children))} className={(hasChildren || isSearch) ? 'cursor-pointer' : ''}>
            <PieChartComp
              title={item.title}
              data={componentData}
              isLoading={loading && !isSearch}
            />
          </div>
        );
      case 'doughnut':
        return (
          <div onClick={() => (hasChildren || isSearch) && (isSearch ? navigateToSearchResult(item) : drillDown(item.children))} className={(hasChildren || isSearch) ? 'cursor-pointer' : ''}>
            <DoughnutChartComp
              title={item.title}
              data={componentData}
              isLoading={loading && !isSearch}
            />
          </div>
        );
      case 'table':
        return (
          <div onClick={() => (hasChildren || isSearch) && (isSearch ? navigateToSearchResult(item) : drillDown(item.children))} className={(hasChildren || isSearch) ? 'cursor-pointer' : ''}>
            <TableComp
              title={item.title}
              data={componentData}
              columns={item.columns}
              isLoading={loading && !isSearch}
            />
          </div>
        );
      default:
        return <div>Unknown component type: {item.componentType}</div>;
    }
  };

  return (
    <div className="dashboard-container fadein animation-duration-500">
      {/* Top Progress Bar */}
      <div className="loading-bar-container">
        {loading && <ProgressBar mode="indeterminate" style={{ height: "3px" }} />}
      </div>

      <div className="dashboard-wrapper">
        {/* Row 1: Breadcrumbs & Actions */}
        <div className="dashboard-header-row1">
          <nav className="breadcrumbs-nav flex text-xs align-items-center flex-wrap">
            {history.map((layer, idx) => (
              <React.Fragment key={layer.id || idx}>
                {idx > 0 && <i className="pi pi-chevron-right breadcrumb-icon"></i>}
                <span 
                  className={`transition-colors transition-duration-200 ${idx === history.length - 1 ? '' : 'cursor-pointer hover:text-primary'}`}
                  style={{ color: idx === history.length - 1 ? 'var(--text-muted)' : 'inherit' }}
                  onClick={() => idx < history.length - 1 && jumpToLayer(idx)}
                >
                  {idx === 0 ? 'Dashboard' : layer.title}
                </span>
              </React.Fragment>
            ))}
          </nav>

          <div className="dashboard-actions">
            {/* Search (Left in Actions) */}
            <div className="search-container">
              <i className="pi pi-search search-icon" />
              <InputText 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search metrics..." 
                className="search-input p-inputtext-sm"
              />
            </div>

            {/* Back (Right in Actions) */}
            {!isRoot && (
              <Button
                icon="pi pi-arrow-left"
                onClick={goBack}
                className="p-button-rounded p-button-text p-button-plain back-button"
                tooltip="Go Back"
              />
            )}
          </div>
        </div>

        {/* Row 2: Title */}
        <div className="dashboard-header-row2">
          <h1 className="dashboard-title">
            {currentLayer.title || 'System Overview'}
            {loading && <i className="pi pi-spin pi-spinner ml-3 text-lg opacity-50"></i>}
          </h1>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-container fadein">
            <span className='pi pi-exclamation-triangle mr-3'></span>
            {error}
          </div>
        )}

        {/* Search Results View */}
        {searchResults ? (
          <div className="fadein">
            <div className="flex align-items-center justify-content-between mb-4">
              <h2 className="m-0 text-xl font-bold">Search Results for "{searchTerm}"</h2>
              <Button icon="pi pi-times" className="p-button-text p-button-secondary p-button-sm" onClick={() => setSearchTerm('')} />
            </div>
            <div className="grid">
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div className="col-12 md:col-6 lg:col-3 p-2" key={`search-${index}`}>
                    {renderComponent(result, true)}
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-8">
                  <i className="pi pi-search-plus text-4xl text-muted mb-3"></i>
                  <p className="text-muted">No components found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Normal Layer Grid */
          <div className="grid fadein">
            {currentLayer.items.map((item, index) => (
              <div className={`${item.gridSize || 'col-12 md:col-6 lg:col-4'} p-2`} key={`${currentLayer.id}-${index}`}>
                {renderComponent(item)}
              </div>
            ))}
            
            {/* Empty State */}
            {!loading && currentLayer.items.length === 0 && (
              <div className="col-12 empty-state">
                <i className="pi pi-inbox text-4xl text-muted mb-3"></i>
                <p style={{ color: 'var(--text-muted)' }}>No data items defined for this layer.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Meta */}
        <div className="dashboard-footer">
          <div className="flex align-items-center gap-4">
            <span><i className="pi pi-map-marker mr-2"></i>Layer Depth: <strong>{history.length}</strong></span>
            <span><i className="pi pi-database mr-2"></i>Endpoints: <strong>{currentLayer.items.length}</strong></span>
          </div>
          <div className="flex align-items-center">
            <span className="mr-3">Last synchronized: {new Date().toLocaleTimeString()}</span>
            <div className="flex align-items-center">
              <div className="status-dot"></div>
              <span className="text-success font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
