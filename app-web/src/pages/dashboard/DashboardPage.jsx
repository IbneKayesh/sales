import React from "react";
import BoxComp from "./BoxComp";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import useDashboard from "@/hooks/useDashboard";

const DashboardPage = () => {
  const {
    currentLayer,
    history,
    searchTerm,
    setSearchTerm,
    searchResults,
    handleBoxClick,
    handleSearchResultClick,
    navigateTo,
    loading,
  } = useDashboard();

  return (
    <div className="p-4 fadein animation-duration-300">
      {/* Loading Overlay / Progress Bar */}
      <div style={{ height: "3px", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}>
        {loading && <ProgressBar mode="indeterminate" style={{ height: "3px" }} />}
      </div>

      {/* Header Area */}
      <div className="flex flex-column md:flex-row md:align-items-center justify-content-between mb-4 gap-3">
        {/* Simplified Breadcrumbs */}
        <div className="flex align-items-center text-sm flex-wrap">
          {history.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <i
                  className="pi pi-chevron-right text-400 mx-2"
                  style={{ fontSize: "0.7rem" }}
                ></i>
              )}
              <span
                className={`cursor-pointer transition-colors ${
                  index === history.length - 1
                    ? "text-900 font-bold"
                    : "text-500 hover:text-primary"
                }`}
                onClick={() => navigateTo(index)}
              >
                {item.title}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Fixed Search Alignment */}
        <div className="p-input-icon-left w-full md:w-18rem relative">
          <i className="pi pi-search" style={{ left: "0.75rem", zIndex: 1 }} />
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search all layers..."
            className="w-full p-inputtext-sm pl-5"
          />
        </div>
      </div>

      {/* Conditional Content: Search Results or Grid */}
      {searchResults ? (
        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          <div className="flex align-items-center justify-content-between mb-4">
            <h2 className="m-0 text-2xl font-bold text-900">Search Results</h2>
            <Button
              label="Close Search"
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={() => setSearchTerm("")}
            />
          </div>
          <div className="grid">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="col-12 sm:col-6 md:col-4 lg:col-3">
                  <BoxComp
                    title={result.title}
                    subtitle={result.subtitle}
                    number={result.data.value}
                    subNumber={result.data.sub_value}
                    icon={result.icon}
                    iconColor={result.iconColor}
                    iconBg={result.iconBg}
                    onClick={() => handleSearchResultClick(result)}
                    clickable={true}
                    className="h-full border-left-3 border-primary"
                  />
                  <div className="text-xs text-400 mt-1 px-2">
                    Location: {result.fullPath}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-8">
                <div className="surface-50 border-round border-dashed border-200 p-6">
                  <i className="pi pi-search-plus text-4xl text-400 mb-3"></i>
                  <p className="text-600 font-medium">
                    No results found for "{searchTerm}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          {/* Layer Title */}
          <div className="mb-4">
            <h2 className="m-0 text-2xl font-bold text-900">
              {currentLayer.title}
              {currentLayer.data.subtitle && (
                <small className="text-500 font-normal ml-3 text-base">
                  | {currentLayer.data.subtitle}
                </small>
              )}
            </h2>
            <p className="text-500 mt-1">
              Exploring {currentLayer.data.component?.length || 0} segments in
              this layer.
            </p>
          </div>

          {/* Components Grid */}
          <div className="grid">
            {currentLayer.data.component &&
              currentLayer.data.component.map((comp, index) => {
                const hasChildren =
                  comp.child &&
                  comp.child.component &&
                  comp.child.component.length > 0;
                return (
                  <div
                    key={index}
                    className="col-12 sm:col-6 md:col-4 lg:col-3"
                  >
                    <BoxComp
                      title={comp.title}
                      subtitle={comp.subtitle}
                      number={comp.data.value}
                      subNumber={comp.data.sub_value}
                      icon={comp.icon}
                      iconColor={comp.iconColor}
                      iconBg={comp.iconBg}
                      onClick={() => handleBoxClick(comp)}
                      clickable={hasChildren}
                      className="h-full"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-top-1 border-100 flex justify-content-between text-400 text-xs">
        <span>{history.length} Layers Deep</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default DashboardPage;
