import { type ReactNode } from "react";

export function AppFrame({
  sidebar,
  children,
  header,
  className = "",
}: {
  sidebar?: ReactNode;
  children: ReactNode;
  header?: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex h-full w-full bg-os-bg overflow-hidden text-[13px]">
      {sidebar && (
        <aside className="hidden md:flex w-[220px] shrink-0 border-r border-os-hairline bg-os-panel-2 flex-col overflow-hidden relative">
          {sidebar}
        </aside>
      )}
      <div className={`flex-1 flex flex-col min-w-0 bg-transparent ${className}`}>
        {header && (
          <header className="h-14 border-b border-os-hairline flex items-center px-6 shrink-0 bg-os-panel-2">
            {header}
          </header>
        )}
        <div className="flex-1 overflow-auto relative">
          {children}
        </div>
      </div>
    </div>
  );
}
