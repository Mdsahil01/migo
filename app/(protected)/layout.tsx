import { redirect } from "next/navigation";

import {
  currentUser,
} from "@clerk/nextjs/server";

import { MigoWelcome } from "@/components/migo-welcome";

import { supabase } from "@/lib/supabase";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user =
    await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email =
    user.emailAddresses[0]
      ?.emailAddress
      ?.toLowerCase();

  if (!email) {
    redirect("/unauthorized");
  }

  const { data: member } =
    await supabase
      .from("members")
      .select("*")
      .eq("email", email)
      .single();

  if (!member) {
    redirect("/unauthorized");
  }

  const name =
    user.fullName ||
    user.firstName ||
    "MIGO Member";

  return (
    <>
      <MigoWelcome name={name} />
      {children}
    </>
  );
}