import React from "react";

const ModulePage = () => {
  const modules = [
    { id: 1, name: "Dashboard", icon: "pi-home", color: "bg-blue-500" },
    { id: 2, name: "Sales", icon: "pi-shopping-cart", color: "bg-green-500" },
    { id: 3, name: "Inventory", icon: "pi-box", color: "bg-orange-500" },
    { id: 4, name: "Customers", icon: "pi-users", color: "bg-purple-500" },
    { id: 5, name: "Reports", icon: "pi-chart-bar", color: "bg-teal-500" },
    { id: 6, name: "Settings", icon: "pi-cog", color: "bg-gray-500" },
  ];

  const handleModuleClick = (moduleName) => {
    console.log(`Module ${moduleName} clicked`);
  };

  return (
    <div className="p-6 min-h-screen bg-bluegray-50 font-sans flex align-items-center justify-content-center">
      <div className="grid justify-content-center w-full max-w-7xl">
        {modules.map((module, index) => (
          <div
            key={module.id}
            className="col-6 sm:col-4 md:col-3 lg:col-2 p-3 fadein animation-duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="bg-white p-2 shadow-1 hover:shadow-4 border-round-2xl cursor-pointer transition-all transition-duration-300 flex flex-column align-items-center justify-content-center text-center transform hover:-translate-y-1"
              onClick={() => handleModuleClick(module.name)}
            >
              <div
                className={`${module.color} text-white border-round-2xl w-full h-9rem flex align-items-center justify-content-center mb-2 shadow-2`}
              >
                <i className={`pi ${module.icon} text-7xl`}></i>
              </div>
              <span className="text-900 font-bold text-xl pb-1">
                {module.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulePage;
