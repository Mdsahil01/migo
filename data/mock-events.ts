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
  date: string;
  location: string;
  teamSize: string;
  theme: string;
  registrationStatus: RegistrationStatus;
};

export const mockHackathonEvents: HackathonEvent[] = [
  {
    id: "1",
    title: "Campus Code Sprint 2026",
    organizer: "IEEE Student Branch",
    date: "Jun 14–15, 2026",
    location: "Engineering Hall, Room 201",
    teamSize: "3–5 hackers",
    theme: "Climate & civic tech",
    registrationStatus: "Open",
  },
  {
    id: "2",
    title: "Midnight Buildathon",
    organizer: "CS Society",
    date: "Jul 4–5, 2026",
    location: "Innovation Lab (24h)",
    teamSize: "2–4 hackers",
    theme: "Productivity & AI assistants",
    registrationStatus: "Early bird",
  },
  {
    id: "3",
    title: "HealthHack Weekend",
    organizer: "MedTech Club × Biodesign",
    date: "Aug 9–10, 2026",
    location: "Biomedical Center, Atrium",
    teamSize: "4–6 hackers",
    theme: "Digital health equity",
    registrationStatus: "Waitlist",
  },
  {
    id: "4",
    title: "FinFusion Challenge",
    organizer: "Fintech Guild",
    date: "Sep 20–21, 2026",
    location: "Hybrid · NYC + online",
    teamSize: "3–5 hackers",
    theme: "Payments & inclusion",
    registrationStatus: "Closing soon",
  },
  {
    id: "5",
    title: "Game Jam Lite",
    organizer: "GDC Student Chapter",
    date: "Oct 3–4, 2026",
    location: "Media Lab Studio B",
    teamSize: "Solo or duo",
    theme: "Retro revival",
    registrationStatus: "Open",
  },
  {
    id: "6",
    title: "Winter Prototype Rally",
    organizer: "Design + Make Collective",
    date: "Dec 6–7, 2026",
    location: "Makerspace Downtown",
    teamSize: "3–4 hackers",
    theme: "Hardware meets software",
    registrationStatus: "Closed",
  },
];
