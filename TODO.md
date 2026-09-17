# Outstanding content, assets, and things to confirm

Nothing here blocks the site from running. Each item degrades gracefully (placeholder or
"not added yet" state) until you supply it. The build prints this same list every time.

## Confirm with me (used, but flagged)

Version-history dates — I placed best-guess dates so the timeline sorts and renders; confirm
the real ones in `lib/content/versions.ts` (each is marked `dateTodo: true`, shown as
"date TBD" in the panel):

- Started at Texas A&M — using **2025-08-18**
- Founded ClinicalHours — using **2025-10-01**
- Best Use of Gemini API at TidalHack — using **2025-10-25**
- Won 1st place at Hook 'Em Hacks with Iris — using **2025-11-08**
- Built Matchbook Trade Engine — using **2026-01-15**
- Joined Brinks Home — using **2026-05-18**
- Continued at Brinks part-time — using **2026-08-25**

(ACSI first commit **2026-07-16** and first certificate **2026-07-20** are your exact dates.)

Deep-dive copy to verify before publishing (drawn only from your brief, but you flagged these):

- **ACSI** deep-dive page — "verify with me before publishing."
- **Iris** deep-dive figures — "built solo in 24h", "1st of 250 teams", "Patient Centered track."

## URLs not supplied (chips show, link is a "not added yet" state)

- **ClinicalHours** live site URL → `lib/content/links.ts` `clinicalhours-site`. (Your LaTeX
  résumé does not link ClinicalHours, so this is the only remaining missing link.)

Wired from your LaTeX résumé: **Iris App Store**
`apps.apple.com/us/app/iris-sight/id6762914469`, **Matchbook repo**
`github.com/Raghavsai-Tirupati/trading-engine`. Already had: `iris.how`, GitHub profile,
`acsi-engine` repo, `acsi.dev/cert/opus-4-1-to-sonnet-5`, LinkedIn, email.

## Changed to match the LaTeX résumé

- Graduation updated **Expected May 2028 → May 2029** (per your LaTeX). Confirm if wrong.
- GPA (3.83), phone number, and the Nutrition research role are in the LaTeX but stay
  **excluded** here per the original brief. Say the word if you want any of them added.

## Assets to add

- **Résumé PDF** — web version with no GPA, no phone, no research at `public/resume.pdf`, then
  set `RESUME_PDF_READY = true` in `lib/config.ts`.
- **Demo videos** — `public/videos/{acsi,iris,matchbook,clinicalhours}.mp4` (+ optional
  `.webm`, poster `.jpg`, captions `.vtt`); update `lib/content/videos.ts`.
- **Link-preview thumbnails** — the images in `public/link/thumb-*.svg` are generated
  placeholders; swap for real screenshots (iris.how, the acsi repo, the acsi.dev certificate).
  Favicons in `public/link/favicon-*.svg` are simple monogram tiles; replace if you want the
  real brand marks.
- **Headshot (optional)** — `public/avatar.jpg` for the presence avatar; today it's the "RT"
  monogram.

## Excluded on purpose (per the brief)

GPA, phone number, and the Texas A&M Nutrition research role are omitted everywhere. Do not
add them.
