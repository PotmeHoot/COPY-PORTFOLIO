import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { EditableContentDocument } from "../shared/types/editableContent";
import { CONTENT_FILES } from "../content/contentFiles";
import { ADMIN_EDITABLE_CONTENT_STORAGE_KEY } from "../content/storageKeys";
import { downloadJson, parseJsonFile } from "./utils/contentImportExport";
import { importPortfolioZip } from "./import/portfolioZipImport";

const STORAGE_KEY = ADMIN_EDITABLE_CONTENT_STORAGE_KEY;

const sectionClass = "bg-bg-secondary border border-border rounded-xl p-5 space-y-3";
const inputClass = "w-full border border-border rounded-md px-3 py-2 bg-white text-sm";

function parseAssetRows(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [type, file] = line.split(":");
      return { type: (type || "image") as "image" | "video", file: file || "" };
    });
}

function JsonBlockEditor({
  label,
  value,
  onApply
}: {
  label: string;
  value: unknown;
  onApply: (nextValue: any) => void;
}) {
  const [draft, setDraft] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(JSON.stringify(value, null, 2));
  }, [value]);

  const apply = () => {
    try {
      const parsed = JSON.parse(draft);
      onApply(parsed);
      setError(null);
    } catch {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      <textarea className={`${inputClass} min-h-[220px] font-mono`} value={draft} onChange={(e) => setDraft(e.target.value)} />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={apply}>Apply JSON</button>
    </div>
  );
}

export function AdminApp() {
  const [doc, setDoc] = useState<EditableContentDocument | null>(null);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedArItem, setSelectedArItem] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const boot = async () => {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        setDoc(JSON.parse(local));
        setStatus("Loaded draft from local storage");
        return;
      }

      const response = await fetch(CONTENT_FILES.editable);
      const json = await response.json();
      setDoc(json);
      setStatus("Loaded editable content from /public/data/editable-content.json");
    };

    boot().catch(() => setStatus("Failed to load editable content"));
  }, []);

  useEffect(() => {
    if (!doc) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  }, [doc]);

  const projects = doc?.collections.projects ?? [];
  const arItems = doc?.collections.arItems ?? [];

  const currentProject = projects[selectedProject];
  const currentArItem = arItems[selectedArItem];

  const runValidation = () => {
    if (!doc) return;
    const errors: string[] = [];

    if (!doc.site.settings.title.trim()) errors.push("General: settings.title is required");
    if (!doc.site.settings.ownerName.trim()) errors.push("General: settings.ownerName is required");
    if (!doc.site.settings.email.trim()) errors.push("General: settings.email is required");
    if (!doc.sections.hero.title.trim()) errors.push("Hero: title is required");
    if (!doc.sections.hero.description.trim()) errors.push("Hero: description is required");
    if (!doc.collections.projects.length) errors.push("Projects: at least one project is required");

    doc.collections.projects.forEach((project, index) => {
      if (!project.id.trim()) errors.push(`Projects[${index}]: id is required`);
      if (!project.title.trim()) errors.push(`Projects[${index}]: title is required`);
      if (!project.folder.trim()) errors.push(`Projects[${index}]: folder is required`);
      if (!project.poster.trim()) errors.push(`Projects[${index}]: poster is required`);
    });

    setValidationErrors(errors);
    setStatus(errors.length ? `Validation failed (${errors.length} issues)` : "Validation passed");
  };

  const sortedPreview = useMemo(() => {
    if (!doc) return [];
    return [...doc.collections.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [doc]);

  if (!doc) {
    return <div className="min-h-screen bg-bg-primary p-8">{status}</div>;
  }

  const updateProject = (field: string, value: any) => {
    const next = { ...doc };
    (next.collections.projects[selectedProject] as any)[field] = value;
    setDoc(next);
  };

  const reorderProject = (direction: -1 | 1) => {
    const to = selectedProject + direction;
    if (to < 0 || to >= projects.length) return;
    const next = { ...doc };
    [next.collections.projects[selectedProject], next.collections.projects[to]] = [
      next.collections.projects[to],
      next.collections.projects[selectedProject]
    ];
    setSelectedProject(to);
    setDoc(next);
  };

  const removeProject = () => {
    if (!projects.length) return;
    const next = { ...doc };
    next.collections.projects.splice(selectedProject, 1);
    setSelectedProject(Math.max(0, selectedProject - 1));
    setDoc(next);
  };

  const addProject = () => {
    const next = { ...doc };
    next.collections.projects.push({
      id: `new-project-${Date.now()}`,
      title: "New Project",
      category: "Category",
      folder: "new-project",
      poster: "poster.jpg",
      assets: [],
      status: "ready",
      order: next.collections.projects.length + 1
    });
    setSelectedProject(next.collections.projects.length - 1);
    setDoc(next);
  };

  const updateArItem = (field: string, value: any) => {
    const next = { ...doc };
    (next.collections.arItems[selectedArItem] as any)[field] = value;
    setDoc(next);
  };

  const reorderArItem = (direction: -1 | 1) => {
    const to = selectedArItem + direction;
    if (to < 0 || to >= arItems.length) return;
    const next = { ...doc };
    [next.collections.arItems[selectedArItem], next.collections.arItems[to]] = [
      next.collections.arItems[to],
      next.collections.arItems[selectedArItem]
    ];
    setSelectedArItem(to);
    setDoc(next);
  };

  const addArItem = () => {
    const next = { ...doc };
    next.collections.arItems.push({
      id: `new-ar-${Date.now()}`,
      title: "New AR Item",
      platform: "TikTok",
      status: "ready",
      link: "#",
      featured: false,
      order: next.collections.arItems.length + 1
    });
    setSelectedArItem(next.collections.arItems.length - 1);
    setDoc(next);
  };

  const removeArItem = () => {
    if (!arItems.length) return;
    const next = { ...doc };
    next.collections.arItems.splice(selectedArItem, 1);
    setSelectedArItem(Math.max(0, selectedArItem - 1));
    setDoc(next);
  };

  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const parsed = await parseJsonFile<EditableContentDocument>(file);
    setDoc(parsed);
    setImportWarnings([]);
    setImportErrors([]);
    setStatus("Imported JSON file");
  };

  const importZip = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await importPortfolioZip(file);
      setDoc(result.document);
      setImportWarnings(result.warnings);
      setImportErrors([]);
      setStatus(`ZIP import complete. ${result.assets.found.length}/${result.assets.referenced.length} referenced assets found.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown ZIP import error.";
      setImportErrors([message]);
      setStatus("ZIP import failed");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-6xl mx-auto p-6 space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Admin (Local)</h1>
            <p className="text-sm text-text-secondary">{status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" className="btn-secondary !py-2 !px-4 !text-sm">Open public site</a>
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={runValidation}>Validate</button>
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={() => downloadJson("editable-content.json", doc)}>Export JSON</button>
            <label className="btn-secondary !py-2 !px-4 !text-sm cursor-pointer">
              Import JSON
              <input type="file" accept="application/json" className="hidden" onChange={importJson} />
            </label>
            <label className="btn-secondary !py-2 !px-4 !text-sm cursor-pointer">
              Import ZIP
              <input type="file" accept=".zip,application/zip" className="hidden" onChange={importZip} />
            </label>
            <button
              className="btn-secondary !py-2 !px-4 !text-sm"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setStatus("Draft cleared from local storage. Refresh to reload source file.");
              }}
            >
              Clear draft
            </button>
          </div>
        </header>

        {!!validationErrors.length && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-semibold mb-2">Validation errors</p>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        )}

        {!!importErrors.length && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-semibold mb-2">ZIP import errors</p>
            <ul className="list-disc pl-5 space-y-1">
              {importErrors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        )}

        {!!importWarnings.length && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-2">ZIP import warnings</p>
            <ul className="list-disc pl-5 space-y-1">
              {importWarnings.map((warning) => <li key={warning}>{warning}</li>)}
            </ul>
          </div>
        )}

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">General settings</h2>
          <input className={inputClass} value={doc.site.settings.title} onChange={(e) => setDoc({ ...doc, site: { ...doc.site, settings: { ...doc.site.settings, title: e.target.value } } })} placeholder="Site title" />
          <input className={inputClass} value={doc.site.settings.ownerName} onChange={(e) => setDoc({ ...doc, site: { ...doc.site, settings: { ...doc.site.settings, ownerName: e.target.value } } })} placeholder="Owner name" />
          <input className={inputClass} value={doc.site.settings.email} onChange={(e) => setDoc({ ...doc, site: { ...doc.site, settings: { ...doc.site.settings, email: e.target.value } } })} placeholder="Email" />
          <JsonBlockEditor label="Navigation labels & visibility" value={doc.site.navigation} onApply={(nextValue) => setDoc({ ...doc, site: { ...doc.site, navigation: nextValue } })} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Theme settings</h2>
          {Object.entries(doc.theme).map(([key, value]) => (
            <label key={key} className="block">
              <span className="text-xs uppercase tracking-widest text-text-secondary">{key}</span>
              <input
                className={inputClass}
                value={value ?? ""}
                onChange={(e) => setDoc({ ...doc, theme: { ...doc.theme, [key]: e.target.value } })}
              />
            </label>
          ))}
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Hero</h2>
          <input className={inputClass} value={doc.sections.hero.eyebrow} onChange={(e) => setDoc({ ...doc, sections: { ...doc.sections, hero: { ...doc.sections.hero, eyebrow: e.target.value } } })} placeholder="Eyebrow" />
          <input className={inputClass} value={doc.sections.hero.title} onChange={(e) => setDoc({ ...doc, sections: { ...doc.sections, hero: { ...doc.sections.hero, title: e.target.value } } })} placeholder="Title" />
          <textarea className={`${inputClass} min-h-[90px]`} value={doc.sections.hero.description} onChange={(e) => setDoc({ ...doc, sections: { ...doc.sections, hero: { ...doc.sections.hero, description: e.target.value } } })} placeholder="Description" />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Showreel</h2>
          <input className={inputClass} value={doc.sections.showreel.title} onChange={(e) => setDoc({ ...doc, sections: { ...doc.sections, showreel: { ...doc.sections.showreel, title: e.target.value } } })} placeholder="Title" />
          <textarea className={`${inputClass} min-h-[90px]`} value={doc.sections.showreel.description} onChange={(e) => setDoc({ ...doc, sections: { ...doc.sections, showreel: { ...doc.sections.showreel, description: e.target.value } } })} placeholder="Description" />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Portfolio labels</h2>
          <JsonBlockEditor label="Portfolio copy and labels" value={doc.sections.portfolio} onApply={(nextValue) => setDoc({ ...doc, sections: { ...doc.sections, portfolio: nextValue } })} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Projects manager</h2>
          <div className="flex flex-wrap gap-2">
            {projects.map((project, index) => (
              <button key={project.id} className={`btn-secondary !py-1.5 !px-3 !text-xs ${selectedProject === index ? "!border-accent" : ""}`} onClick={() => setSelectedProject(index)}>{project.title}</button>
            ))}
            <button className="btn-secondary !py-1.5 !px-3 !text-xs" onClick={addProject}>+ Add project</button>
          </div>

          {currentProject && (
            <div className="grid md:grid-cols-2 gap-3">
              <input className={inputClass} value={currentProject.id} onChange={(e) => updateProject("id", e.target.value)} placeholder="id" />
              <input className={inputClass} value={currentProject.title} onChange={(e) => updateProject("title", e.target.value)} placeholder="title" />
              <input className={inputClass} value={currentProject.category} onChange={(e) => updateProject("category", e.target.value)} placeholder="category" />
              <input className={inputClass} value={currentProject.folder} onChange={(e) => updateProject("folder", e.target.value)} placeholder="folder" />
              <input className={inputClass} value={currentProject.poster} onChange={(e) => updateProject("poster", e.target.value)} placeholder="poster" />
              <input className={inputClass} value={currentProject.year ?? ""} onChange={(e) => updateProject("year", e.target.value)} placeholder="year" />
              <textarea className={`${inputClass} md:col-span-2 min-h-[70px]`} value={currentProject.shortDescription ?? ""} onChange={(e) => updateProject("shortDescription", e.target.value)} placeholder="shortDescription" />
              <textarea className={`${inputClass} md:col-span-2 min-h-[90px]`} value={currentProject.process ?? ""} onChange={(e) => updateProject("process", e.target.value)} placeholder="process" />
              <label className="text-xs md:col-span-2">Assets (one per line: image:file.jpg or video:file.mp4)</label>
              <textarea
                className={`${inputClass} md:col-span-2 min-h-[90px] font-mono`}
                value={currentProject.assets.map((asset) => `${asset.type}:${asset.file}`).join("\n")}
                onChange={(e) => updateProject("assets", parseAssetRows(e.target.value))}
              />
            </div>
          )}

          <div className="flex gap-2">
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={() => reorderProject(-1)}>Move up</button>
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={() => reorderProject(1)}>Move down</button>
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={removeProject}>Remove</button>
          </div>
          <p className="text-xs text-text-secondary">Preview order: {sortedPreview.map((project) => project.title).join(" → ")}</p>
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">AR items</h2>
          <div className="flex flex-wrap gap-2">
            {arItems.map((item, index) => (
              <button key={item.id} className={`btn-secondary !py-1.5 !px-3 !text-xs ${selectedArItem === index ? "!border-accent" : ""}`} onClick={() => setSelectedArItem(index)}>{item.title}</button>
            ))}
            <button className="btn-secondary !py-1.5 !px-3 !text-xs" onClick={addArItem}>+ Add AR item</button>
          </div>
          {currentArItem && (
            <div className="grid md:grid-cols-2 gap-3">
              <input className={inputClass} value={currentArItem.id} onChange={(e) => updateArItem("id", e.target.value)} placeholder="id" />
              <input className={inputClass} value={currentArItem.title} onChange={(e) => updateArItem("title", e.target.value)} placeholder="title" />
              <input className={inputClass} value={currentArItem.platform} onChange={(e) => updateArItem("platform", e.target.value)} placeholder="platform" />
              <input className={inputClass} value={currentArItem.link} onChange={(e) => updateArItem("link", e.target.value)} placeholder="link" />
            </div>
          )}
          <div className="flex gap-2">
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={() => reorderArItem(-1)}>Move up</button>
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={() => reorderArItem(1)}>Move down</button>
            <button className="btn-secondary !py-2 !px-4 !text-sm" onClick={removeArItem}>Remove</button>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Services</h2>
          <JsonBlockEditor label="Services section" value={doc.sections.services} onApply={(nextValue) => setDoc({ ...doc, sections: { ...doc.sections, services: nextValue } })} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">About</h2>
          <JsonBlockEditor label="About section" value={doc.sections.about} onApply={(nextValue) => setDoc({ ...doc, sections: { ...doc.sections, about: nextValue } })} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Pricing</h2>
          <JsonBlockEditor label="Pricing section" value={doc.sections.pricing} onApply={(nextValue) => setDoc({ ...doc, sections: { ...doc.sections, pricing: nextValue } })} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Collaboration</h2>
          <JsonBlockEditor label="Collaboration section" value={doc.sections.collaboration} onApply={(nextValue) => setDoc({ ...doc, sections: { ...doc.sections, collaboration: nextValue } })} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Contact</h2>
          <JsonBlockEditor label="Contact section" value={doc.sections.contact} onApply={(nextValue) => setDoc({ ...doc, sections: { ...doc.sections, contact: nextValue } })} />
        </section>

        <section className={sectionClass}>
          <h2 className="text-lg font-semibold">Footer / error labels</h2>
          <JsonBlockEditor label="Footer labels" value={doc.site.footer} onApply={(nextValue) => setDoc({ ...doc, site: { ...doc.site, footer: nextValue } })} />
          <JsonBlockEditor label="Error labels" value={doc.site.error} onApply={(nextValue) => setDoc({ ...doc, site: { ...doc.site, error: nextValue } })} />
        </section>
      </div>
    </div>
  );
}
