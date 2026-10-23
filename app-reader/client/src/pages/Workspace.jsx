import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Download,
  FileText,
  Headphones,
  Music,
  Plus,
  Star,
  Trash2,
  Newspaper,
  Upload,
} from "lucide-react";
import { api } from "../lib/api.js";
import { useApp } from "../context/app-context.js";
import {
  Badge,
  CheckList,
  ConfirmDialog,
  EmptyState,
  ErrorBlock,
  LoadingBlock,
  MarkdownEditor,
  Spinner,
  TagInput,
} from "../components/ui.jsx";
import AudioPlayer from "../components/AudioPlayer.jsx";
import { NodeDialog } from "../components/dialogs.jsx";
import { descendantIds, flattenNodes, nodeDisplay } from "../lib/hierarchy.js";
import {
  IMPORTANCE,
  NODE_TYPE_LABEL,
  formatDate,
  importanceLabel,
  importanceTone,
  pageLabel,
  typeTone,
} from "../lib/format.js";

function Breadcrumbs({ bookId, detail }) {
  if (!detail) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 text-xs text-stone-500"
    >
      <Link
        to={`/books/${bookId}`}
        className="hover:text-stone-900 hover:underline"
      >
        Book
      </Link>
      {detail.ancestors.map((ancestor) => (
        <span key={ancestor.id} className="flex items-center gap-1">
          <ChevronRight aria-hidden="true" className="h-3 w-3 text-stone-300" />
          <Link
            to={`/books/${bookId}?node=${ancestor.id}`}
            className="max-w-40 truncate hover:text-stone-900 hover:underline"
          >
            {nodeDisplay(ancestor)}
          </Link>
        </span>
      ))}
    </nav>
  );
}

function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="label">
      {children}
    </label>
  );
}

export default function Workspace() {
  const { bookId, book, index, refresh, loading, error } = useOutletContext();
  const { showToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("node");

  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [draft, setDraft] = useState(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [subtitlesDraft, setSubtitlesDraft] = useState([]);
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [nodeDialog, setNodeDialog] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [deletingAudio, setDeletingAudio] = useState(false);
  const [audioDeleteOpen, setAudioDeleteOpen] = useState(false);
  const audioInputRef = useRef(null);

  const loadDetail = useCallback(async () => {
    if (!bookId || !selectedId) {
      setDetail(null);
      setDraft(null);
      setTextDraft("");
      return;
    }
    setDetailLoading(true);
    setDetailError(null);
    try {
      const data = await api.getNode(bookId, selectedId);
      setDetail(data);
      const node = data.node;
      setDraft({
        slNo: node.slNo || "",
        type: node.type,
        parentId: node.parentId || "",
        importance: node.importance || "medium",
        tags: node.tags || [],
        themes: node.themes || "",
        favorite: Boolean(node.favorite),
        currentTopic: Boolean(node.currentTopic),
        relatedNodeIds: node.relatedNodeIds || [],
      });
      setTitleDraft(node.title || node.label || "");
      setSubtitlesDraft(Array.isArray(node.subtitles) ? node.subtitles : []);
      setNotesDraft(data.notes || data.text || "");
    } catch (err) {
      setDetailError(err);
      setDetail(null);
      setDraft(null);
    } finally {
      setDetailLoading(false);
    }
  }, [bookId, selectedId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (!index) return;
    const stillExists =
      selectedId && index.nodes.some((node) => node.id === selectedId);
    if (stillExists) return;
    const first = [...index.nodes].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    )[0];
    if (first) setSearchParams({ node: first.id }, { replace: true });
  }, [index, selectedId, setSearchParams]);

  const reload = useCallback(async () => {
    await refresh();
    await loadDetail();
  }, [refresh, loadDetail]);

  const nodes = useMemo(() => index?.nodes || [], [index]);

  const dirty = useMemo(() => {
    if (!detail || !draft) return false;
    const node = detail.node;
    return (
      draft.slNo !== (node.slNo || "") ||
      draft.type !== node.type ||
      (draft.parentId || null) !== (node.parentId || null) ||
      draft.importance !== (node.importance || "medium") ||
      draft.themes !== (node.themes || "") ||
      Boolean(draft.favorite) !== Boolean(node.favorite) ||
      Boolean(draft.currentTopic) !== Boolean(node.currentTopic) ||
      draft.tags.join("|") !== (node.tags || []).join("|") ||
      draft.relatedNodeIds.join("|") !==
        (node.relatedNodeIds || []).join("|") ||
      titleDraft !== (node.title || node.label || "") ||
      subtitlesDraft.join("|") !== (node.subtitles || []).join("|") ||
      notesDraft !== (detail.notes || detail.text || "")
    );
  }, [detail, draft, titleDraft, subtitlesDraft, notesDraft]);

  const save = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await api.updateNode(bookId, selectedId, {
        slNo: draft.slNo,
        type: draft.type,
        parentId: draft.parentId || null,
        importance: draft.importance,
        tags: draft.tags,
        themes: draft.themes,
        favorite: draft.favorite,
        currentTopic: draft.currentTopic,
        relatedNodeIds: draft.relatedNodeIds,
        title: titleDraft,
        subtitles: subtitlesDraft,
        notes: notesDraft,
        text: notesDraft, // backwards-compat
      });
      await reload();
      showToast("Saved.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const move = async (direction) => {
    if (dirty) await save();
    try {
      await api.reorderNode(bookId, selectedId, direction);
      await refresh();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteNode(bookId, selectedId);
      setDeleteOpen(false);
      await refresh();
      if (detail?.node?.parentId)
        setSearchParams({ node: detail.node.parentId });
      else setSearchParams({});
      showToast("Node and children deleted.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleAudioUpload = async (event) => {
    const file = event.target.files?.[0];
    const targetNodeId = node?.id || selectedId;
    if (!file || !targetNodeId) return;
    setUploadingAudio(true);
    try {
      const res = await api.uploadNodeAudio(bookId, targetNodeId, file);
      if (res?.node) {
        setDetail((prev) => (prev ? { ...prev, node: res.node } : prev));
      }
      await reload();
      showToast(`Audio attached: ${file.name}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingAudio(false);
      if (event.target) event.target.value = "";
    }
  };

  const handleAudioDelete = async () => {
    const targetNodeId = node?.id || selectedId;
    if (!targetNodeId) return;
    setDeletingAudio(true);
    try {
      const res = await api.deleteNodeAudio(bookId, targetNodeId);
      if (res?.node) {
        setDetail((prev) => (prev ? { ...prev, node: res.node } : prev));
      }
      setAudioDeleteOpen(false);
      await reload();
      showToast("Audio removed.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeletingAudio(false);
    }
  };

  const set = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const parentOptions = useMemo(() => {
    if (!draft) return [];
    const blocked = new Set(descendantIds(nodes, selectedId));
    blocked.add(selectedId);
    return flattenNodes(nodes).filter((item) => !blocked.has(item.id));
  }, [nodes, selectedId, draft]);

  if (!bookId) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <EmptyState
          icon={FileText}
          title="Choose a book to begin"
          description="Select a book from the sidebar, or create one from the dashboard."
          action={
            <Link to="/" className="btn btn-primary">
              Go to dashboard
            </Link>
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <ErrorBlock error={error} onRetry={refresh} />
      </div>
    );
  }

  if (loading && !index)
    return <LoadingBlock label="Opening research files…" />;

  const node =
    detail?.node || nodes.find((item) => item.id === selectedId) || null;

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 bg-white px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-stone-400 uppercase">
            Research workspace
          </p>
          <h1 className="truncate font-serif text-lg font-semibold text-stone-900">
            {book?.title || "Book"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setNodeDialog({ defaultType: "chapter" })}
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Chapter
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() =>
              setNodeDialog({
                defaultType: node
                  ? node.type === "chapter" || node.type === "story"
                    ? "passage"
                    : "note"
                  : "passage",
                parentId: node?.id || null,
              })
            }
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Child
          </button>
          <a
            className="btn btn-secondary btn-sm"
            href={api.markdownExportUrl(bookId)}
          >
            <Download aria-hidden="true" className="h-3.5 w-3.5" />
            Export Markdown
          </a>
          <Link
            to={`/books/${bookId}/read`}
            className="btn btn-secondary btn-sm"
          >
            <Newspaper aria-hidden="true" className="h-3.5 w-3.5" />
            Read
          </Link>
        </div>
      </div>

      {index && index.nodes.length === 0 ? (
        <div className="mx-auto max-w-3xl px-6 py-12">
          <EmptyState
            icon={FileText}
            title="Start the research hierarchy"
            description="Add a chapter first, then attach passages, lines, word studies, notes or concepts to it."
            action={
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setNodeDialog({ defaultType: "chapter" })}
              >
                Add the first chapter
              </button>
            }
          />
        </div>
      ) : detailError ? (
        <div className="mx-auto max-w-3xl px-6 py-10">
          <ErrorBlock error={detailError} onRetry={loadDetail} />
        </div>
      ) : !detail && !detailLoading && !node ? (
        <div className="mx-auto max-w-3xl px-6 py-12">
          <EmptyState
            icon={FileText}
            title="Select a node"
            description="Choose a node in the sidebar to read and edit it."
          />
        </div>
      ) : !detail || !draft ? (
        <LoadingBlock label="Loading node…" />
      ) : (
        <div className="grid items-start gap-4 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 space-y-4">
            <Breadcrumbs bookId={bookId} detail={detail} />

            <header>
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <Badge className={typeTone(node.type)}>
                  {NODE_TYPE_LABEL[node.type] || node.type}
                </Badge>
                {node.slNo ? <Badge>sl. {node.slNo}</Badge> : null}
                {pageLabel(node) ? <Badge>{pageLabel(node)}</Badge> : null}
                <Badge className={importanceTone(node.importance)}>
                  {importanceLabel(node.importance)}
                </Badge>
                {node.favorite ? (
                  <Badge className="border-amber-300 bg-amber-50 text-amber-900">
                    <Star
                      aria-hidden="true"
                      className="h-3 w-3 fill-amber-400"
                    />{" "}
                    Favourite
                  </Badge>
                ) : null}
                {node.currentTopic ? (
                  <Badge className="border-sky-200 bg-sky-50 text-sky-800">
                    Current topic
                  </Badge>
                ) : null}
                {node.audioFile ? (
                  <Badge className="border-emerald-300 bg-emerald-50 text-emerald-800">
                    <Headphones
                      aria-hidden="true"
                      className="mr-1 inline h-3 w-3"
                    />{" "}
                    Audio attached
                  </Badge>
                ) : null}
                {(node.tags || []).map((tag) => (
                  <Badge key={tag}>#{tag}</Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-serif text-2xl leading-tight font-semibold text-stone-900 sm:text-3xl">
                  {titleDraft ||
                    node.label ||
                    NODE_TYPE_LABEL[node.type] ||
                    "Untitled node"}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {dirty ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={save}
                      disabled={saving}
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </header>

            {/* ── Title ── */}
            <section
              className="card p-4 space-y-1"
              aria-labelledby="title-heading"
            >
              <label id="title-heading" htmlFor="node-title" className="label">
                Title
              </label>
              <input
                id="node-title"
                className="input text-base font-medium"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                placeholder="Node title…"
              />
            </section>

            {/* ── Subtitles ── */}
            <section
              className="card p-4 space-y-2"
              aria-labelledby="subtitles-heading"
            >
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="subtitles-heading"
                  className="text-sm font-semibold text-stone-800"
                >
                  Subtitles{" "}
                  <span className="text-xs font-normal text-stone-400">
                    (optional)
                  </span>
                </h2>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSubtitlesDraft((prev) => [...prev, ""])}
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  Add subtitle
                </button>
              </div>
              {subtitlesDraft.length === 0 ? (
                <p className="text-xs text-stone-400">
                  No subtitles yet — click "Add subtitle" to add one.
                </p>
              ) : (
                <ul className="space-y-2">
                  {subtitlesDraft.map((sub, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="shrink-0 text-xs text-stone-400 tabular-nums w-5 text-right">
                        {idx + 1}.
                      </span>
                      <input
                        id={`node-subtitle-${idx}`}
                        className="input flex-1"
                        value={sub}
                        onChange={(e) =>
                          setSubtitlesDraft((prev) =>
                            prev.map((s, i) =>
                              i === idx ? e.target.value : s,
                            ),
                          )
                        }
                        placeholder={`Subtitle ${idx + 1}…`}
                      />
                      <button
                        type="button"
                        aria-label="Remove subtitle"
                        className="shrink-0 rounded p-1 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        onClick={() =>
                          setSubtitlesDraft((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* ── Notes ── */}
            <section className="card" aria-labelledby="notes-heading">
              <div className="border-b border-stone-100 px-4 pt-3">
                <h2
                  id="notes-heading"
                  className="text-sm font-semibold text-stone-800"
                >
                  Notes
                </h2>
                <p className="text-xs text-stone-500">Markdown supported.</p>
              </div>
              <div className="p-4">
                <MarkdownEditor
                  id="node-notes"
                  label=""
                  value={notesDraft}
                  onChange={setNotesDraft}
                  rows={14}
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-stone-100 px-4 py-3">
                <p className="text-xs text-stone-400">
                  Updated {formatDate(node.updatedAt)}
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={save}
                  disabled={!dirty || saving}
                >
                  {saving ? "Saving…" : dirty ? "Save" : "Saved"}
                </button>
              </div>
            </section>

            <section className="card p-4" aria-labelledby="children-heading">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2
                  id="children-heading"
                  className="text-sm font-semibold text-stone-800"
                >
                  Child nodes ({detail.children.length})
                </h2>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setNodeDialog({ parentId: node.id, defaultType: "note" })
                  }
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  Add child
                </button>
              </div>
              {detail.children.length ? (
                <ul className="divide-y divide-stone-100">
                  {detail.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        to={`/books/${bookId}?node=${child.id}`}
                        className="flex items-center gap-2 py-2 text-sm text-stone-700 hover:text-stone-900"
                      >
                        <span className="w-8 shrink-0 text-xs text-stone-400 tabular-nums">
                          {child.slNo ? `${child.slNo}.` : "—"}
                        </span>
                        <Badge className={typeTone(child.type)}>
                          {NODE_TYPE_LABEL[child.type] || child.type}
                        </Badge>
                        <span className="min-w-0 truncate">
                          {child.label || child.type}
                        </span>
                        {child.importance === "high" ? (
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500"
                            aria-label="Important"
                          />
                        ) : null}
                        {child.favorite ? (
                          <Star
                            aria-hidden="true"
                            className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500"
                          />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stone-400">No child nodes yet.</p>
              )}
            </section>

            {/* Audio Recording Attachment Section */}
            <section className="card p-4" aria-labelledby="audio-heading">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2
                  id="audio-heading"
                  className="text-sm font-semibold text-stone-800"
                >
                  Audio recording
                </h2>
                {node.audioFile ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={uploadingAudio}
                  >
                    <Upload aria-hidden="true" className="h-3.5 w-3.5" />
                    {uploadingAudio ? "Uploading…" : "Replace audio"}
                  </button>
                ) : null}
              </div>

              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.webm,.flac"
                className="hidden"
                onClick={(e) => {
                  e.target.value = "";
                }}
                onChange={handleAudioUpload}
              />

              {node.audioFile ? (
                <AudioPlayer
                  src={api.nodeAudioUrl(
                    bookId,
                    node.id,
                    false,
                    node.updatedAt || node.audioFile,
                  )}
                  title={node.audioOriginalName || "Attached audio file"}
                  downloadUrl={api.nodeAudioUrl(
                    bookId,
                    node.id,
                    true,
                    node.updatedAt || node.audioFile,
                  )}
                  onReplace={() => audioInputRef.current?.click()}
                  onDelete={() => setAudioDeleteOpen(true)}
                />
              ) : (
                <div
                  onClick={() =>
                    !uploadingAudio && audioInputRef.current?.click()
                  }
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50/50 px-6 py-6 text-center transition-colors hover:border-stone-400 hover:bg-stone-100/60"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      audioInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload audio recording"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-stone-200/80 text-stone-600">
                    {uploadingAudio ? (
                      <Spinner />
                    ) : (
                      <Music className="h-5 w-5" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-stone-700">
                    {uploadingAudio
                      ? "Uploading audio file…"
                      : "Click to attach an MP3 or audio file"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-stone-400">
                    Supports MP3, WAV, M4A, OGG, AAC, WebM up to 100MB
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right panel: every scalar field plus the related-node picker. */}
          <aside className="card space-y-4 p-4" aria-label="Node details">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-stone-800">Details</h2>
              {dirty ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={save}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel htmlFor="field-sl-no">sl. no.</FieldLabel>
                <input
                  id="field-sl-no"
                  className="input"
                  value={draft.slNo}
                  onChange={(event) => set({ slNo: event.target.value })}
                  placeholder="your serial"
                />
              </div>
              <div>
                <FieldLabel htmlFor="field-type">Type</FieldLabel>
                <select
                  id="field-type"
                  className="input"
                  value={draft.type}
                  onChange={(event) => set({ type: event.target.value })}
                >
                  {IMPORTANCE &&
                    Object.entries(NODE_TYPE_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="field-parent">Parent node</FieldLabel>
              <select
                id="field-parent"
                className="input"
                value={draft.parentId || ""}
                onChange={(event) => set({ parentId: event.target.value })}
              >
                <option value="">(null) top level</option>
                {parentOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {`${"— ".repeat(Math.min(item.depth, 6))}${item.label || item.type}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="field-importance">Importance</FieldLabel>
              <select
                id="field-importance"
                className="input"
                value={draft.importance}
                onChange={(event) => set({ importance: event.target.value })}
              >
                {IMPORTANCE.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="field-tags">
                Tags (comma separated)
              </FieldLabel>
              <TagInput
                id="field-tags"
                value={draft.tags}
                onChange={(tags) => set({ tags })}
              />
            </div>

            <div>
              <FieldLabel htmlFor="field-themes">Themes (any text)</FieldLabel>
              <textarea
                id="field-themes"
                className="input"
                rows="2"
                value={draft.themes}
                onChange={(event) => set({ themes: event.target.value })}
                placeholder="e.g. memory as repetition"
              />
            </div>

            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 accent-stone-800"
                  checked={draft.favorite}
                  onChange={(event) => set({ favorite: event.target.checked })}
                />
                Favourite
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 accent-stone-800"
                  checked={draft.currentTopic}
                  onChange={(event) =>
                    set({ currentTopic: event.target.checked })
                  }
                />
                Current topic
              </label>
            </div>

            <CheckList
              label="Related nodes"
              items={flattenNodes(nodes).filter((item) => item.id !== node.id)}
              selectedIds={draft.relatedNodeIds}
              onChange={(relatedNodeIds) => set({ relatedNodeIds })}
              renderLabel={(item) => nodeDisplay(item)}
              renderMeta={(item) => NODE_TYPE_LABEL[item.type] || item.type}
              searchPlaceholder="Search by tags or sl. no…"
              matches={(filter, item) => {
                const needle = filter.trim().toLowerCase();
                if (!needle) return true;
                if (item.slNo && item.slNo.toLowerCase().includes(needle))
                  return true;
                if ((item.tags || []).some((tag) => tag.includes(needle)))
                  return true;
                return (item.label || "").toLowerCase().includes(needle);
              }}
              emptyLabel="No other nodes yet."
            />

            <div className="border-t border-stone-100 pt-3">
              <p className="mb-2 text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                Quick actions
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => move("up")}
                >
                  <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                  Up
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => move("down")}
                >
                  <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                  Down
                </button>
                <Link
                  to={`/books/${bookId}/read?node=${node.id}`}
                  className="btn btn-secondary btn-sm"
                  title="Open this node in reading mode"
                >
                  <Newspaper aria-hidden="true" className="h-3.5 w-3.5" />
                  Read
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}

      {nodeDialog ? (
        <NodeDialog
          bookId={bookId}
          nodes={nodes}
          node={nodeDialog.node || null}
          parentId={nodeDialog.parentId ?? null}
          defaultType={nodeDialog.defaultType}
          onClose={() => setNodeDialog(null)}
          onSaved={async (savedNode, isEdit) => {
            await refresh();
            if (!isEdit && savedNode?.id) {
              setSearchParams({ node: savedNode.id });
            } else {
              await loadDetail();
            }
            showToast(isEdit ? "Node updated." : "Node added.");
          }}
        />
      ) : null}

      {deleteOpen ? (
        <ConfirmDialog
          open
          title="Delete this node?"
          message={`This permanently deletes “${node?.label || node?.type || "this node"}” and all of its child nodes from disk. Links from other nodes are cleaned up. There is no undo.`}
          confirmLabel="Delete node"
          busy={deleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      ) : null}

      {audioDeleteOpen ? (
        <ConfirmDialog
          open
          title="Remove audio file?"
          message={`Are you sure you want to remove the audio file attached to “${node?.label || node?.type || "this node"}”? The audio file will be permanently deleted from disk. There is no undo.`}
          confirmLabel="Remove audio"
          busy={deletingAudio}
          onClose={() => setAudioDeleteOpen(false)}
          onConfirm={handleAudioDelete}
        />
      ) : null}
    </div>
  );
}
