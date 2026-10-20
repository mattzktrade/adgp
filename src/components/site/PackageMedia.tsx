import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function GalleryFilm({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        preload="none"
        controls={playing}
        className="h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing ? (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Play ${label} film`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105">
            <span className="ml-1 inline-block h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-current" />
          </span>
        </button>
      ) : null}
    </div>
  );
}

export function PackageMedia({
  name,
  film,
  filmPoster,
  photos,
}: {
  name: string;
  film?: string;
  filmPoster?: string;
  photos: string[];
}) {
  const frames = useMemo(() => (film ? photos : photos.slice(1)), [film, photos]);
  const [index, setIndex] = useState(film && photos.length > 2 ? 1 : 0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const drag = useRef<number | null>(null);
  const swiped = useRef(false);
  const count = frames.length;
  const canPage = Boolean(film) && count > 2;

  const step = (dir: number) => setIndex((i) => (i + dir + count) % count);
  const visible = count ? [frames[index % count], frames[(index + 1) % count]].filter(Boolean) : [];

  useEffect(() => {
    if (!canPage) return;
    for (const src of frames) {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    }
  }, [canPage, frames]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, count]);

  const onPointerDown = (e: PointerEvent) => {
    if (!canPage) return;
    drag.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (drag.current === null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (dx > 48) {
      swiped.current = true;
      step(-1);
    } else if (dx < -48) {
      swiped.current = true;
      step(1);
    }
  };

  return (
    <div className="mt-14">
      <div className="relative">
      <div className="grid grid-cols-6 gap-3 md:h-[520px] md:grid-rows-[repeat(2,minmax(0,1fr))]">
        <div className="col-span-6 aspect-[16/9] min-h-0 overflow-hidden md:col-span-4 md:row-span-2 md:aspect-auto">
          {film ? (
            <GalleryFilm src={film} poster={filmPoster || photos[0] || ""} label={name} />
          ) : (
            <img
              src={photos[0]}
              alt={`${name} view`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          )}
        </div>
        {visible.map((src, i) => {
          const photoIndex = (index + i) % count;
          const className = "col-span-3 aspect-[4/3] min-h-0 overflow-hidden text-left md:col-span-2 md:aspect-auto";
          const image = (
            <img
              src={src}
              alt=""
              loading="eager"
              draggable={false}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          );
          if (!canPage) {
            return (
              <div key={`${src}-${photoIndex}`} className={className}>
                {image}
              </div>
            );
          }
          return (
            <button
              key={`${src}-${photoIndex}`}
              type="button"
              onClick={() => {
                if (swiped.current) {
                  swiped.current = false;
                  return;
                }
                setLightbox(photoIndex);
              }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              className={className}
              aria-label={`Open photo ${photoIndex + 1} of ${count}`}
            >
              {image}
            </button>
          );
        })}
      </div>
        {canPage ? (
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center border border-white/30 bg-background/75 font-display text-lg backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              aria-label="Previous photos"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center border border-white/30 bg-background/75 font-display text-lg backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              aria-label="Next photos"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
      {canPage ? (
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">{pad(count)} photos</span>
          <span className="eyebrow text-muted-foreground">Swipe, or open a photo</span>
        </div>
      ) : null}

      {lightbox !== null ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photos`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightbox(null);
          }}
        >
          <button type="button" onClick={() => setLightbox(null)} className="absolute right-5 top-5 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
            Close
          </button>
          <button
            type="button"
            onClick={() => setLightbox((i) => (i === null ? i : (i - 1 + count) % count))}
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-border bg-background text-xl md:left-6"
            aria-label="Previous photo"
          >
            ←
          </button>
          <img src={frames[lightbox]} alt="" className="max-h-[85svh] max-w-[calc(100%-7rem)] object-contain" />
          <button
            type="button"
            onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % count))}
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-border bg-background text-xl md:right-6"
            aria-label="Next photo"
          >
            →
          </button>
          <div className="absolute bottom-5 font-mono text-xs text-muted-foreground">
            {pad(lightbox + 1)} / {pad(count)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
