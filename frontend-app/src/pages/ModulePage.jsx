import { usePermissions } from "@/hooks/usePermissions";

const ModulePage = () => {
  const { dataList, isBusy, handleFetchMenus } = usePermissions();

  const modules = [
    { id: 1, name: "Dashboard", icon: "pi-home", color: "bg-blue-500" },
    { id: 2, name: "Sales", icon: "pi-shopping-cart", color: "bg-green-500" },
    { id: 3, name: "Inventory", icon: "pi-box", color: "bg-orange-500" },
    { id: 4, name: "Customers", icon: "pi-users", color: "bg-purple-500" },
    { id: 5, name: "Reports", icon: "pi-chart-bar", color: "bg-teal-500" },
    { id: 6, name: "Settings", icon: "pi-cog", color: "bg-gray-500" },
  ];
  return (
    <div className="p-3 min-h-screen bg-bluegray-50 font-sans flex align-items-center justify-content-center">
      <div className="grid justify-content-center w-full max-w-5xl">
        {dataList.map((module, index) => (
          <div
            key={module.id}
            className="col-6 md:col-2 p-3 fadein animation-duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="bg-white p-2 shadow-1 hover:shadow-4 border-round-2xl cursor-pointer transition-all transition-duration-300 flex flex-column align-items-center justify-content-center text-center transform hover:-translate-y-1"
              onClick={() => handleFetchMenus(module.id)}
            >
              <div
                className={`${module.mdule_color} text-white border-round-2xl w-full h-9rem flex align-items-center justify-content-center mb-2 shadow-2`}
              >
                <i className={`pi ${module.mdule_micon} text-8xl`}></i>
              </div>
              <span className="text-900 font-bold text-xl pb-1">
                {module.mdule_mname}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulePage;
