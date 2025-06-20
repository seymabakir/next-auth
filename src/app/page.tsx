"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (status === "authenticated") {
    return (
      <div>
        Welcome {session.user?.email}!
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("auth0")}>
      Login with Auth0
    </button>
  );
}
