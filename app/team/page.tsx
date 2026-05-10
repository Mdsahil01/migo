import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import { mockHackathonEvents } from "@/data/mock-events";

export const metadata: Metadata = {
  title: "Team — MIGO",
  description:
    "Meet the MIGO core team, track current mission focus, and review delivery stats.",
};

type TeamMember = {
  name: string;
  role: string;
  skills: string[];
  githubUsername: string;
  participationCount: number;
};

const teamMembers: TeamMember[] = [
  {
    name: "Aarav Sharma",
    role: "Product Lead",
    skills: ["Roadmapping", "Hackathon Ops", "User Research"],
    githubUsername: "aaravbuilds",
    participationCount: 12,
  },
  {
    name: "Meera Nair",
    role: "Frontend Engineer",
    skills: ["React", "Tailwind CSS", "Design Systems"],
    githubUsername: "meeracodes",
    participationCount: 9,
  },
  {
    name: "Rohan Iqbal",
    role: "Backend Engineer",
    skills: ["Node.js", "APIs", "PostgreSQL"],
    githubUsername: "rohanapi",
    participationCount: 10,
  },
  {
    name: "Nisha Patel",
    role: "Developer Advocate",
    skills: ["Community", "Mentorship", "Event Hosting"],
    githubUsername: "nishadevrel",
    participationCount: 8,
  },
  {
    name: "Kabir Joshi",
    role: "Full-Stack Engineer",
    skills: ["TypeScript", "Testing", "Performance"],
    githubUsername: "kabirstack",
    participationCount: 11,
  },
  {
    name: "Sana Rahman",
    role: "Design Engineer",
    skills: ["UX", "Prototyping", "Accessibility"],
    githubUsername: "sanaui",
    participationCount: 7,
  },
];

const approvedEventIds = new Set(["1", "2", "4", "5"]);
const now = new Date();

const approvedEvents = mockHackathonEvents.filter((event) =>
  approvedEventIds.has(event.id),
);

const upcomingApprovedEvents = approvedEvents
  .filter((event) => new Date(event.startsAtIso).getTime() > now.getTime())
  .sort(
    (a, b) =>
      new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime(),
  );

const currentMission = upcomingApprovedEvents[0];

const totalParticipations = teamMembers.reduce(
  (sum, member) => sum + member.participationCount,
  0,
);

const averageParticipations = Math.round(totalParticipations / teamMembers.length);

const teamStats = [
  { label: "Core team", value: teamMembers.length.toString() },
  { label: "Approved missions", value: approvedEvents.length.toString() },
  { label: "Upcoming missions", value: upcomingApprovedEvents.length.toString() },
  { label: "Avg participation", value: `${averageParticipations} events` },
] as const;

function TeamStatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-lg shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {value}
      </p>
    </article>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <Navbar />

      <main>
        <section
          className="relative overflow-hidden border-b border-zinc-800/80 px-4 py-12 sm:px-6 sm:py-16"
          aria-labelledby="team-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400/90">
              Team overview
            </p>
            <h1
              id="team-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              The builders behind MIGO
            </h1>
            <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
              A lean student team shipping event operations, collaboration tools,
              and mission support for every hackathon cycle.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14" aria-label="Team statistics">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {teamStats.map((stat) => (
                <TeamStatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 sm:pb-10" aria-labelledby="current-mission">
          <div className="mx-auto max-w-6xl">
            <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/55 shadow-xl shadow-black/30">
              <div className="bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent px-6 py-6 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Current mission
                </p>
                <h2
                  id="current-mission"
                  className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  {currentMission?.title ?? "No approved mission scheduled"}
                </h2>
              </div>
              <div className="px-6 py-6 sm:px-8">
                {currentMission ? (
                  <>
                    <p className="text-zinc-300">{currentMission.description}</p>
                    <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
                        <dt className="text-xs uppercase tracking-wider text-zinc-500">
                          Date
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-zinc-100">
                          {currentMission.date}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
                        <dt className="text-xs uppercase tracking-wider text-zinc-500">
                          Theme
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-zinc-100">
                          {currentMission.theme}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 py-3">
                        <dt className="text-xs uppercase tracking-wider text-zinc-500">
                          Team size
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-zinc-100">
                          {currentMission.teamSize}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={`/events/${currentMission.id}`}
                      className="mt-6 inline-flex rounded-lg border border-zinc-700 bg-zinc-950/40 px-4 py-2.5 text-sm font-semibold text-zinc-100 outline-none transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                    >
                      Open mission details
                    </Link>
                  </>
                ) : (
                  <p className="text-zinc-400">
                    Approve an upcoming event to highlight the next mission here.
                  </p>
                )}
              </div>
            </article>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 sm:pb-16" aria-labelledby="team-members">
          <div className="mx-auto max-w-6xl">
            <h2
              id="team-members"
              className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              Team members
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Core contributors driving approvals, product quality, and student
              experience across every release.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {teamMembers.map((member) => (
                <article
                  key={member.githubUsername}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-5 shadow-lg shadow-black/20 transition hover:border-emerald-500/25 hover:bg-zinc-900/70"
                >
                  <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-emerald-300">{member.role}</p>

                  <dl className="mt-5 grid gap-3 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-zinc-500">GitHub</dt>
                      <dd className="font-medium text-zinc-200">
                        @{member.githubUsername}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-24 shrink-0 text-zinc-500">Participation</dt>
                      <dd className="font-medium text-zinc-200">
                        {member.participationCount} events
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs font-medium text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
