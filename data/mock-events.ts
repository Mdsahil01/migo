export type RegistrationStatus =
  | "Open"
  | "Closing soon"
  | "Waitlist"
  | "Closed"
  | "Early bird";

export type HackathonEvent = {
  id: string;
  title: string;
  organizer: string;
  description: string;
  date: string;
  /** ISO 8601 timestamps for calendar export */
  startsAtIso: string;
  endsAtIso: string;
  location: string;
  teamSize: string;
  theme: string;
  rules: string[];
  registrationStatus: RegistrationStatus;
};

export const mockHackathonEvents: HackathonEvent[] = [
  {
    id: "1",
    title: "Campus Code Sprint 2026",
    organizer: "IEEE Student Branch",
    description:
      "A fast-paced weekend build focused on climate dashboards, civic APIs, and tools students can ship in 36 hours. Mentors from local startups drop in for office hours, and teams pitch to a panel for seed funding for the best prototype.",
    date: "Jun 14–15, 2026",
    startsAtIso: "2026-06-14T13:00:00.000Z",
    endsAtIso: "2026-06-15T22:00:00.000Z",
    location: "Engineering Hall, Room 201",
    teamSize: "3–5 hackers",
    theme: "Climate & civic tech",
    rules: [
      "All code must be written during the event (libraries and APIs allowed).",
      "Teams present a live demo plus a public repo or deck link.",
      "Use of pre-built templates is fine; copying full past projects is not.",
      "Respect the code of conduct—be kind, inclusive, and ask before recording.",
    ],
    registrationStatus: "Open",
  },
  {
    id: "2",
    title: "Midnight Buildathon",
    organizer: "CS Society",
    description:
      "24 hours straight: ideation, pair programming, and midnight pizza. Build productivity tools or playful AI assistants. Sleep breaks are encouraged—track your energy, not bravado.",
    date: "Jul 4–5, 2026",
    startsAtIso: "2026-07-04T17:00:00.000Z",
    endsAtIso: "2026-07-05T17:00:00.000Z",
    location: "Innovation Lab (24h)",
    teamSize: "2–4 hackers",
    theme: "Productivity & AI assistants",
    rules: [
      "Check in with your team lead every 6 hours for safety and sync.",
      "External AI tools are allowed; disclose what you used in your README.",
      "No crypto-mining or resource-heavy jobs without lab approval.",
      "Judging rewards polish, clarity, and responsible use of data.",
    ],
    registrationStatus: "Early bird",
  },
  {
    id: "3",
    title: "HealthHack Weekend",
    organizer: "MedTech Club × Biodesign",
    description:
      "Interdisciplinary teams tackle digital health equity: access, language, and simple UX for patients and caregivers. Clinicians join as advisors; you leave with a prototype and user story map.",
    date: "Aug 9–10, 2026",
    startsAtIso: "2026-08-09T14:00:00.000Z",
    endsAtIso: "2026-08-10T21:00:00.000Z",
    location: "Biomedical Center, Atrium",
    teamSize: "4–6 hackers",
    theme: "Digital health equity",
    rules: [
      "No real patient data—use synthetic sets or public datasets only.",
      "If your idea touches diagnosis or treatment, include a non-clinical disclaimer.",
      "Teams must have at least one member outside pure CS (design, pre-med, etc.).",
      "Present problem, user, and ethical considerations in your final pitch.",
    ],
    registrationStatus: "Waitlist",
  },
  {
    id: "4",
    title: "FinFusion Challenge",
    organizer: "Fintech Guild",
    description:
      "Hybrid hackathon across NYC and remote squads. Design inclusive payment flows, savings nudges, or small-business tools. Sponsors offer API credits and design critique sessions.",
    date: "Sep 20–21, 2026",
    startsAtIso: "2026-09-20T15:00:00.000Z",
    endsAtIso: "2026-09-21T23:59:00.000Z",
    location: "Hybrid · NYC + online",
    teamSize: "3–5 hackers",
    theme: "Payments & inclusion",
    rules: [
      "Hybrid teams must keep a shared changelog and demo link.",
      "Do not scrape or store regulated financial data from real accounts.",
      "Use sandbox APIs only unless a sponsor clears live access in writing.",
      "Remote participants must join the opening ceremony and final demo block.",
    ],
    registrationStatus: "Closing soon",
  },
  {
    id: "5",
    title: "Game Jam Lite",
    organizer: "GDC Student Chapter",
    description:
      "Short, playful, retro-inspired builds. Solo or duo only—perfect if you’re new to game jams. We supply art packs and SFX kits so you can focus on mechanics and vibes.",
    date: "Oct 3–4, 2026",
    startsAtIso: "2026-10-03T15:00:00.000Z",
    endsAtIso: "2026-10-04T20:00:00.000Z",
    location: "Media Lab Studio B",
    teamSize: "Solo or duo",
    theme: "Retro revival",
    rules: [
      "Scope for a playable loop in two days—judges prefer fun over graphics.",
      "Use only assets you own, are licensed for, or from the official jam kit.",
      "Web, desktop, or mobile builds are welcome; browser builds preferred.",
      "Keep content PG-13 and list any flashing effects in your itch page notes.",
    ],
    registrationStatus: "Open",
  },
  {
    id: "6",
    title: "Winter Prototype Rally",
    organizer: "Design + Make Collective",
    description:
      "Bridge hardware and software: microcontrollers meet React dashboards, sensor data, and quick industrial design mocks. Bring your laptop; basic toolkits are available on site.",
    date: "Dec 6–7, 2026",
    startsAtIso: "2026-12-06T14:00:00.000Z",
    endsAtIso: "2026-12-07T22:00:00.000Z",
    location: "Makerspace Downtown",
    teamSize: "3–4 hackers",
    theme: "Hardware meets software",
    rules: [
      "Power tools require a safety briefing on Saturday morning—no exceptions.",
      "Label your hardware; the makerspace is not liable for lost parts.",
      "Document wiring and pinouts for anything you connect to shared equipment.",
      "Demos should include a fallback video if live hardware glitches.",
    ],
    registrationStatus: "Closed",
  },
];

export function getHackathonEventById(id: string): HackathonEvent | undefined {
  return mockHackathonEvents.find((event) => event.id === id);
}
