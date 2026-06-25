import { identity } from "@/content/identity";

export function ContactApp() {
  return (
    <div className="p-6 font-mono text-[13px]">
      <div className="text-os-signal text-xs mb-3">$ contact --all</div>
      <dl className="grid grid-cols-[80px_1fr] gap-y-2">
        <dt className="text-os-text-dim">email</dt>
        <dd><a className="text-os-signal hover:underline" href={`mailto:${identity.email}`}>{identity.email}</a></dd>
        <dt className="text-os-text-dim">github</dt>
        <dd><a className="text-os-signal hover:underline" href={identity.links.github} target="_blank" rel="noreferrer">{identity.links.github}</a></dd>
        <dt className="text-os-text-dim">linkedin</dt>
        <dd className="text-os-text">{identity.links.linkedin}</dd>
        <dt className="text-os-text-dim">location</dt>
        <dd className="text-os-text">{identity.location}</dd>
      </dl>
      <div className="text-os-text-faint text-xs mt-6">// edit src/content/identity.ts to update.</div>
    </div>
  );
}
