import { NextResponse } from "next/server";

import {
  requireAuthorizedMember,
  type AuthorizedMember,
} from "@/lib/auth/require-member";

export type RequireTeamLeadResult =
  | { ok: true; data: AuthorizedMember }
  | { ok: false; response: NextResponse };

export async function requireTeamLead(): Promise<RequireTeamLeadResult> {
  const authResult = await requireAuthorizedMember();

  if (!authResult.ok) {
    return authResult;
  }

  const role =
    authResult.data.member.role?.trim().toLowerCase();

  if (role !== "team lead") {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "Forbidden — MIGO Team Lead authorization required",
        },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    data: authResult.data,
  };
}
