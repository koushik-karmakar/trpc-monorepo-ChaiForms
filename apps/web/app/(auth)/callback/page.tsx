"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "~/trpc/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleCallback = trpc.auth.authenticationWithGoogle.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (err) => {
      console.error("Auth failed:", err);
      router.push("/login?error=auth_failed");
    },
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (code && !handleGoogleCallback.isPending) {
      handleGoogleCallback.mutate({ code });
    }
  }, []);

  return (
    <div>
      {handleGoogleCallback.isPending && <p>Signing you in...</p>}
      {handleGoogleCallback.isError && <p>Authentication failed. Redirecting...</p>}
    </div>
  );
}