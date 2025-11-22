"use client"

import { ReactNode } from "react"
import { SiteFooter } from "./SiteFooter"
import { SiteHeader } from "./SiteHeader"
import { ProgressBar } from "./ProgressBar"

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <ProgressBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
