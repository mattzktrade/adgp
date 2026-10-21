import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type MediaItem =
  | { type: "film"; src: string; poster: string }
  | { type: "photo"; src: string };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function PlayMark({ size = "lg" }: { size?: "sm" | "lg" }) {
  const wrap = size === "lg" ? "h-16 w-16" : "h-7 w-7";
  const tri = size === "lg" ? "border-y-[9px] border-l-[15px]" : "border-y-[5px] border-l-[8px]";
  return (
    <span className={`flex ${wrap} items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg`}>
      <span className={`ml-0.5 inline-block h-0 w-0 ${tri} border-y-transparent border-l-current`} />
    </span>
  );
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
        <button type="button" onClick={toggle} className="absolute inset-0 flex items-center justify-center" aria-label={`Play ${label} film`}>
          <span className="transition-transform hover:scale-105">
            <PlayMark />
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
  film?: string | undefined;
  filmPoster?: string | undefined;
  photos: string[];
}) {
  const items = useMemo<MediaItem[]>(() => {
    const next: MediaItem[] = [];
    if (film) next.push({ type: "film", src: film, poster: filmPoster || photos[0] || "" });
    for (const src of photos) next.push({ type: "photo", src });
    return next;
  }, [film, filmPoster, photos]);

  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [stripOverflow, setStripOverflow] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);
  const swiped = useRef(false);
  const count = items.length;
  const current = items[index];
  const canPage = count > 1;
  const photoIndexes = useMemo(() => items.flatMap((item, i) => (item.type === "photo" ? [i] : [])), [items]);

  const step = (dir: number) => setIndex((i) => (i + dir + count) % count);

  const stepPhoto = (dir: number) => {
    if (!photoIndexes.length) return;
    const from = lightbox ?? index;
    const at = photoIndexes.indexOf(from);
    const next = photoIndexes[(at === -1 ? 0 : at + dir + photoIndexes.length) % photoIndexes.length]!;
    setIndex(next);
    setLightbox(next);
  };

  useEffect(() => {
    setIndex(0);
    setLightbox(null);
  }, [name, film]);

  useEffect(() => {
    for (const item of items) {
      const src = item.type === "film" ? item.poster : item.src;
      if (!src) continue;
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    }
  }, [items]);

  useEffect(() => {
    const root = stripRef.current;
    if (!root) return;
    const update = () => setStripOverflow(root.scrollWidth > root.clientWidth + 8);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(root);
    return () => ro.disconnect();
  }, [items, canPage]);

  useEffect(() => {
    const root = stripRef.current;
    const thumb = root?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    if (!root || !thumb) return;
    const left = thumb.offsetLeft - (root.clientWidth - thumb.offsetWidth) / 2;
    root.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") stepPhoto(1);
      if (e.key === "ArrowLeft") stepPhoto(-1);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, photoIndexes, index]);

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

  if (!current) return null;

  const scrollStrip = (dir: number) => {
    stripRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const photoNumber = current.type === "photo" ? photoIndexes.indexOf(index) + 1 : 0;

  return (
    <div className="mt-14" data-package-media>
      <div className="relative aspect-video overflow-hidden bg-black" data-featured={current.type}>
        {current.type === "film" ? (
          <GalleryFilm src={current.src} poster={current.poster} label={name} />
        ) : (
          <button
            type="button"
            onClick={() => {
              if (swiped.current) {
                swiped.current = false;
                return;
              }
              setLightbox(index);
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="h-full w-full"
            aria-label={`Open photo ${photoNumber} of ${photoIndexes.length}`}
          >
            <img src={current.src} alt={`${name} at Yas Marina Circuit`} draggable={false} decoding="async" className="h-full w-full object-cover" />
          </button>
        )}

        {canPage ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/65 to-transparent p-3 pt-10">
            <span className="font-mono text-xs text-white/80">
              {current.type === "film" ? "Film" : `Photo ${pad(photoNumber)}`}
              <span className="text-white/50">
                {" "}
                · {pad(index + 1)} / {pad(count)}
              </span>
            </span>
            <div className="pointer-events-auto flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                className="flex h-11 w-11 items-center justify-center border border-white/30 bg-background/75 font-display text-lg backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                aria-label="Previous"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="flex h-11 w-11 items-center justify-center border border-white/30 bg-background/75 font-display text-lg backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                aria-label="Next"
              >
                →
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {canPage ? (
        <div className="mt-3 flex items-center gap-2">
          {stripOverflow ? (
            <button
              type="button"
              onClick={() => scrollStrip(-1)}
              className="hidden h-[4.5rem] w-10 shrink-0 items-center justify-center border border-border text-lg text-muted-foreground transition-colors hover:border-primary hover:text-foreground md:flex"
              aria-label="Scroll photos back"
            >
              ←
            </button>
          ) : null}
          <div
            ref={stripRef}
            className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain py-1"
          >
            {items.map((item, i) => {
              const src = item.type === "film" ? item.poster : item.src;
              const active = i === index;
              return (
                <button
                  key={`${item.type}-${src}-${i}`}
                  type="button"
                  data-thumb={i}
                  onClick={() => setIndex(i)}
                  className={`relative h-16 w-[5.5rem] shrink-0 snap-start md:h-[4.5rem] md:w-28 ${
                    active ? "outline outline-2 outline-primary outline-offset-2" : "opacity-70 hover:opacity-100"
                  }`}
                  aria-label={item.type === "film" ? `Show ${name} film` : `Show photo ${photoIndexes.indexOf(i) + 1}`}
                  aria-current={active ? "true" : undefined}
                >
                  <span className="absolute inset-0 overflow-hidden">
                    <img src={src} alt="" draggable={false} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    {item.type === "film" ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <PlayMark size="sm" />
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
          {stripOverflow ? (
            <button
              type="button"
              onClick={() => scrollStrip(1)}
              className="hidden h-[4.5rem] w-10 shrink-0 items-center justify-center border border-border text-lg text-muted-foreground transition-colors hover:border-primary hover:text-foreground md:flex"
              aria-label="Scroll photos forward"
            >
              →
            </button>
          ) : null}
        </div>
      ) : null}

      {canPage ? (
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">{pad(photos.length || count)} photos</span>
          <span className="eyebrow text-muted-foreground">Swipe, or tap a photo</span>
        </div>
      ) : null}

      {lightbox !== null && items[lightbox]?.type === "photo" ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photos`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightbox(null);
          }}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
          {photoIndexes.length > 1 ? (
            <button
              type="button"
              onClick={() => stepPhoto(-1)}
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-border bg-background text-xl md:left-6"
              aria-label="Previous photo"
            >
              ←
            </button>
          ) : null}
          <img src={items[lightbox].src} alt={`${name} at Yas Marina Circuit`} className="max-h-[85svh] max-w-[calc(100%-7rem)] object-contain" />
          {photoIndexes.length > 1 ? (
            <button
              type="button"
              onClick={() => stepPhoto(1)}
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-border bg-background text-xl md:right-6"
              aria-label="Next photo"
            >
              →
            </button>
          ) : null}
          <div className="absolute bottom-5 font-mono text-xs text-muted-foreground">
            {pad(photoIndexes.indexOf(lightbox) + 1)} / {pad(photoIndexes.length)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
