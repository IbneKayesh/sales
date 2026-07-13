import ErpPage from '../../components/erp/ErpPage';
import { users as initUsers, roles, auditLogs, userFormFields, getUserColumns, getAuditColumns, renderUserCard } from './settingsConfig';

const tabs = [{ key: 'users', label: 'Users', editable: true }, { key: 'roles', label: 'Roles' }, { key: 'audit', label: 'Audit Log' }];

export default function Settings() {
  return (
    <ErpPage
      title="User"
      data={initUsers}
      idPrefix="USR"
      tabs={tabs}
      renderCard={renderUserCard}
      getColumns={(tab, handleEdit, handleDelete) => tab === 'users' ? getUserColumns(handleEdit, handleDelete) : getAuditColumns()}
      formFieldsByTab={(tab) => tab === 'users' ? userFormFields : []}
      dataByTab={(tab) => tab === 'users' ? undefined : tab === 'roles' ? roles : auditLogs}
    />
  );
}
