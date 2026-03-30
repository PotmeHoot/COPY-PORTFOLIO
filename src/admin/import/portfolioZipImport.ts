import { mapLegacyToEditableContentDocument } from "../../content/contentAdapters";
import type { EditableContentDocument } from "../../shared/types/editableContent";
import { decodeTextFile, readZipEntries } from "./zipReader";

interface ImportAssetsReport {
  referenced: string[];
  found: string[];
  missing: string[];
}

export interface PortfolioZipImportResult {
  document: EditableContentDocument;
  assets: ImportAssetsReport;
  warnings: string[];
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\//, "");
}

function findEntryBySuffix(entries: Map<string, Uint8Array>, suffix: string): Uint8Array | null {
  const normalizedSuffix = normalizePath(suffix);

  for (const [name, bytes] of entries.entries()) {
    const normalizedName = normalizePath(name);
    if (normalizedName === normalizedSuffix || normalizedName.endsWith(`/${normalizedSuffix}`)) {
      return bytes;
    }
  }

  return null;
}

function collectReferencedAssetPaths(config: any, projectsData: any): string[] {
  const refs = new Set<string>();

  const add = (value?: string) => {
    if (!value || typeof value !== "string") return;
    refs.add(normalizePath(value));
  };

  add(config?.hero?.backgroundImage);
  add(config?.showreel?.poster);
  add(config?.showreel?.videoUrl);

  for (const project of projectsData?.projects ?? []) {
    if (!project?.folder) continue;

    if (project.poster) {
      add(`assets/projects/${project.folder}/${project.poster}`);
    }

    for (const asset of project.assets ?? []) {
      if (asset?.file) {
        add(`assets/projects/${project.folder}/${asset.file}`);
      }
      if (asset?.webpFile) {
        add(`assets/projects/${project.folder}/${asset.webpFile}`);
      }
    }
  }

  return Array.from(refs);
}

function buildAssetReport(entries: Map<string, Uint8Array>, referenced: string[]): ImportAssetsReport {
  const allPaths = Array.from(entries.keys()).map((path) => normalizePath(path));

  const found: string[] = [];
  const missing: string[] = [];

  for (const ref of referenced) {
    const normalized = normalizePath(ref);
    const isPresent = allPaths.some((path) => path === normalized || path.endsWith(`/${normalized}`) || path === `public/${normalized}` || path.endsWith(`/public/${normalized}`));

    if (isPresent) {
      found.push(ref);
    } else {
      missing.push(ref);
    }
  }

  return { referenced, found, missing };
}

function parseJsonEntry(entries: Map<string, Uint8Array>, path: string): any {
  const bytes = findEntryBySuffix(entries, path);
  if (!bytes) {
    throw new Error(`Missing required file in ZIP: ${path}`);
  }

  try {
    return JSON.parse(decodeTextFile(bytes));
  } catch {
    throw new Error(`Invalid JSON format in ${path}`);
  }
}

function validateLegacyShape(config: any, projectsData: any): void {
  if (!config?.settings || !config?.hero || !config?.portfolio) {
    throw new Error("Invalid config.json: required sections (settings, hero, portfolio) are missing.");
  }

  if (!Array.isArray(projectsData?.projects) || !Array.isArray(projectsData?.arItems)) {
    throw new Error("Invalid projects.json: expected projects[] and arItems[] arrays.");
  }
}

export async function importPortfolioZip(file: File): Promise<PortfolioZipImportResult> {
  const rawEntries = await readZipEntries(file);
  const entries = new Map(rawEntries.map((entry) => [entry.name, entry.data]));

  const config = parseJsonEntry(entries, "public/data/config.json");
  const projectsData = parseJsonEntry(entries, "public/data/projects.json");
  validateLegacyShape(config, projectsData);

  const referenced = collectReferencedAssetPaths(config, projectsData);
  const assets = buildAssetReport(entries, referenced);
  const warnings: string[] = [];

  if (assets.missing.length > 0) {
    warnings.push(`${assets.missing.length} referenced assets were not found in the archive.`);
  }

  return {
    document: mapLegacyToEditableContentDocument(config, projectsData),
    assets,
    warnings
  };
}
