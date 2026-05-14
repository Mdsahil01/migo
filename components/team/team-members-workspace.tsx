"use client";

import { useMemo, useState } from "react";

export type TeamMember = {
  name: string;
  email: string;
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
  isTeamLead: boolean;
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
  isTeamLead,
}: TeamMembersWorkspaceProps) {
  const [members, setMembers] =
    useState(initialMembers);

  const [isInviteOpen, setIsInviteOpen] =
    useState(false);

  const [form, setForm] = useState(
    initialInviteForm,
  );

  const [editingMember, setEditingMember] =
    useState<TeamMember | null>(null);

  const [editForm, setEditForm] =
    useState({
      name: "",
      role: "",
      githubUsername: "",
      email: "",
    });

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
        email,
        role,
        responsibility:
          "Mission Operations",
        githubUsername,
        skills: ["MIGO Team"],
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

  const onDeleteMember = async (
    email: string,
  ) => {
    const confirmed = window.confirm(
      "Remove this member from MIGO?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "/api/delete-member",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to remove member",
        );

        return;
      }

      setMembers((prevMembers) =>
        prevMembers.filter(
          (member) =>
            member.email !== email,
        ),
      );

      alert("Member removed.");
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  const onEditMember = async () => {
    if (!editingMember) {
      return;
    }

    try {
      const response = await fetch(
        "/api/edit-member",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: editForm.email,
            name: editForm.name,
            role: editForm.role,
            githubUsername:
              editForm.githubUsername,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Failed to edit member",
        );

        return;
      }

      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.email ===
          editForm.email
            ? {
                ...member,
                name: editForm.name,
                role: editForm.role,
                githubUsername:
                  editForm.githubUsername,
              }
            : member,
        ),
      );

      setEditingMember(null);

      alert("Member updated.");
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <section className="px-4 py-10 sm:px-6 sm:py-14">
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

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Team members
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Core contributors driving
                approvals, product quality,
                and student experience
                across every release.
              </p>
            </div>

            {isTeamLead && (
              <button
                type="button"
                onClick={() =>
                  setIsInviteOpen(true)
                }
                className="inline-flex rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/25 outline-none transition hover:bg-emerald-400 hover:shadow-emerald-500/40"
              >
                + Invite Member
              </button>
            )}
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

                {isTeamLead && (
                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMember(
                          member,
                        );

                        setEditForm({
                          name:
                            member.name,
                          role:
                            member.role,
                          githubUsername:
                            member.githubUsername,
                          email:
                            member.email,
                        });
                      }}
                      className="inline-flex rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
                    >
                      Edit Member
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDeleteMember(
                          member.email,
                        )
                      }
                      className="inline-flex rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
                    >
                      Remove Member
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {editingMember ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() =>
              setEditingMember(null)
            }
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">
              Edit Member
            </h3>

            <div className="mt-5 space-y-4">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
                placeholder="Name"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white"
              />

              <input
                type="text"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    role: e.target.value,
                  })
                }
                placeholder="Role"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white"
              />

              <input
                type="text"
                value={
                  editForm.githubUsername
                }
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    githubUsername:
                      e.target.value,
                  })
                }
                placeholder="GitHub Username"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingMember(null)
                  }
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={onEditMember}
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isInviteOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/75 backdrop-blur-sm"
            onClick={() =>
              setIsInviteOpen(false)
            }
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/50">
            <h3 className="text-lg font-semibold text-white">
              Invite new member
            </h3>

            <form
              className="mt-5 space-y-4"
              onSubmit={onInviteSubmit}
            >
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
                placeholder="Name"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100"
                required
              />

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
                placeholder="Email"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100"
                required
              />

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
                placeholder="Role"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100"
                required
              />

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
                placeholder="GitHub Username"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsInviteOpen(false)
                  }
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black"
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