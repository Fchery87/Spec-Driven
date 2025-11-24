"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useLogger } from "@/lib/logger"

import { SiteLogo } from "./SiteLogo"
import { ThemeToggle } from "./ThemeToggle"

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Create Project", href: "/project/create" },
]

interface SiteHeaderProps {
  className?: string
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const { data, isPending } = useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logError } = useLogger("SiteHeader")

  const isAuthenticated = Boolean(data?.session)
  const userLabel = data?.user
    ? data.user.name?.trim() || data.user.email || "Account"
    : null

  const handleSignOut = async () => {
    if (isSigningOut) return

    try {
      setIsSigningOut(true)
      await signOut()
      setMobileOpen(false)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      logError("Failed to sign out", err)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Spec-Driven Home">
          <SiteLogo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-md bg-muted" aria-hidden="true" />
          ) : isAuthenticated ? (
            <>
              {userLabel && (
                <span className="hidden text-sm font-medium text-muted-foreground sm:inline-block">
                  {userLabel}
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="hidden md:inline-flex"
              >
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" className="shadow-sm hidden md:inline-flex" asChild>
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-auto block max-w-6xl border-t border-border/60 bg-background/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            {isPending ? null : isAuthenticated ? (
              <Button size="sm" variant="outline" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button size="sm" asChild onClick={() => setMobileOpen(false)}>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" variant="outline" asChild onClick={() => setMobileOpen(false)}>
                  <Link href="/sign-up">Create Account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
