import type { VideoDef } from "./types";

// Demo videos are self-hosted under /public/videos. Until the real files are
// added, each renders a poster + "video not added yet" state (never a broken
// embed). Drop <id>.mp4 (+ optional <id>.vtt captions, <id>.jpg poster) in
// /public/videos and remove the `todo` field.
export const VIDEOS: Record<string, VideoDef> = {
  acsi: {
    id: "acsi",
    youtubeId: "HgDNgyU3NDg",
    poster: "/videos/acsi-poster.jpg",
    caption: "Live acsi run producing a BLOCK verdict on a model swap.",
  },
  iris: {
    id: "iris",
    youtubeId: "DoDzbtPZosc",
    poster: "/videos/iris-poster.jpg",
    caption: "Iris narrating a live camera scene and reading text aloud.",
  },
  matchbook: {
    id: "matchbook",
    caption: "Matchbook matching buy and sell orders over the API.",
    todo: "Matchbook demo video file not supplied.",
  },
  clinicalhours: {
    id: "clinicalhours",
    youtubeId: "s1hLXv7_OlQ",
    poster: "/videos/clinicalhours-poster.jpg",
    caption: "ClinicalHours search and volunteer onboarding flow.",
  },
};
