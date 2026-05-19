import type { EventIntelligenceInsert } from "@/lib/events/types";

/** Minimum score (0–100) to ingest into MIGO pipeline. */
export const MIN_RELEVANCE_SCORE = 40;

const BANGALORE_TERMS = [
  "bangalore",
  "bengaluru",
  "koramangala",
  "whitefield",
  "electronic city",
  "indiranagar",
  "hsr layout",
  "marathahalli",
  "hebbal",
  "yelahanka",
];

const KARNATAKA_TERMS = [
  "karnataka",
  "mysuru",
  "mysore",
  "mangaluru",
  "hubballi",
  "manipal",
];

const HACKATHON_TERMS = [
  "hackathon",
  "hack ",
  "hack-",
  "buildathon",
  "ideathon",
  "datathon",
  "code sprint",
  "codesprint",
  "innovation challenge",
  "coding challenge",
];

const TECH_TERMS = [
  "ai",
  "artificial intelligence",
  "machine learning",
  "ml",
  "startup",
  "developer",
  "dev ",
  "software",
  "web3",
  "blockchain",
  "cloud",
  "devops",
  "product",
  "engineering",
  "genai",
  "llm",
  "open source",
  "tech ",
  "builder",
];

const STUDENT_TERMS = [
  "student",
  "campus",
  "college",
  "university",
  "undergrad",
  "freshers",
];

const SPAM_TERMS = [
  "quiz",
  "aptitude test",
  "mock test",
  "scholarship test",
  "refer and earn",
  "instagram follower",
  "giveaway only",
  "paid webinar",
  "job fair only",
  "recruitment drive only",
];

export type RelevanceResult = {
  score: number;
  reasons: string[];
  passes: boolean;
};

function containsAny(
  blob: string,
  terms: string[],
): boolean {
  return terms.some((term) =>
    blob.includes(term),
  );
}

function scoreBangalore(
  blob: string,
): { points: number; reason?: string } {
  if (containsAny(blob, BANGALORE_TERMS)) {
    return {
      points: 30,
      reason: "Bangalore / Bengaluru",
    };
  }

  if (containsAny(blob, KARNATAKA_TERMS)) {
    return {
      points: 18,
      reason: "Karnataka region",
    };
  }

  return { points: 0 };
}

function scoreHackathonSignal(
  blob: string,
): { points: number; reason?: string } {
  if (containsAny(blob, HACKATHON_TERMS)) {
    return {
      points: 22,
      reason: "Hackathon signal",
    };
  }

  return { points: 0 };
}

function scoreTechRelevance(
  blob: string,
): { points: number; reason?: string } {
  if (containsAny(blob, TECH_TERMS)) {
    return {
      points: 18,
      reason: "AI / startup / dev focus",
    };
  }

  return { points: 0 };
}

function scoreStudentFriendly(
  blob: string,
): { points: number; reason?: string } {
  if (containsAny(blob, STUDENT_TERMS)) {
    return {
      points: 8,
      reason: "Student-friendly",
    };
  }

  return { points: 0 };
}

function scoreOnlineIndiaTech(
  event: EventIntelligenceInsert,
  blob: string,
): { points: number; reason?: string } {
  if (event.mode !== "online") {
    return { points: 0 };
  }

  const indiaSignal =
    /\b(india|indian|students?)\b/.test(
      blob,
    );
  const techSignal = containsAny(
    blob,
    TECH_TERMS,
  );

  if (indiaSignal && techSignal) {
    return {
      points: 14,
      reason:
        "Online + India tech relevance",
    };
  }

  if (techSignal) {
    return {
      points: 8,
      reason: "Online tech event",
    };
  }

  return { points: 0 };
}

function scoreOrganizerCredibility(
  event: EventIntelligenceInsert,
): { points: number; reason?: string } {
  if (event.organizer_type === "college") {
    return {
      points: 6,
      reason: "Campus organizer",
    };
  }

  if (
    event.organizer_type === "startup" ||
    event.organizer_type === "company"
  ) {
    return {
      points: 4,
      reason: "Organizer credibility",
    };
  }

  return { points: 0 };
}

function scoreSpamPenalty(
  blob: string,
  title: string,
): { points: number; reason?: string } {
  let penalty = 0;
  const reasons: string[] = [];

  if (containsAny(blob, SPAM_TERMS)) {
    penalty += 25;
    reasons.push("Low-quality / spam signal");
  }

  const titleLower = title.toLowerCase();

  if (
    titleLower.includes("quiz") &&
    !containsAny(blob, HACKATHON_TERMS)
  ) {
    penalty += 30;
    reasons.push("Quiz-only competition");
  }

  if (
    titleLower.length < 8 &&
    !containsAny(blob, HACKATHON_TERMS)
  ) {
    penalty += 15;
    reasons.push("Weak title signal");
  }

  if (penalty === 0) {
    return { points: 0 };
  }

  return {
    points: -penalty,
    reason: reasons.join("; "),
  };
}

export function scoreEventRelevance(
  event: EventIntelligenceInsert,
): RelevanceResult {
  const blob = [
    event.title,
    event.short_description,
    event.full_description,
    event.location,
    event.organizer_name,
    event.organizer_type,
    event.source_platform,
    ...event.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const reasons: string[] = [];
  let score = 0;

  const factors = [
    scoreBangalore(blob),
    scoreHackathonSignal(blob),
    scoreTechRelevance(blob),
    scoreStudentFriendly(blob),
    scoreOnlineIndiaTech(
      event,
      blob,
    ),
    scoreOrganizerCredibility(event),
    scoreSpamPenalty(
      blob,
      event.title,
    ),
  ];

  for (const factor of factors) {
    score += factor.points;

    if (factor.reason && factor.points !== 0) {
      reasons.push(
        `${factor.points > 0 ? "+" : ""}${factor.points} ${factor.reason}`,
      );
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    reasons,
    passes: score >= MIN_RELEVANCE_SCORE,
  };
}

export function passesBangaloreNetworkFilter(
  event: EventIntelligenceInsert,
): boolean {
  return scoreEventRelevance(event).passes;
}
