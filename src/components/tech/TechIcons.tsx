import { cn } from "@/lib/utils";

/** Simple Icons slugs for each tech chip */
const SLUGS: Record<string, string> = {
  React: "react",
  "Next.js": "nextdotjs",
  NestJS: "nestjs",
  "Node.js": "nodedotjs",
  FastAPI: "fastapi",
  PostgreSQL: "postgresql",
  Supabase: "supabase",
  Docker: "docker",
  "Git / GitHub": "github",
};

export function TechIcon({
  name,
  mode,
  brandColor,
  className,
}: {
  name: string;
  mode: "color" | "mono";
  brandColor: string;
  className?: string;
}) {
  const slug = SLUGS[name];
  if (!slug) return null;

  const hex =
    mode === "mono"
      ? "ffe81f"
      : name === "Next.js"
        ? "ffffff"
        : brandColor.replace("#", "");

  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/${hex}`}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
