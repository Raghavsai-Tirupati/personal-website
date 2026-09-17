"use client";

import { useState } from "react";
import { VIDEOS } from "@/lib/content";
import { Icon } from "@/components/icon";

// Self-hosted video with a poster facade: nothing loads until the visitor
// clicks play, never autoplays with sound, and ships a captions track. When
// the real file is missing it shows a clear "not added yet" state.
export function VideoFigure({ videoId }: { videoId: string }) {
  const v = VIDEOS[videoId];
  const [playing, setPlaying] = useState(false);
  if (!v) return null;

  const missing = !v.youtubeId && !v.src && !!v.todo;

  return (
    <figure className="my-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-[10px] border border-line bg-[#0b1220]">
        {v.youtubeId && playing ? (
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`}
            title={v.caption}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : missing ? (
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#1f2937,#0f172a)] text-center">
            <div className="flex flex-col items-center gap-2 px-6">
              <span className="grid size-14 place-items-center rounded-full bg-white/10 text-white/70">
                <Icon name="play_arrow" size={30} />
              </span>
              <span className="text-[13px] font-medium text-white/85">Demo video not added yet</span>
              <span className="text-[12px] text-white/50">{v.caption}</span>
            </div>
          </div>
        ) : playing ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className="size-full"
            controls
            autoPlay
            playsInline
            poster={v.poster}
            preload="metadata"
          >
            <source src={v.src} />
            {v.captions && <track kind="captions" src={v.captions} srcLang="en" label="English" default />}
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play demo: ${v.caption}`}
            className="group absolute inset-0 grid place-items-center"
            style={v.poster ? { backgroundImage: `url(${v.poster})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            <span className="grid size-16 place-items-center rounded-full bg-black/55 text-white transition-transform group-hover:scale-105 group-active:scale-95">
              <Icon name="play_arrow" size={34} />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-[13px] text-ink-mute">{v.caption}</figcaption>
    </figure>
  );
}
