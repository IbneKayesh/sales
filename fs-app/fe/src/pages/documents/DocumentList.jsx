import {
  ChevronLeft,
  ChevronRight,
  FileJson,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DataTable,
  EmptyState,
  SearchField,
} from "../../components/ui";

const INTERNAL_FIELDS = new Set(["_id", "_version", "createdAt", "updatedAt"]);

function JsonValue({ value }) {
  if (value === null || value === undefined) {
    return <span className="json-value--null">null</span>;
  }

  if (typeof value === "boolean") {
    return <span className="json-value--boolean">{String(value)}</span>;
  }

  if (typeof value === "number") {
    return <span className="json-value--number">{value}</span>;
  }

  if (typeof value === "string") {
    return (
      <span className="cell-truncate json-value--string u-block" title={value}>
        {value}
      </span>
    );
  }

  if (Array.isArray(value)) {
    return <span className="json-value--complex">[{value.length} items]</span>;
  }

  return <span className="json-value--complex">{"{…}"}</span>;
}

function userFields(sample) {
  const fields = [];

  for (const document of sample) {
    for (const key of Object.keys(document)) {
      if (!INTERNAL_FIELDS.has(key) && !fields.includes(key)) fields.push(key);
    }
  }

  return fields.slice(0, 6);
}

export function DocumentList({
  selected,
  documents,
  documentsLoading,
  filtered,
  pageSize,
  pageCount,
  currentPage,
  setPage,
  search,
  setSearch,
  refreshDocuments,
  requestDelete,
  requestDropCollection,
  setFormDocument,
}) {
  const pageRows = filtered.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const columns = [
    {
      key: "_id",
      header: "File",
      className: "cell-mono w-90",
      render: (document) => `${document._id}.json`,
    },
    ...userFields(pageRows.length ? pageRows : documents.slice(0, 20)).map((field) => ({
      key: field,
      header: field,
      render: (document) => <JsonValue value={document[field]} />,
    })),
    {
      key: "_version",
      header: "Version",
      className: "w-90",
      render: (document) => <Badge tone="brand">v{document._version}</Badge>,
    },
    {
      key: "updatedAt",
      header: "Updated",
      className: "w-180",
      render: (document) => (
        <span className="cell-muted">
          {new Date(document.updatedAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "cell-actions",
      render: (document) => (
        <div className="row-actions">
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label="Edit document"
            onClick={() => setFormDocument(document)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            iconOnly
            variant="ghost"
            aria-label="Delete document"
            onClick={() => requestDelete(document)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader
        title={selected}
        icon={FileJson}
        badge={<Badge tone="neutral">{documents.length} documents</Badge>}
        actions={
          <>
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              onClick={refreshDocuments}
              aria-label="Refresh documents"
            >
              <RefreshCw size={14} />
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setFormDocument(null)}
            >
              <Plus size={14} /> Insert
            </Button>
            <Button size="sm" variant="danger" onClick={requestDropCollection}>
              <Trash2 size={14} /> Drop
            </Button>
          </>
        }
      />

      <div className="toolbar">
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(0);
          }}
          placeholder="Search documents…"
          label="Search documents"
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(document) => document._id}
        loading={documentsLoading}
        loadingText="Loading documents…"
        empty={
          <EmptyState
            icon={FileJson}
            title={search ? "No matching documents" : "No documents yet"}
            description={
              search
                ? "Try a different search term."
                : `Insert the first document into “${selected}”.`
            }
            action={
              search ? null : (
                <Button variant="primary" onClick={() => setFormDocument(null)}>
                  <Plus size={15} /> Insert document
                </Button>
              )
            }
          />
        }
      />

      {filtered.length > pageSize ? (
        <div className="pagination">
          <span>
            {currentPage * pageSize + 1}–
            {Math.min(currentPage * pageSize + pageSize, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="pagination__controls">
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              disabled={currentPage === 0}
              aria-label="Previous page"
              onClick={() => setPage(Math.max(0, currentPage - 1))}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              size="sm"
              iconOnly
              variant="ghost"
              disabled={currentPage >= pageCount - 1}
              aria-label="Next page"
              onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
