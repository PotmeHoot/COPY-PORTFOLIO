import type { EditableContentDocument } from "../../shared/types/editableContent";

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function parseJsonFile<T>(file: File): Promise<T> {
  const text = await file.text();
  return JSON.parse(text) as T;
}

export function isEditableContentDocument(value: unknown): value is EditableContentDocument {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeDocument = value as Partial<EditableContentDocument>;
  return Boolean(maybeDocument.theme && maybeDocument.site && maybeDocument.sections && maybeDocument.collections);
}
