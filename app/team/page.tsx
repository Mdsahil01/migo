import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";
import {
  TeamMembersWorkspace,
  type TeamMember,
} from "@/components/team/team-members-workspace";
import { mockHackathonEvents } from "@/data/mock-events";

export const metadata: Metadata = {
  title: "Team — MIGO",
  description:
    "Meet the MIGO core team, track current mission focus, and review delivery stats.",
};

const teamMembers: TeamMember[] = [
  {
    name: "Aarav Sharma",
    role: "Product Lead",
    responsibility: "Pitch Deck",
    skills: ["Roadmapping", "Hackathon Ops", "User Research"],
    githubUsername: "aaravbuilds",
    participationCount: 12,
  },
  {
    name: "Meera Nair",
    role: "Frontend Engineer",
    responsibility: "Frontend Development",
    skills: ["React", "Tailwind CSS", "Design Systems"],
    githubUsername: "meeracodes",
    participationCount: 9,
  },
  {
    name: "Rohan Iqbal",
    role: "Backend Engineer",
    responsibility: "Backend APIs",
    skills: ["Node.js", "APIs", "PostgreSQL"],
    githubUsername: "rohanapi",
    participationCount: 10,
  },
  {
    name: "Nisha Patel",
    role: "Developer Advocate",
    responsibility: "Event Research",
    skills: ["Community", "Mentorship", "Event Hosting"],
    githubUsername: "nishadevrel",
    participationCount: 8,
  },
  {
    name: "Kabir Joshi",
    role: "Full-Stack Engineer",
    responsibility: "Deployment",
    skills: ["TypeScript", "Testing", "Performance"],
    githubUsername: "kabirstack",
    participationCount: 11,
  },
  {
    name: "Sana Rahman",
    role: "Design Engineer",
    responsibility: "UI/UX",
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

        <TeamMembersWorkspace
          initialMembers={teamMembers}
          approvedMissionsCount={approvedEvents.length}
          upcomingMissionsCount={upcomingApprovedEvents.length}
        />

      </main>

      <SiteFooter />
    </div>
  );
}
