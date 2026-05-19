const SUMMARY_MAX_LENGTH = 350;

type CleanOptions = {
  preserveBreaks?: boolean;
};

/** Strip noisy scraped patterns while keeping text readable. */
export function cleanScrapedContent(
  text: string,
  options: CleanOptions = {},
): string {
  const { preserveBreaks = false } =
    options;

  let cleaned = text
    .replace(/&#013;/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(
      /\[([^\]]+)\]\([^)]+\)/g,
      "$1",
    )
    .replace(/\*\*/g, "")
    .replace(/__+/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(
      /(?:https?:\/\/|www\.)\S+/gi,
      "",
    )
    .replace(
      /(?:^|\s)#\w+/g,
      " ",
    )
    .replace(
      /\s{2,}/g,
      " ",
    );

  const lines = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const unique = lines.filter(
    (line) => {
      const key = line
        .toLowerCase()
        .replace(/\s+/g, " ");

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    },
  );

  if (preserveBreaks) {
    return unique
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return unique.join(" ").trim();
}

export function truncateOperationalSummary(
  text: string,
  maxLength = SUMMARY_MAX_LENGTH,
): string {
  const normalized = text
    .replace(/\s+/g, " ")
    .trim();

  if (
    normalized.length <= maxLength
  ) {
    return normalized;
  }

  const slice = normalized.slice(
    0,
    maxLength,
  );
  const lastSpace =
    slice.lastIndexOf(" ");

  const cut =
    lastSpace > maxLength * 0.6
      ? slice.slice(0, lastSpace)
      : slice;

  return `${cut.trim()}…`;
}

export function collapseForComparison(
  text: string,
): string {
  return cleanScrapedContent(text)
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
