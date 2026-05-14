import type { Metadata } from "next";
import Link from "next/link";

import { Navbar } from "@/components/home/navbar";
import { SiteFooter } from "@/components/home/site-footer";

import {
  TeamMembersWorkspace,
  type TeamMember,
} from "@/components/team/team-members-workspace";

import { mockHackathonEvents } from "@/data/mock-events";

import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Team — MIGO",
  description:
    "Meet the core team operating MIGO and coordinating active missions.",
};

const approvedEventIds = new Set([
  "1",
  "2",
  "4",
  "5",
]);

const now = new Date();

const approvedEvents =
  mockHackathonEvents.filter((event) =>
    approvedEventIds.has(event.id),
  );

const upcomingApprovedEvents =
  approvedEvents
    .filter(
      (event) =>
        new Date(
          event.startsAtIso,
        ).getTime() > now.getTime(),
    )
    .sort(
      (a, b) =>
        new Date(
          a.startsAtIso,
        ).getTime() -
        new Date(
          b.startsAtIso,
        ).getTime(),
    );

const currentMission =
  upcomingApprovedEvents[0];

export default async function TeamPage() {
  const { data: membersData } =
    await supabase
      .from("members")
      .select("*");

  const teamMembers: TeamMember[] =
    (membersData || []).map(
      (member) => ({
        name:
          member.name ||
          "MIGO Member",

        role:
          member.role || "Member",

        responsibility:
          "Mission Operations",

        skills: ["MIGO Team"],

        githubUsername:
          member.github_username ||
          "migo-member",

        participationCount: 0,
      }),
    );

  return (
    <div className="min-h-full bg-black text-zinc-100">
      <Navbar />

      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden border-b border-zinc-900 px-4 py-16 sm:px-6 lg:px-8"
          aria-labelledby="team-heading"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-20%,rgba(34,211,238,0.08),transparent)]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-300/80">
              MIGO OPERATORS
            </p>

            <h1
              id="team-heading"
              className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              The team operating MIGO.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed tracking-[-0.02em] text-zinc-500 sm:text-lg">
              A focused group of ambitious
              students building systems,
              coordinating missions, and
              pushing beyond average
              through execution.
            </p>
          </div>
        </section>

        {/* Current Mission */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <article className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
              <div className="bg-gradient-to-r from-cyan-400/10 via-cyan-300/5 to-transparent px-6 py-6 sm:px-8">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
                  CURRENT MISSION
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {currentMission?.title ??
                    "No active mission"}
                </h2>
              </div>

              <div className="px-6 py-6 sm:px-8">
                {currentMission ? (
                  <>
                    <p className="max-w-3xl leading-relaxed text-zinc-400">
                      {
                        currentMission.description
                      }
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                          DATE
                        </p>

                        <p className="mt-2 text-lg font-medium text-zinc-100">
                          {
                            currentMission.date
                          }
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                          LOCATION
                        </p>

                        <p className="mt-2 text-lg font-medium text-zinc-100">
                          {
                            currentMission.location
                          }
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                          TEAM STATUS
                        </p>

                        <p className="mt-2 text-lg font-medium text-cyan-200">
                          {
                            teamMembers.length
                          }{" "}
                          Builders Active
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/events/${currentMission.id}`}
                      className="mt-8 inline-flex rounded-full border border-cyan-400/10 bg-cyan-400/5 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/20 hover:bg-cyan-400/10"
                    >
                      Open Mission
                    </Link>
                  </>
                ) : (
                  <p className="text-zinc-500">
                    No approved mission
                    available right now.
                  </p>
                )}
              </div>
            </article>
          </div>
        </section>

        {/* Team Workspace */}
        <TeamMembersWorkspace
          initialMembers={teamMembers}
          approvedMissionsCount={
            approvedEvents.length
          }
          upcomingMissionsCount={
            upcomingApprovedEvents.length
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}