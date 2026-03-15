import { usePermissions } from "@/hooks/usePermissions";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ModulePage = () => {
  const { dataList, isBusy, handleFetchMenus } = usePermissions();
  return (
    <div className="p-3 min-h-screen bg-bluegray-200 font-sans flex align-items-center justify-content-center">
      <div className="grid justify-content-center w-full max-w-5xl">
        {isBusy && (
          <div className="col-12 p-3 flex justify-content-center">
            <LoadingSpinner message="Fetching permissions..." subMessage="Please wait..." />
          </div>
        )}

        {!isBusy &&
          dataList.map((module, index) => (
            <div
              key={module.id}
              className="col-12 md:col-1 p-2 m-0 fadein animation-duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className="bg-blue-200 p-1 shadow-1 hover:shadow-4 border-round-xl cursor-pointer transition-all transition-duration-300 flex flex-column align-items-center justify-content-center text-center transform hover:-translate-y-1"
                onClick={() => handleFetchMenus(module.id)}
              >
                <div
                  className={`${module.mdule_color} text-white border-round-xl w-full h-6rem flex align-items-center justify-content-center mb-2 shadow-2`}
                >
                  <i className={`${module.mdule_micon} text-5xl`}></i>
                </div>
                <span className="text-900 font-bold text-gray-800 pb-1 text-xs overflow-hidden text-overflow-ellipsis white-space-nowrap w-full px-1">
                  {module.mdule_mname}
                </span>
              </div>
            </div>
          ))}

        {!isBusy && dataList.length === 0 && (
          <EmptyState stateMessage="No Module found!" />
        )}
      </div>
    </div>
  );
};

export default ModulePage;
