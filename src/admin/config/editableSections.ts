import type { EditableContentDocument } from "../../shared/types/editableContent";

export const EDITABLE_ROOT_SECTIONS: Array<keyof EditableContentDocument> = [
  "theme",
  "site",
  "sections",
  "collections"
];

export const EDITABLE_SITE_FIELDS: Array<keyof EditableContentDocument["site"]> = [
  "settings",
  "navigation",
  "footer",
  "error"
];

export const EDITABLE_SECTION_FIELDS: Array<keyof EditableContentDocument["sections"]> = [
  "hero",
  "showreel",
  "portfolio",
  "arShowcase",
  "services",
  "collaboration",
  "contact",
  "about",
  "pricing"
];

export const EDITABLE_COLLECTION_FIELDS: Array<keyof EditableContentDocument["collections"]> = [
  "projects",
  "arItems"
];
