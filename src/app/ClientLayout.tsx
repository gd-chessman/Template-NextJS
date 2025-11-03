"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { LangProvider } from "@/lang/LangProvider";
import Header from "@/components/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: true,
          },
        },
      })
  );

  const pathname = usePathname();
  const router = useRouter();

  // Check if current page is login
  const isLoginPage =
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  const { isAuth } = useAuth();

  // Handle authentication redirects
  useEffect(() => {
    if (!isAuth && !isLoginPage) {
      router.push("/login");
    }
    // Nếu đã login mà đang ở trang login thì chuyển hướng đến /dashboard
    if (isAuth && isLoginPage) {
      router.push("/"); // hoặc trang bạn muốn mặc định sau khi login
    }
  }, [isAuth, isLoginPage, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
      </LangProvider>
    </QueryClientProvider>
  );
}