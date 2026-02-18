"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { Moon, Sun } from "@phosphor-icons/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

export function AppNavbar() {
  const { accessToken } = useAuth();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = useMemo(() => {
    const t = resolvedTheme ?? theme;
    return t === "dark";
  }, [resolvedTheme, theme]);

  return (
    <Navbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <Link as={NextLink} href="/" className="font-semibold text-foreground">
          Task Manager
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link as={NextLink} href="/" color={pathname === "/" ? "primary" : "foreground"}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname.startsWith("/dashboard")}>
          <Link
            as={NextLink}
            href="/dashboard"
            color={pathname.startsWith("/dashboard") ? "primary" : "foreground"}
          >
            Dashboard
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="ml-auto gap-2">
        {!accessToken ? (
          <NavbarItem>
            <Button as={NextLink} href="/login" color="primary" size="sm">
              Sign in
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button as={NextLink} href="/dashboard" color="primary" variant="flat" size="sm">
              Open dashboard
            </Button>
          </NavbarItem>
        )}

        <NavbarItem>
          <Button
            isIconOnly
            variant="flat"
            size="sm"
            aria-label="Toggle theme"
            onPress={() => setTheme(isDark ? "light" : "dark")}
          >
            {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : null}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
