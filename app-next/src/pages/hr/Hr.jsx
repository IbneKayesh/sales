import ErpPage from '../../components/erp/ErpPage';
import { employees, employeeFormFields, getEmployeeColumns, hrStats, renderEmployeeCard } from './hrConfig';

export default function Hr() {
  return (
    <ErpPage
      title="Employee"
      data={employees}
      columns={getEmployeeColumns}
      formFields={employeeFormFields}
      idPrefix="EMP"
      stats={hrStats()}
      renderCard={renderEmployeeCard}
    />
  );
}
