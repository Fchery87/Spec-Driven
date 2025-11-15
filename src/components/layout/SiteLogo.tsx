"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

interface SiteLogoProps {
  className?: string
  showText?: boolean
}

export function SiteLogo({ className, showText = true }: SiteLogoProps) {
  const gradientId = useId()

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-br from-[hsl(var(--chart-1))] via-[hsl(var(--chart-2))] to-[hsl(var(--chart-3))] opacity-70 blur-md" />
        <svg
          viewBox="0 0 64 64"
          className="relative h-12 w-12 text-primary drop-shadow-lg"
          role="img"
          aria-label="Spec-Driven"
        >
          <defs>
            <linearGradient id={`${gradientId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--chart-1))" />
              <stop offset="50%" stopColor="hsl(var(--chart-2))" />
              <stop offset="100%" stopColor="hsl(var(--chart-3))" />
            </linearGradient>
          </defs>
          <rect
            x="8"
            y="10"
            width="48"
            height="44"
            rx="12"
            fill={`url(#${gradientId}-grad)`}
            opacity="0.35"
          />
          <path
            d="M18 20h28c2.209 0 4 1.791 4 4v24c0 2.209-1.791 4-4 4H18c-2.209 0-4-1.791-4-4V24c0-2.209 1.791-4 4-4z"
            fill={`url(#${gradientId}-grad)`}
          />
          <path
            d="M22 28h20M22 36h12M22 44h8"
            stroke="hsl(var(--background))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="46" cy="44" r="5" fill="hsl(var(--background))" opacity="0.85" />
        </svg>
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="text-lg font-semibold tracking-tight text-foreground">Spec-Driven</span>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Orchestrate Tomorrow
          </p>
        </div>
      )}
    </div>
  )
}
