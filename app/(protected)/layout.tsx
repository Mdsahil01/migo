import { currentUser } from "@clerk/nextjs/server";

import { MigoWelcome } from "@/components/migo-welcome";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  const name =
  user?.fullName ||
  user?.firstName ||
  "MIGO Member";

  return (
    <>
      <MigoWelcome name={name} />
      {children}
    </>
  );
}