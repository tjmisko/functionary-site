/**
 * The published release, read by the Download page.
 *
 * Until a release exists, `version` is null and every build's `url` is null;
 * the page then states that builds will be posted and offers no link. To
 * publish: set `version` and `date`, fill each build's `url` and `sha256`,
 * and set `licenseName` / `licenseUrl`. Nothing else on the page changes.
 */

export interface Build {
  os: "Linux" | "macOS" | "Windows";
  arch: "x86_64" | "aarch64";
  url: string | null;
  sha256: string | null;
}

export interface Release {
  version: string | null;
  /** ISO date, e.g. "2027-01-15". */
  date: string | null;
  notesUrl: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  builds: Build[];
}

export const release: Release = {
  version: null,
  date: null,
  notesUrl: null,
  licenseName: null,
  licenseUrl: null,
  builds: [
    { os: "Linux", arch: "x86_64", url: null, sha256: null },
    { os: "Linux", arch: "aarch64", url: null, sha256: null },
    { os: "macOS", arch: "aarch64", url: null, sha256: null },
    { os: "macOS", arch: "x86_64", url: null, sha256: null },
    { os: "Windows", arch: "x86_64", url: null, sha256: null },
    { os: "Windows", arch: "aarch64", url: null, sha256: null },
  ],
};

export const isReleased = release.version !== null;
