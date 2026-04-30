import React from "react";
import "./DashboardPage.css";

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to S1AZ ERP. Here is what's happening today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card-professional">
          <div className="stat-header">
            <span className="stat-title">Total Revenue</span>
            <div className="stat-icon primary">
              <i className="pi pi-dollar"></i>
            </div>
          </div>
          <div className="stat-value">$45,231.89</div>
          <div className="stat-trend up">
            <i className="pi pi-arrow-up"></i>
            <span>+20.1%</span>
            <span className="stat-trend-text">from last month</span>
          </div>
        </div>

        <div className="stat-card card-professional">
          <div className="stat-header">
            <span className="stat-title">Active Users</span>
            <div className="stat-icon info">
              <i className="pi pi-users"></i>
            </div>
          </div>
          <div className="stat-value">+2,350</div>
          <div className="stat-trend up">
            <i className="pi pi-arrow-up"></i>
            <span>+180.1%</span>
            <span className="stat-trend-text">from last month</span>
          </div>
        </div>

        <div className="stat-card card-professional">
          <div className="stat-header">
            <span className="stat-title">Pending Orders</span>
            <div className="stat-icon warning">
              <i className="pi pi-shopping-cart"></i>
            </div>
          </div>
          <div className="stat-value">34</div>
          <div className="stat-trend down">
            <i className="pi pi-arrow-down"></i>
            <span>-4.2%</span>
            <span className="stat-trend-text">from last month</span>
          </div>
        </div>

        <div className="stat-card card-professional">
          <div className="stat-header">
            <span className="stat-title">Active Issues</span>
            <div className="stat-icon danger">
              <i className="pi pi-exclamation-triangle"></i>
            </div>
          </div>
          <div className="stat-value">3</div>
          <div className="stat-trend up">
            <i className="pi pi-arrow-up"></i>
            <span>+2</span>
            <span className="stat-trend-text">since yesterday</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="widget-card card-professional">
          <div className="widget-header">
            <span className="widget-title">Recent Transactions</span>
            <button className="widget-action">View All</button>
          </div>
          <div className="empty-state">
            <i className="pi pi-chart-bar"></i>
            <p>Chart data will be available soon.</p>
          </div>
        </div>

        <div className="widget-card card-professional">
          <div className="widget-header">
            <span className="widget-title">System Status</span>
          </div>
          <div className="empty-state">
            <i className="pi pi-server"></i>
            <p>All systems operational.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
