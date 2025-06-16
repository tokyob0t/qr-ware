import { useEffect, useState } from "react";
import { getSession } from "../api";

export function useAuthStatus() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<{ name?: string; email: string; role: string } | null>(null);

  useEffect(() => {
    getSession()
      .then(setUser)
      .finally(() => setChecking(false));
  }, []);

  return { checking, user };
}
