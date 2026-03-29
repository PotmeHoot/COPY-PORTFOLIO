import { Project } from "../../types/content";

interface ProjectMetaOverlayProps {
  item: Project;
}

export const ProjectMetaOverlay = ({
  item
}: ProjectMetaOverlayProps) => {
  return (
    <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-white/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/70">
            {item.category}
          </span>
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {item.title}
        </h3>
      </div>
    </div>
  );
};
