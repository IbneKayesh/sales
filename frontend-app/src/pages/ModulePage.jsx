import { usePermissions } from "@/hooks/usePermissions";

const ModulePage = () => {
  const { dataList, isBusy, handleFetchMenus } = usePermissions();
  return (
    <div className="p-3 min-h-screen bg-bluegray-50 font-sans flex align-items-center justify-content-center">
      <div className="grid justify-content-center w-full max-w-5xl">
        {dataList.map((module, index) => (
          <div
            key={module.id}
            className="col-12 md:col-1 p-2 fadein animation-duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="bg-white p-3 shadow-1 hover:shadow-4 border-round-xl cursor-pointer transition-all transition-duration-300 flex flex-column align-items-center justify-content-center text-center transform hover:-translate-y-1"
              onClick={() => handleFetchMenus(module.id)}
            >
              <div
                className={`${module.mdule_color} text-white border-round-xl w-full h-6rem flex align-items-center justify-content-center mb-2 shadow-2`}
              >
                <i className={`pi ${module.mdule_micon} text-5xl`}></i>
              </div>
              <span className="text-900 font-bold text-base pb-1">
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
