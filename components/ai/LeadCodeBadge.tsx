export function LeadCodeBadge({leadCode}: {leadCode: string}) {
  return (
    <span className="font-mono text-[10px] bg-accent/20 text-accent px-2 py-1">
      {leadCode}
    </span>
  );
}
