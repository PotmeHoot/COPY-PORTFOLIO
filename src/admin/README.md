# Local-first Admin

## Open locally
- Start dev server: `npm run dev`
- Open admin: `http://localhost:3000/admin`
- Open portfolio: `http://localhost:3000/`

## Data source
- Reads from: `public/data/editable-content.json`
- Draft edits are auto-saved to: `localStorage` key `portfolio-admin-editable-content`
- Export to file using **Export JSON** button and replace `public/data/editable-content.json` when ready.

## ZIP import (Phase 4)
- Use **Import ZIP** in admin.
- Supported archives are portfolio repos with at least:
  - `public/data/config.json`
  - `public/data/projects.json`
- The importer validates structure and converts legacy content into the normalized editable model.
- Referenced assets are scanned and reported as found/missing.
- Unsupported ZIP formats (encrypted, data-descriptor entries, unsupported compression methods) are rejected with clear errors.

## Scope
This admin is intentionally limited to structured content and theme token editing.
It does not change layout architecture or act as a page builder.
