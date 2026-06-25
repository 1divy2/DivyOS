import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/os/shell/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DivyOS — a personal operating system" },
      { name: "description", content: "DivyOS is a fictional operating system built as a portfolio. Boot in, open the terminal, and explore." },
      { property: "og:title", content: "DivyOS — a personal operating system" },
      { property: "og:description", content: "A fictional personal OS built by Divy. Real projects. Real terminal. Real OS feel." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Desktop />;
}
