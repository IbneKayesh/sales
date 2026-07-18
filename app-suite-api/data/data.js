const modules = [
  {
    id: 1,
    name: "Dashboard",
    icon: "fa fa-home",
    color: "#007bff",
    order_by: 1,
  },
  {
    id: 2,
    name: "Settings",
    icon: "fa fa-cog",
    color: "#28a745",
    order_by: 2,
  },
];

const menus = [
  {
    id: 1,
    name: "Home",
    icon: "fa fa-house",
    color: "#007bff",
    url_link: "/home",
    parent_id: 1,
  },
  {
    id: 2,
    name: "Reports",
    icon: "fa fa-chart-bar",
    color: "#007bff",
    url_link: "/reports",
    parent_id: 1,
  },
  {
    id: 3,
    name: "Users",
    icon: "fa fa-users",
    color: "#28a745",
    url_link: "/users",
    parent_id: 2,
  },
  {
    id: 4,
    name: "Roles",
    icon: "fa fa-user-shield",
    color: "#28a745",
    url_link: "/roles",
    parent_id: 2,
  },
];

module.exports = {
  modules,
  menus,
};