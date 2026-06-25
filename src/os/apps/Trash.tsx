export function TrashApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center" style={{ background: "var(--os-bg-2)" }}>
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-os-hairline mb-4 flex items-center justify-center text-os-ink-faint text-3xl">∅</div>
      <div className="text-os-ink text-[16px]">Trash is empty</div>
      <div className="text-os-ink-faint text-[13px] mt-1">Drag files here from Files to delete them.</div>
    </div>
  );
}
