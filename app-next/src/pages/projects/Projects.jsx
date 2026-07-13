import ErpPage from '../../components/erp/ErpPage';
import { projects as initProjects, projectFormFields, getProjectColumns, projectsStats, renderProjectCard } from './projectsConfig';

export default function Projects() {
  return (
    <ErpPage
      title="Project"
      data={initProjects}
      columns={getProjectColumns}
      formFields={projectFormFields}
      idPrefix="PRJ"
      stats={projectsStats()}
      renderCard={renderProjectCard}
      onTransformNew={(data, id) => ({ id, ...data, spent: 0 })}
    />
  );
}
