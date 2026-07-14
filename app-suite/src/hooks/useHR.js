import createDataHook from './createDataHook';

const INITIAL_EMPLOYEES = [
  { id: 'EMP-001', name: 'Alice Johnson', dept: 'Engineering', role: 'Sr. Developer', status: 'Active', salary: '$95,000', createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'EMP-002', name: 'Bob Smith', dept: 'Sales', role: 'Account Manager', status: 'Active', salary: '$72,000', createdAt: '2026-06-05T10:30:00.000Z' },
  { id: 'EMP-003', name: 'Carol Williams', dept: 'HR', role: 'HR Coordinator', status: 'Active', salary: '$55,000', createdAt: '2026-06-10T12:15:00.000Z' },
  { id: 'EMP-004', name: 'David Brown', dept: 'Engineering', role: 'DevOps Lead', status: 'On Leave', salary: '$88,000', createdAt: '2026-06-15T14:45:00.000Z' },
  { id: 'EMP-005', name: 'Eve Davis', dept: 'Marketing', role: 'Marketing Lead', status: 'Active', salary: '$78,000', createdAt: '2026-06-20T09:00:00.000Z' },
  { id: 'EMP-006', name: 'Frank Miller', dept: 'Finance', role: 'Financial Analyst', status: 'Active', salary: '$65,000', createdAt: '2026-06-25T16:20:00.000Z' },
];

const useHR = createDataHook({
  key: 'hr_data',
  initialData: INITIAL_EMPLOYEES,
  dataKey: 'employees',
  idFn: (items) => `EMP-${String(items.length + 1).padStart(3, '0')}`,
  onCreate: (input) => ({ ...input, status: 'Active' }),
});

export default useHR;
