"use client";

import { useEffect, useState } from "react";

export type ClientUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  clientId: string;
  apiKey: string;
  balance: number;
  status: string;
  senderId?: string;
};

export function useClientUser() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const res = await fetch("/api/auth/me");
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    })();
  }, []);

  return { user, loading, refresh };
}
