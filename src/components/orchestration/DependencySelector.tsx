"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Platform = "web" | "mobile"

interface DependencyOption {
  id: string
  title: string
  summary: string
  frontend: string
  backend: string
  database: string
  deployment: string
  dependencies: string[]
  highlights: string[]
}

const dependencyOptions: Record<Platform, DependencyOption[]> = {
  web: [
    {
      id: "web_next_full",
      title: "Option 1 · Next.js Full-Stack",
      summary: "Single Next.js codebase powering UI + APIs with Prisma/Postgres",
      frontend: "Next.js 14 App Router + Tailwind",
      backend: "Next.js API routes / tRPC",
      database: "PostgreSQL + Prisma",
      deployment: "Vercel",
      dependencies: ["next", "react", "next-auth", "prisma", "@prisma/client", "tailwindcss", "zod"],
      highlights: ["Unified TypeScript codebase", "Fast iteration", "Minimal DevOps footprint"],
    },
    {
      id: "web_next_fastapi",
      title: "Option 2 · Next.js + FastAPI",
      summary: "Next.js frontend with Python FastAPI backend for heavier compute",
      frontend: "Next.js 14 App Router",
      backend: "FastAPI + Uvicorn + Celery workers",
      database: "PostgreSQL + SQLAlchemy",
      deployment: "Vercel (web) + Fly.io/Render (API)",
      dependencies: ["next", "react", "axios", "fastapi", "uvicorn", "sqlalchemy", "alembic", "redis"],
      highlights: ["Decoupled services", "Python for AI/data workloads", "Scales independently"],
    },
  ],
  mobile: [
    {
      id: "mobile_next_expo",
      title: "Option 1 · Next.js + Expo",
      summary: "Shared TypeScript stack for web + mobile via Expo Router",
      frontend: "Next.js 14 (web) + Expo (mobile)",
      backend: "Next.js API routes / tRPC",
      database: "PostgreSQL + Prisma",
      deployment: "Vercel + Expo Application Services",
      dependencies: ["next", "react-native", "expo", "expo-router", "prisma", "@prisma/client", "nativewind"],
      highlights: ["Single codebase", "Fast prototyping", "OTA updates via Expo"],
    },
    {
      id: "mobile_next_fastapi",
      title: "Option 2 · Next.js + FastAPI + Expo",
      summary: "Split architecture with Expo mobile clients and Python APIs",
      frontend: "Next.js 14 + Expo",
      backend: "FastAPI + Uvicorn + Celery workers",
      database: "PostgreSQL + SQLAlchemy",
      deployment: "Vercel + Expo + Fly.io/Render",
      dependencies: ["next", "expo", "expo-router", "react-native-reanimated", "fastapi", "sqlalchemy", "redis"],
      highlights: ["Python services", "Cross-platform UX", "Background workers ready"],
    },
  ],
}

interface DependencySelectorProps {
  submitting?: boolean
  onApprove: (payload: { platform: Platform; option: DependencyOption; notes: string }) => void
}

export function DependencySelector({ submitting = false, onApprove }: DependencySelectorProps) {
  const [platform, setPlatform] = useState<Platform>("web")
  const [selectedOption, setSelectedOption] = useState<DependencyOption | null>(null)
  const [notes, setNotes] = useState("")

  const handleApprove = () => {
    if (!platform || !selectedOption) return
    onApprove({ platform, option: selectedOption, notes })
  }

  const options = dependencyOptions[platform]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {(["web", "mobile"] as Platform[]).map((p) => (
          <Button
            key={p}
            type="button"
            variant={platform === p ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => {
              setPlatform(p)
              setSelectedOption(null)
            }}
          >
            {p === "web" ? "Web App" : "Mobile / Cross-platform"}
            {platform === p && <Badge variant="secondary">Active</Badge>}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedOption?.id === option.id
          return (
            <Card
              key={option.id}
              className={cn(
                "border border-border/60 transition hover:border-primary/60",
                isSelected && "border-primary shadow-lg"
              )}
            >
              <CardHeader>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-md border border-border/50 bg-muted/40 p-3 text-xs">
                  <p>
                    <strong>Frontend:</strong> {option.frontend}
                  </p>
                  <p>
                    <strong>Backend:</strong> {option.backend}
                  </p>
                  <p>
                    <strong>Database:</strong> {option.database}
                  </p>
                  <p>
                    <strong>Deployment:</strong> {option.deployment}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-foreground mb-1">Key Dependencies</p>
                  <div className="flex flex-wrap gap-2">
                    {option.dependencies.map((dep) => (
                      <Badge key={dep} variant="outline" className="text-[11px]">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  {option.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedOption(option)}
                >
                  {isSelected ? "Selected" : "Choose this option"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="space-y-2">
        <label htmlFor="dependency-notes" className="text-sm font-medium text-foreground">
          Additional Notes
        </label>
        <textarea
          id="dependency-notes"
          className="min-h-[120px] w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          placeholder="Call out security exceptions, licensing requirements, or hosting preferences..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {selectedOption ? `${selectedOption.title} selected for ${platform === "web" ? "web" : "mobile"} platform.` : "Select a platform and option to continue."}
        </p>
        <Button type="button" onClick={handleApprove} disabled={!selectedOption || submitting}>
          {submitting ? "Submitting..." : "Approve Dependencies"}
        </Button>
      </div>
    </div>
  )
}
