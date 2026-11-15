import Image from "next/image";

export type MediaAspect = "16/9" | "4/3" | "3/2" | "4/5" | "1/1";

interface MediaFrameProps {
  src?: string | null;
  alt: string;
  aspect?: MediaAspect;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

const ASPECT_CLASSES: Record<MediaAspect, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

export function MediaFrame({
  src,
  alt,
  aspect = "4/3",
  caption,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw",
  className = "",
}: MediaFrameProps) {
  return (
    <figure className={`group ${className}`}>
      <div
        className={`relative overflow-hidden rounded-[var(--radius-media)] border border-border-warm bg-bg-cream-soft shadow-[var(--shadow-soft)] ${ASPECT_CLASSES[aspect]}`}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="surface-luminous flex h-full w-full items-end p-5"
          >
            <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-border-warm">
              Photography placeholder
            </span>
          </div>
        )}
      </div>

      {caption ? (
        <figcaption className="mt-2.5 text-xs leading-relaxed text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
