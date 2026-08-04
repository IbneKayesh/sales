import EmptyState from "@/components/EmptyState";

// Common empty-data state shared by all RPT_ report components
const ReportEmpty = ({
  title = "No Data",
  message = "No records found for the selected period.",
}) => <EmptyState variant="noData" title={title} message={message} compact />;

export default ReportEmpty;
