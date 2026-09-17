// ------------------------------------------------------------------ //
// Typed content schema. All résumé copy, comments, versions, links,   //
// and deep-dive write-ups are authored here so content can change     //
// without touching components. Validated at build time (validate.ts). //
// ------------------------------------------------------------------ //

export type TabId =
  | "resume"
  | "acsi"
  | "iris"
  | "matchbook"
  | "clinicalhours"
  | "brinks";

export type LinkId =
  | "email"
  | "linkedin"
  | "github"
  | "iris-site"
  | "iris-appstore"
  | "acsi-repo"
  | "acsi-cert"
  | "matchbook-repo"
  | "clinicalhours-site";

// A smart chip / link-preview definition. Thumbnails and favicons are local
// files under /public (no preview fetching at runtime).
export type LinkDef = {
  id: LinkId;
  href: string;
  label: string; // chip text
  title: string; // preview card title
  domain: string; // preview card domain
  favicon: string; // /public path
  thumbnail?: string; // /public path (optional)
  todo?: string; // set when the real URL/asset is still missing
};

// Inline comment anchor: wraps the first occurrence of `phrase` in a bullet.
export type Anchor = { phrase: string; commentId: string };

export type Bullet = {
  id: string;
  text: string;
  addedOn: string; // ISO date this line first appeared (version history)
  anchors?: Anchor[];
};

export type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  dates: string;
  addedOn: string;
};

export type Honor = { id: string; text: string; addedOn: string; anchors?: Anchor[] };

export type ExperienceEntry = {
  id: string;
  org: string;
  role: string;
  location: string;
  dates: string;
  addedOn: string;
  tab?: TabId;
  bullets: Bullet[];
};

export type ProjectEntry = {
  id: string;
  name: string;
  meta: string; // the tech / award line under the title
  addedOn: string;
  tab?: TabId;
  titleChips?: LinkId[];
  bullets: Bullet[];
};

export type SkillGroup = { label: string; items: string[] };

export type ResumeContent = {
  header: {
    name: string;
    location: string;
    contactChips: LinkId[]; // email, linkedin, github
  };
  educationHeading: string;
  education: EducationEntry[];
  honors: Honor[];
  experienceHeading: string;
  experience: ExperienceEntry[];
  projectsHeading: string;
  projects: ProjectEntry[];
  skillsHeading: string;
  skills: SkillGroup[];
};

export type Comment = {
  id: string;
  tab: TabId;
  anchorPhrase: string; // the phrase the card points at (for display + a11y)
  author: string;
  authorColor: string;
  dateLabel: string; // e.g. "Jul 20"
  body: string; // 2-4 sentences
  chips?: LinkId[];
  openTab?: TabId; // deep-dive this comment expands into
};

export type Version = {
  id: string; // ISO date, also the ?version= value
  title: string;
  dateTodo?: boolean; // true when the real date still needs confirming
};

// Deep-dive tab write-up.
export type DeepDiveSection =
  | { kind: "prose"; heading: string; paragraphs: string[] }
  | { kind: "video"; heading: string; videoId: string }
  | { kind: "diagram"; heading: string; diagram: string; caption?: string }
  | { kind: "results"; heading: string; items: { label: string; value: string; note?: string }[] }
  | { kind: "stack"; heading: string; groups: SkillGroup[] }
  | { kind: "links"; heading: string; links: LinkId[] };

export type TabDef = {
  id: TabId;
  label: string;
  route: string;
  // Résumé is the root doc; deep-dive tabs carry a write-up.
  kind: "resume" | "deep-dive";
  addedOn?: string;
  subtitle?: string; // one-line under the title on a deep-dive page
  sections?: DeepDiveSection[];
};

export type VideoDef = {
  id: string;
  src?: string; // /public/videos/*.mp4 (local self-host)
  youtubeId?: string; // click-to-load YouTube facade (nothing external until play)
  poster?: string;
  captions?: string; // /public/videos/*.vtt
  caption: string; // figure caption text
  todo?: string; // set when the real file is still missing
};
