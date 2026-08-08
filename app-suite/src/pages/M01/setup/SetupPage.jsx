const SetupPage = () => {
  return <>Setup Page
here many group of setup options Like MRR is group and sub group is Items Columns
design will be same as ModulePage.jsx


  1.   MRR
  
 1.1 Items
 on click show popup / src/components/TableColumns.jsx
 //remove TableColumns from DataTable
 //DataTable accept only one cfColumns param instead of 4
   columnsSettings = false,
  cfColumns = [],
  defaultCfColumns = [],
  onColumnsChange,
  //from ItemList.jsx no need to getStorageLoginData  data come from  API as params, no need setStorageLoginData its done from pages/M01/SetupPage.jsx,
  
        columnsSettings //if cfColumns (as params) length > 0 then true
        cfColumns={cfColumns} // as params
        defaultCfColumns={defCfColumns} // as same cfColumns
        onColumnsChange={handleColumnsChange} // its set from SetupPage.jsx

  </>;
};
export default SetupPage;
