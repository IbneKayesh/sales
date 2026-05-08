const express = require("express");
const router = express.Router();

// Helper to generate dummy data
const generateMockData = (type) => {
  switch (type) {
    case 'overview':
      return {
        crm_value: 15200,
        inventory_value: 45000,
        accounts_value: 32000,
        sales_value: 85000,
        purchase_value: 62000,
        performance_chart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{ label: 'Performance', data: [4500, 5200, 4800, 6100, 5800, 7200] }]
        }
      };
    case 'crm':
      return {
        customer_count: 1240,
        lead_count: 450,
        conversion_rate: 12.5,
        region_distribution: {
          labels: ['North', 'South', 'East', 'West', 'Central'],
          data: [35, 25, 20, 15, 5]
        },
        recent_leads: [
          { id: 1, name: 'John Doe', company: 'Tech Corp', status: 'Hot', value: 5000 },
          { id: 2, name: 'Jane Smith', company: 'Global Solutions', status: 'Warm', value: 2500 }
        ]
      };
    case 'crm_north':
      return {
        team_performance: {
          labels: ['Team Alpha', 'Team Beta', 'Team Gamma'],
          data: [85, 72, 91]
        }
      };
    case 'crm_north_teama':
      return {
        agent_rates: {
          labels: ['John Doe', 'Sarah Smith', 'Mike Brown'],
          data: [45, 30, 25]
        }
      };
    case 'crm_north_agent1':
      return {
        lead_history: [
          { date: '2026-05-01', lead: 'ABC Corp', status: 'Converted', value: 12000 },
          { date: '2026-05-03', lead: 'XYZ Ltd', status: 'In Progress', value: 5000 },
          { date: '2026-05-05', lead: 'Global Inc', status: 'Lost', value: 2500 }
        ]
      };
    case 'inventory':
      return {
        category_split: {
          labels: ['Electronics', 'Furniture', 'Apparel', 'Food', 'Others'],
          data: [40, 20, 15, 15, 10]
        }
      };
    case 'inv_electronics':
      return {
        sub_category_stock: {
          labels: ['Laptops', 'Phones', 'Tablets', 'Accessories'],
          data: [30, 45, 15, 10]
        }
      };
    case 'inv_elec_laptops':
      return {
        model_list: [
          { model: 'MacBook Pro', stock: 15, price: 2500, status: 'In Stock' },
          { model: 'Dell XPS', stock: 8, price: 1800, status: 'Low Stock' },
          { model: 'ThinkPad X1', stock: 0, price: 2100, status: 'Out of Stock' }
        ]
      };
    case 'inv_elec_laptop_mbp':
      return {
        movement_trend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          data: [12, 18, 15, 22, 14]
        }
      };
    case 'sales':
      return {
        sales_value: 85000,
        sales_by_channel: {
          labels: ['Online', 'Retail', 'Wholesale', 'Direct'],
          data: [45, 25, 20, 10]
        },
        top_salespeople: [
          { name: 'Sarah Connor', deals: 12, value: 45000 },
          { name: 'James Bond', deals: 8, value: 32000 }
        ]
      };
    case 'accounts':
      return {
        cash_on_hand: 25000,
        tax_payable: 4500,
        expense_breakdown: {
          labels: ['Rent', 'Salaries', 'Utilities', 'Marketing'],
          data: [5000, 15000, 2000, 3000]
        }
      };
    case 'purchase':
      return {
        total_purchases: 52000,
        active_orders: 8,
        purchase_trend: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [12000, 15000, 11000, 14000]
        }
      };
    default:
      return {};
  }
};

// Route handlers
router.post("/layer1", (req, res) => {
  res.json({ success: true, data: generateMockData('overview') });
});

router.post("/layer2/:dept", (req, res) => {
  res.json({ success: true, data: generateMockData(req.params.dept) });
});

router.post("/layer3/:dept/:cat", (req, res) => {
  const key = `${req.params.dept}_${req.params.cat}`;
  res.json({ success: true, data: generateMockData(key) });
});

router.post("/layer4/:dept/:cat/:sub", (req, res) => {
  const key = `${req.params.dept}_${req.params.cat}_${req.params.sub}`;
  res.json({ success: true, data: generateMockData(key) });
});

router.post("/layer5/:dept/:cat/:sub/:item", (req, res) => {
  const key = `${req.params.dept}_${req.params.cat}_${req.params.sub}_${req.params.item}`;
  res.json({ success: true, data: generateMockData(key) });
});

module.exports = router;
