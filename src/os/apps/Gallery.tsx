export function GalleryApp() {
  const tiles = Array.from({ length: 9 });
  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {tiles.map((_, i) => (
        <div key={i} className="aspect-square border border-os-hairline bg-os-panel-2 flex items-center justify-center text-os-text-faint text-xs font-mono dot-grid">
          img_{String(i+1).padStart(2,"0")}
        </div>
      ))}
      <div className="col-span-full text-os-text-faint text-xs font-mono mt-2 px-1">drop images in <span className="text-os-text">/public/gallery/</span> to populate.</div>
    </div>
  );
}
