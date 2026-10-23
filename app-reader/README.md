# Book Thesis Lab

A local-first research workspace for studying a printed book: transcribe passages, record page
references, write interpretations, organise themes, manage secondary sources, and develop a thesis
from evidence.

All research is stored as **Markdown files plus JSON indexes on your own computer**. There is no
database, no account, and no cloud service.

> A clearly labelled fictional sample book is created on first run so the interface is not empty.
> Every quotation, page number and source in it is invented. Delete it from **Settings** when you
> start real research.

## Stack

- React 19 + Vite, JavaScript (no TypeScript)
- Tailwind CSS v4
- React Router
- Lucide icons
- Node.js + Express 5 local API
- `gray-matter` frontmatter, `react-markdown` rendering
- Node's own text scanning for search (no search service)
- ZIP export/import via `archiver` + `adm-zip`

## Requirements

- Node.js **22 or newer** (developed on Node 22; `node --test` glob support is required)
- npm

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. Vite proxies `/api` to the Express server on port 5174.

To run the production build:

```bash
npm run build
npm start
```

Open <http://localhost:5174>. The Express server serves `client/dist` when it exists.

Copy `.env.example` to `.env` if you want to change ports or the data directory. Environment
variables are optional.

| Script               | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Run API + client together (hot reload)              |
| `npm run dev:client` | Vite only                                           |
| `npm run dev:server` | Express only, with `node --watch`                   |
| `npm run build`      | Build the client into `client/dist`                 |
| `npm start`          | Serve API + built client                            |
| `npm test`           | Run hierarchy, storage, search and archive tests    |
| `npm run lint`       | ESLint over client and server                       |
| `npm run seed:sample`| Create the fictional sample book if it is missing   |

## Project structure

```
book-thesis-lab/
  client/
    index.html
    vite.config.js
    public/favicon.svg
    src/
      App.jsx                  # routes + book list + toasts
      context/app-context.js   # shared books/toast context
      components/              # app shell, hierarchy tree, dialogs, UI primitives
      pages/                   # dashboard, workspace, themes, sources, thesis, search, settings
      lib/                     # API client, formatting, client hierarchy helpers
      index.css                # Tailwind + design tokens
  server/
    src/
      app.js                   # Express app (also used by tests)
      index.js                 # entry point, data bootstrap, sample seeding
      config.js                # ports and data paths
      routes/                  # books, nodes, notes, sources, themes, thesis, search, export
      services/                # bookStore, nodes, notes, sources, themes, thesis, search, archive, sample
      validation/schemas.js    # Zod request schemas
      utils/                   # atomic writes, locking, safe paths, HTTP errors
    test/                      # node:test suites
  data/                        # created at runtime (git-ignored)
    books/<book-id>/
    exports/
```

## Storage format

Each book is a folder. Content lives in `.md` files; relationships live in `index.json`.

```
data/books/<book-id>/
  book.md                  # YAML frontmatter: title, author, year, edition, publisher,
                           # researchQuestion, thesisObjective; body = description
  index.json               # schemaVersion, nodes[], notes[], sources[], themes[], thesis{}
  chapters/chapter-001.md  # story/chapter nodes
  passages/passage-001.md  # paragraph/line/word/concept nodes
  notes/note-001.md        # interpretations, observations, questions, summaries, claims
  themes/theme-001.md      # theme descriptions
  sources/source-001.md    # bibliography + research notes
  thesis/section-001.md    # draft sections
```

### Index shape

```json
{
  "schemaVersion": 1,
  "bookId": "my-book",
  "createdAt": "2026-01-01T10:00:00.000Z",
  "updatedAt": "2026-01-01T10:00:00.000Z",
  "nodes": [
    {
      "id": "node_<uuid>",
      "type": "passage",
      "title": "The lamp passage",
      "parentId": "node_<uuid>",
      "order": 0,
      "file": "passages/passage-001.md",
      "pageStart": 12,
      "pageEnd": 13,
      "importance": "high",
      "tags": ["memory"],
      "createdAt": "…",
      "updatedAt": "…"
    }
  ],
  "notes": [
    {
      "id": "note_<uuid>",
      "type": "interpretation",
      "title": "Light as repetition",
      "nodeId": "node_<uuid>",
      "file": "notes/note-001.md",
      "importance": "high",
      "tags": [],
      "createdAt": "…",
      "updatedAt": "…"
    }
  ],
  "sources": [{ "id": "source_<uuid>", "title": "…", "file": "sources/source-001.md", "nodeIds": [] }],
  "themes": [{ "id": "theme_<uuid>", "name": "Memory", "file": "themes/theme-001.md", "nodeIds": [], "noteIds": [], "sourceIds": [] }],
  "thesis": {
    "statement": "…",
    "claims": [{ "id": "claim_<uuid>", "title": "…", "relation": "support", "nodeIds": [], "noteIds": [], "sourceIds": [] }],
    "sections": [{ "id": "section_<uuid>", "title": "Introduction", "file": "thesis/section-001.md", "order": 0 }]
  }
}
```

- **Markdown is the source of truth for content.** Every file also contains frontmatter metadata so
  the archive remains readable outside the app.
- **`index.json` is the source of truth for navigation and relationships** (ids, parents, order,
  links, tags, importance).
- IDs are random and stable. Filenames are server-allocated (`passage-003.md`) and never derived
  from titles, so renaming a node never breaks links.
- If you edit a Markdown file by hand, keep the frontmatter intact. Change titles and relationships
  through the app so the index stays consistent.

### Node hierarchy

Types: `story`, `chapter`, `passage`, `paragraph`, `line`, `word`, `concept`. The hierarchy is enforced with
`parentId` references; every level is optional, and a note can attach directly to a chapter. Circular
parent/child relationships are rejected. Deleting a node deletes its descendants and their Markdown
files, while attached notes are kept and unlinked.

## Features

- **Hierarchical reading** — story → chapter → paragraph → line → word/concept, with reordering,
  page ranges and editable Markdown.
- **Notes** — interpretations, observations, questions, summaries and thesis claims, each with tags,
  importance and its own file.
- **Search** — scans every book's Markdown and metadata for book/chapter titles, passages, notes,
  themes, sources, bibliographies and thesis drafts. Results include book, chapter and page context.
- **Themes** — reusable groups linking passages, notes and sources across chapters.
- **Sources** — manual bibliographic entry (author, year, type, publisher, DOI, URL, citation key,
  citation) with research notes and evidence links.
- **Thesis workspace** — research question, tentative thesis statement, claims with supporting or
  contradicting evidence, and ordered Markdown draft sections.
- **Importance, tags and filters** — importance levels on nodes and notes; related-passage links;
  hierarchy filters for title, node type, importance, chapter and tag.
- **Export/backup** — per-book ZIP, full-library backup ZIP, whole-book Markdown, chapter/selection
  Markdown, thesis Markdown, and per-source Markdown.
- **Import** — validates archive structure and paths before writing; refuses to overwrite an existing
  book unless you explicitly import it as a copy.

## Safety and data integrity

- The browser never touches the filesystem; all access goes through the API.
- Book ids, record ids and content paths are validated against strict allowlists. Path traversal is
  rejected.
- Request bodies are validated with Zod.
- Writes use a temporary file and atomic rename. Index read-modify-write cycles are serialized per
  book so concurrent edits cannot silently overwrite each other.
- ZIP imports reject absolute paths, `..` segments, unexpected file types, unknown schema versions,
  missing content files and oversized archives (default 50 MB).
- Book deletion requires an explicit `confirm=delete` request and typing the title in the UI.

## Backup and restore

1. Open **Settings & backup**.
2. Download **full backup (.zip)** — contains every book folder (`book.md`, `index.json`, all
   Markdown).
3. Store the ZIP outside this project directory. `data/` is git-ignored because it contains private
   research.
4. To restore, use **Import a book archive**. If the id already exists, tick “import a copy” to keep
   both.

You can also copy the entire `data/` folder to another machine — it is plain files.

## API overview

```
GET    /api/books
POST   /api/books
GET    /api/books/:bookId                 # book + index + tree + counts
PATCH  /api/books/:bookId
DELETE /api/books/:bookId?confirm=delete
POST   /api/books/sample

GET    /api/books/:bookId/files?path=chapters/chapter-001.md
POST   /api/books/:bookId/nodes
GET    /api/books/:bookId/nodes/:nodeId
PATCH  /api/books/:bookId/nodes/:nodeId
DELETE /api/books/:bookId/nodes/:nodeId
POST   /api/books/:bookId/nodes/:nodeId/reorder   { direction: "up" | "down" }

POST   /api/books/:bookId/notes
PATCH  /api/books/:bookId/notes/:noteId
DELETE /api/books/:bookId/notes/:noteId
…      /sources, /themes (same pattern)
GET/PATCH    /api/books/:bookId/thesis
POST/PATCH/DELETE /api/books/:bookId/thesis/claims/:claimId
POST/PATCH/DELETE /api/books/:bookId/thesis/sections/:sectionId

GET    /api/search?q=…&bookId=…&limit=…
GET    /api/books/:bookId/export/archive
GET    /api/books/:bookId/export/markdown?nodeIds=…&noteIds=…&sourceIds=…&thesis=1
GET    /api/export/all
POST   /api/import[?mode=rename]
```

## Tests

```bash
npm test
```

Covers hierarchy operations (nesting, cycle prevention, ordering, ancestry), file storage (atomic
writes, persistence, file moves, cascade deletion, concurrent writes), path safety, search across all
content types and scopes, ZIP export/import validation and Markdown export.

## Known limitations

- Single local user; no authentication and no multi-device sync.
- Bibliographic data is entered manually — nothing is fetched or generated.
- No PDF/EPUB reader; the app is designed for handwritten transcription from a printed book.
- Notes and interpretations are the researcher's own; the app never treats them as verified facts.
