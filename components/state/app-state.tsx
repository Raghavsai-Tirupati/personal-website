"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { isValidVersion } from "@/lib/content";

export type DialogName = "share" | "shortcuts" | "wordcount" | "menusearch" | null;

export type ViewOptions = {
  comments: boolean;
  ruler: boolean;
  tabs: boolean;
  pageless: boolean;
  zoom: number; // percent, 50-200
};

type Toast = { id: number; message: string };

type AppState = {
  view: ViewOptions;
  setView: (patch: Partial<ViewOptions>) => void;
  toggleView: (key: keyof ViewOptions) => void;

  version: string | null;
  setVersion: (id: string | null) => void;

  versionOpen: boolean;
  openVersionHistory: () => void;
  closeVersionHistory: () => void;

  activeComment: string | null;
  openComment: (id: string) => void;
  closeComment: () => void;
  hoverComment: string | null;
  setHoverComment: (id: string | null) => void;

  dialog: DialogName;
  openDialog: (name: Exclude<DialogName, null>) => void;
  closeDialog: () => void;

  findOpen: boolean;
  setFindOpen: (open: boolean) => void;

  navOpen: boolean;
  setNavOpen: (open: boolean) => void;

  starred: boolean;
  toggleStar: () => void;

  toasts: Toast[];
  pushToast: (message: string) => void;

  // Bumped whenever layout-affecting state changes, so panels recompute
  // anchor positions.
  layoutNonce: number;
  bumpLayout: () => void;
};

const Ctx = createContext<AppState | null>(null);

const DEFAULT_VIEW: ViewOptions = {
  comments: true,
  ruler: true,
  tabs: true,
  pageless: false,
  zoom: 100,
};

// Read initial view/version/comment from the URL (deep-link support).
function readUrl(): { view: Partial<ViewOptions>; version: string | null; comment: string | null } {
  if (typeof window === "undefined") return { view: {}, version: null, comment: null };
  const p = new URLSearchParams(window.location.search);
  const view: Partial<ViewOptions> = {};
  if (p.get("comments") === "0") view.comments = false;
  if (p.get("pageless") === "1") view.pageless = true;
  const zoom = Number(p.get("zoom"));
  if (zoom >= 50 && zoom <= 200) view.zoom = zoom;
  const version = p.get("version");
  const hash = window.location.hash.replace(/^#comment-/, "");
  return {
    view,
    version: isValidVersion(version) ? version : null,
    comment: hash && window.location.hash.startsWith("#comment-") ? hash : null,
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<ViewOptions>(DEFAULT_VIEW);
  const [version, setVersionState] = useState<string | null>(null);
  const [versionOpen, setVersionOpen] = useState(false);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [hoverComment, setHoverComment] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogName>(null);
  const [findOpen, setFindOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [starred, setStarred] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [layoutNonce, setLayoutNonce] = useState(0);
  const toastId = useRef(0);

  // Hydrate from URL once on mount.
  useEffect(() => {
    const { view: v, version: ver, comment } = readUrl();
    if (Object.keys(v).length) setViewState((s) => ({ ...s, ...v }));
    if (ver) {
      setVersionState(ver);
      setVersionOpen(true);
    }
    if (comment) {
      setActiveComment(comment);
      setViewState((s) => ({ ...s, comments: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect key state into the URL without a navigation/scroll.
  const syncUrl = useCallback(
    (next: { view?: ViewOptions; version?: string | null; comment?: string | null }) => {
      if (typeof window === "undefined") return;
      const p = new URLSearchParams(window.location.search);
      const v = next.view ?? view;
      v.comments ? p.delete("comments") : p.set("comments", "0");
      v.pageless ? p.set("pageless", "1") : p.delete("pageless");
      v.zoom !== 100 ? p.set("zoom", String(v.zoom)) : p.delete("zoom");
      const ver = next.version === undefined ? version : next.version;
      ver ? p.set("version", ver) : p.delete("version");
      const qs = p.toString();
      const comment = next.comment === undefined ? activeComment : next.comment;
      const hash = comment ? `#comment-${comment}` : "";
      const url = window.location.pathname + (qs ? `?${qs}` : "") + hash;
      window.history.replaceState(window.history.state, "", url);
    },
    [view, version, activeComment],
  );

  const bumpLayout = useCallback(() => setLayoutNonce((n) => n + 1), []);

  const setView = useCallback(
    (patch: Partial<ViewOptions>) => {
      setViewState((s) => {
        const next = { ...s, ...patch };
        syncUrl({ view: next });
        return next;
      });
      bumpLayout();
    },
    [syncUrl, bumpLayout],
  );

  const toggleView = useCallback((key: keyof ViewOptions) => {
    setViewState((s) => {
      const next = { ...s, [key]: !s[key] } as ViewOptions;
      return next;
    });
    bumpLayout();
    // sync after state settles
    setTimeout(() => syncUrl({}), 0);
  }, [syncUrl, bumpLayout]);

  const setVersion = useCallback(
    (id: string | null) => {
      setVersionState(id);
      setActiveComment(null);
      syncUrl({ version: id, comment: null });
      bumpLayout();
    },
    [syncUrl, bumpLayout],
  );

  const openVersionHistory = useCallback(() => {
    setVersionOpen(true);
    setActiveComment(null);
  }, []);

  const closeVersionHistory = useCallback(() => {
    setVersionOpen(false);
    setVersionState(null);
    syncUrl({ version: null });
    bumpLayout();
  }, [syncUrl, bumpLayout]);

  const openComment = useCallback(
    (id: string) => {
      setActiveComment(id);
      setViewState((s) => (s.comments ? s : { ...s, comments: true }));
      syncUrl({ comment: id });
      bumpLayout();
    },
    [syncUrl, bumpLayout],
  );

  const closeComment = useCallback(() => {
    setActiveComment(null);
    syncUrl({ comment: null });
  }, [syncUrl]);

  const openDialog = useCallback((name: Exclude<DialogName, null>) => setDialog(name), []);
  const closeDialog = useCallback(() => setDialog(null), []);

  const toggleStar = useCallback(() => {
    setStarred((s) => {
      const next = !s;
      toastId.current += 1;
      const id = toastId.current;
      setToasts((t) => [...t, { id, message: next ? "Added to Starred" : "Removed from Starred" }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
      return next;
    });
  }, []);

  const pushToast = useCallback((message: string) => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      view,
      setView,
      toggleView,
      version,
      setVersion,
      versionOpen,
      openVersionHistory,
      closeVersionHistory,
      activeComment,
      openComment,
      closeComment,
      hoverComment,
      setHoverComment,
      dialog,
      openDialog,
      closeDialog,
      findOpen,
      setFindOpen,
      navOpen,
      setNavOpen,
      starred,
      toggleStar,
      toasts,
      pushToast,
      layoutNonce,
      bumpLayout,
    }),
    [
      view, setView, toggleView, version, setVersion, versionOpen, openVersionHistory,
      closeVersionHistory, activeComment, openComment, closeComment, hoverComment, dialog,
      openDialog, closeDialog, findOpen, navOpen, starred, toggleStar, toasts, pushToast,
      layoutNonce, bumpLayout,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}
