export * from "./types";
export { RESUME } from "./resume";
export { LINKS, getLink } from "./links";
export { COMMENTS, COMMENTS_BY_ID, commentsForTab } from "./comments";
export { VERSIONS, BASELINE_DATE, isValidVersion } from "./versions";
export { TABS, TABS_BY_ID, DEEP_DIVE_TABS } from "./tabs";
export { VIDEOS } from "./videos";
export { validateContent, type TodoItem } from "./validate";

// Version-history visibility helpers. Dates are ISO (YYYY-MM-DD) so string
// comparison is chronological. `selected === null` means the current version.
export function visibleAt(addedOn: string, selected: string | null): boolean {
  return selected === null ? true : addedOn <= selected;
}

export function addedIn(addedOn: string, selected: string | null): boolean {
  return selected === null ? false : addedOn === selected;
}
