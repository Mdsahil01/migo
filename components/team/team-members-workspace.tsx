 "use client";

import { useMemo, useState } from "react";

export type TeamMember = {
  name: string;
  role: string;
  responsibility: string;
  skills: string[];
  githubUsername: string;
  participationCount: number;
};

type TeamMembersWorkspaceProps = {
  initialMembers: TeamMember[];
  approvedMissionsCount: number;
  upcomingMissionsCount: number;
};

type InviteFormState = {
  name: string;
  email: string;
  role: string;
  githubUsername: string;
};

const initialInviteForm: InviteFormState = {
  name: "",
  email: "",
  role: "",
  githubUsername: "",
};

function TeamStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

export function TeamMembersWorkspace({
  initialMembers,
  approvedMissionsCount,
  upcomingMissionsCount,
}: TeamMembersWorkspaceProps) {
  const [members, setMembers] =
    useState(initialMembers);

  const [isInviteOpen, setIsInviteOpen] =
    useState(false);

  const [form, setForm] = useState(
    initialInviteForm,
  );

  const totalParticipations = useMemo(
    () =>
      members.reduce(
        (sum, member) =>
          sum + member.participationCount,
        0,
      ),
    [members],
  );

  const averageParticipations =
    members.length === 0
      ? 0
      : Math.round(
          totalParticipations /
            members.length,
        );

  const teamStats = [
    {
      label: "Core team",
      value: members.length.toString(),
    },
    {
      label: "Approved missions",
      value:
        approvedMissionsCount.toString(),
    },
    {
      label: "Upcoming missions",
      value:
        upcomingMissionsCount.toString(),
    },
    {
      label: "Avg participation",
      value: `${averageParticipations} events`,
    },
  ] as const;

  const onInviteSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const name = form.name.trim();

    const email = form.email
      .trim()
      .toLowerCase();

    const role = form.role.trim();

    const githubUsername =
      form.githubUsername
        .replace(/^@/, "")
        .trim();

    if (
      !name ||
      !email ||
      !role ||
      !githubUsername
    ) {
      return;
    }

    try {
      const response = await fetch(
        "/api/invite-member",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            role,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to invite member",
        );

        return;
      }

      const newMember: TeamMember = {
        name,
        role,
        responsibility:
          "Event Research",
        githubUsername,
        skills: ["New member"],
        participationCount: 0,
      };

      setMembers((prevMembers) => [
        newMember,
        ...prevMembers,
      ]);

      setForm(initialInviteForm);

      setIsInviteOpen(false);

      alert(
        "Member invited successfully.",
      );
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <section
        className="px-4 py-10 sm:px-6 sm:py-14"
        aria-label="Team statistics"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {teamStats.map((stat) => (
              <TeamStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-4 pb-12 sm:px-6 sm:pb-16"
        aria-labelledby="team-members"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2
                id="team-members"
                className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
              >
                Team members
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Core contributors driving
                approvals, product quality,
                and student experience
                across every release.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsInviteOpen(true)
              }
              className="inline-flex rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 outline-none transition hover:bg-emerald-400 hover:shadow-emerald-500/40 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              + Invite Member
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <article
                key={`${member.githubUsername}-${member.name}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-5 shadow-lg shadow-black/20 transition hover:border-emerald-500/25 hover:bg-zinc-900/70"
              >
                <h3 className="text-lg font-semibold text-white">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-emerald-300">
                  {member.role}
                </p>

                <div className="mt-3 rounded-lg border border-cyan-500/35 bg-cyan-500/10 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                    Responsibility
                  </p>

                  <p className="mt-1 text-sm font-medium text-cyan-100">
                    {
                      member.responsibility
                    }
                  </p>
                </div>

                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-zinc-500">
                      GitHub
                    </dt>

                    <dd className="font-medium text-zinc-200">
                      @
                      {
                        member.githubUsername
                      }
                    </dd>
                  </div>

                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-zinc-500">
                      Participation
                    </dt>

                    <dd className="font-medium text-zinc-200">
                      {
                        member.participationCount
                      }{" "}
                      events
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  {member.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-zinc-700 bg-zinc-950/60 px-2.5 py-1 text-xs font-medium text-zinc-300"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isInviteOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/75 backdrop-blur-sm"
            aria-label="Close invite member modal"
            onClick={() =>
              setIsInviteOpen(false)
            }
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/50">
            <h3 className="text-lg font-semibold text-white">
              Invite new member
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              Add a teammate to your
              MIGO core team workspace.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={onInviteSubmit}
            >
              <label className="block">
                <span className="text-sm font-medium text-zinc-300">
                  Name
                </span>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      name:
                        event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="e.g. Priya Singh"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-300">
                  Email
                </span>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      email:
                        event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="e.g. teammate@gmail.com"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-300">
                  Role
                </span>

                <input
                  type="text"
                  value={form.role}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      role:
                        event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="e.g. Mobile Engineer"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-300">
                  GitHub Username
                </span>

                <input
                  type="text"
                  value={
                    form.githubUsername
                  }
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      githubUsername:
                        event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="e.g. priyacodes"
                  required
                />
              </label>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setIsInviteOpen(false)
                  }
                  className="inline-flex justify-center rounded-xl border border-zinc-700 bg-zinc-950/50 px-4 py-2.5 text-sm font-semibold text-zinc-200 outline-none transition hover:border-zinc-600 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 outline-none transition hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}