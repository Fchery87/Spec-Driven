"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Globe, Shield, Smartphone, Layers, Sparkles } from "lucide-react"

interface ArchitecturePattern {
  id: string
  name: string
  description: string
  pattern_type: string
  stack_examples: string[]
  characteristics: {
    codebase: string
    scaling: string
    ops_complexity: string
    team_size: string
  }
  best_for: string[]
  strengths: string[]
  tradeoffs: string[]
  dau_range: string
}

interface StackSelectionProps {
  selectedStack?: string
  onStackSelect: (stackId: string, reasoning?: string) => void
  isLoading?: boolean
}

export function StackSelection({
  selectedStack,
  onStackSelect,
  isLoading = false
}: StackSelectionProps) {
  const [customStack, setCustomStack] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [reasoning, setReasoning] = useState('')

  // Define architecture patterns - 3 options: Web App, Mobile App, API-First
  const ARCHITECTURE_PATTERNS: ArchitecturePattern[] = [
    {
      id: 'web_application',
      name: 'Web Application',
      description: 'Single unified codebase with integrated API layer for browser-based apps',
      pattern_type: 'Monolithic Full-Stack',
      stack_examples: ['Next.js + Drizzle', 'Django', 'React', 'Python', 'Tanstack Start'],
      characteristics: {
        codebase: 'Single unified repository',
        scaling: 'Vertical scaling, managed services',
        ops_complexity: 'Low - single deployment target',
        team_size: 'Small to medium (1-5 engineers)'
      },
      best_for: ['SaaS dashboards', 'admin panels', 'internal tools', 'content platforms', 'MVPs'],
      strengths: ['Single language ecosystem', 'unified codebase', 'fast iteration', 'integrated API layer', 'low operational overhead', 'easy debugging'],
      tradeoffs: ['Less suitable for heavy background compute', 'tightly coupled frontend/backend', 'harder to scale independent components'],
      dau_range: '<10k DAU'
    },
    {
      id: 'mobile_application',
      name: 'Mobile Application',
      description: 'Cross-platform native apps with dedicated API backend',
      pattern_type: 'Mobile-First',
      stack_examples: ['React Native + Expo', 'Flutter + Firebase', 'Swift/Kotlin native', 'Supabase backend'],
      characteristics: {
        codebase: 'Mobile app + API backend',
        scaling: 'App store deployment, cloud API',
        ops_complexity: 'Medium - app store releases + API',
        team_size: 'Medium (2-6 engineers)'
      },
      best_for: ['Consumer apps', 'offline-first', 'push notifications', 'device features', 'location-based services'],
      strengths: ['Native device access (camera, GPS, sensors)', 'offline support & local storage', 'push notification infrastructure', 'app store distribution', 'better UX for mobile users'],
      tradeoffs: ['App store review process', 'separate iOS/Android considerations', 'more complex deployment pipeline', 'device fragmentation'],
      dau_range: '100k+ users'
    },
    {
      id: 'api_first_platform',
      name: 'API-First Platform',
      description: 'Headless architecture serving multiple clients and integrations',
      pattern_type: 'Headless/Multi-Client',
      stack_examples: ['Node.js/Go/Rust API', 'GraphQL federation', 'Serverless (Lambda, Workers)', 'separate web/mobile clients'],
      characteristics: {
        codebase: 'Separate API + multiple client repos',
        scaling: 'Horizontal scaling, independent services',
        ops_complexity: 'High - multiple deployment targets',
        team_size: 'Medium to large (3-10+ engineers)'
      },
      best_for: ['Multi-platform products', 'developer APIs', 'B2B integrations', 'marketplaces', 'SDK/CLI tooling'],
      strengths: ['Single API serving web, mobile, third-party', 'SDK/CLI tooling potential', 'webhook-driven integrations', 'multi-tenant ready', 'technology flexibility'],
      tradeoffs: ['Increased operational complexity', 'API contract management', 'separate deployments required', 'higher initial setup cost'],
      dau_range: '100k+ DAU, B2B'
    }
  ]

  const patterns = ARCHITECTURE_PATTERNS

  const handleStackSelect = (stackId: string) => {
    onStackSelect(stackId, reasoning)
  }

  const handleCustomStack = () => {
    if (customStack.trim()) {
      onStackSelect('custom', reasoning)
    }
  }

  const getPatternIcon = (patternId: string) => {
    switch (patternId) {
      case 'web_application':
        return <Globe className="h-6 w-6 text-primary" />
      case 'mobile_application':
        return <Smartphone className="h-6 w-6 text-violet-500" />
      case 'api_first_platform':
        return <Layers className="h-6 w-6 text-cyan-500" />
      default:
        return <Shield className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getPatternColor = (patternId: string) => {
    switch (patternId) {
      case 'web_application':
        return 'border-primary/40 bg-primary/10'
      case 'mobile_application':
        return 'border-violet-500/40 bg-violet-500/10'
      case 'api_first_platform':
        return 'border-cyan-500/40 bg-cyan-500/10'
      default:
        return 'border-border bg-muted'
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Architecture Pattern Selector */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-[hsl(var(--chart-2))]" />
          Choose Your Architecture Pattern
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Select the architectural approach that best matches your project scale, team size, and technical requirements. Specific technology choices will be made in the next phase.
        </p>
      </div>

      {/* Architecture Pattern Options */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <Card
            key={pattern.id}
            className={`
              cursor-pointer transition-all hover:shadow-lg
              ${selectedStack === pattern.id ? 'ring-2 ring-primary ' + getPatternColor(pattern.id) : 'hover:scale-[1.02]'}
            `}
            onClick={() => handleStackSelect(pattern.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getPatternIcon(pattern.id)}
                  <CardTitle className="text-lg">{pattern.name}</CardTitle>
                </div>
                {selectedStack === pattern.id && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                )}
              </div>
              <CardDescription className="text-sm">
                {pattern.description}
              </CardDescription>
              <Badge variant="outline" className="w-fit text-xs mt-2">
                {pattern.pattern_type}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stack Examples */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Stack Examples:</h4>
                <div className="flex flex-wrap gap-1">
                  {pattern.stack_examples.map((example) => (
                    <Badge key={example} className="text-xs bg-muted text-muted-foreground hover:bg-muted">
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Best For:</h4>
                <div className="flex flex-wrap gap-1">
                  {pattern.best_for.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Characteristics */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Characteristics:</h4>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <div><span className="font-medium">Codebase:</span> {pattern.characteristics.codebase}</div>
                  <div><span className="font-medium">Scaling:</span> {pattern.characteristics.scaling}</div>
                  <div><span className="font-medium">Ops:</span> {pattern.characteristics.ops_complexity}</div>
                  <div><span className="font-medium">Team:</span> {pattern.characteristics.team_size}</div>
                  <div><span className="font-medium">Scale:</span> {pattern.dau_range}</div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Strengths:</h4>
                <ul className="text-xs space-y-1">
                  {pattern.strengths.slice(0, 4).map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tradeoffs */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Trade-offs:</h4>
                <ul className="text-xs space-y-1">
                  {pattern.tradeoffs.slice(0, 3).map((tradeoff, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Pattern Option */}
      <Card className="border-dashed border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-muted-foreground" />
            Custom Architecture
          </CardTitle>
          <CardDescription>
            Define your own architecture pattern if the predefined options don&apos;t match your needs.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showCustom ? (
            <Button
              variant="outline"
              onClick={() => setShowCustom(true)}
              className="w-full"
            >
              Define Custom Architecture
            </Button>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Describe your custom architecture pattern (e.g., Custom monolithic with message queues, specialized microservices)"
                value={customStack}
                onChange={(e) => setCustomStack(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCustomStack}
                  disabled={!customStack.trim() || isLoading}
                  className="flex-1"
                >
                  Use Custom Architecture
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustom(false)
                    setCustomStack('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reasoning Input */}
      {(selectedStack || showCustom) && (
        <Card>
          <CardHeader>
            <CardTitle>Why did you choose this architecture?</CardTitle>
            <CardDescription>
              Help us understand your reasoning so we can recommend the best specific technologies for your needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="w-full p-3 border rounded-md resize-none h-24"
              placeholder="e.g., We chose monolithic because our team is small and we want fast iteration. We can scale later when needed..."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
            />

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (selectedStack) {
                    handleStackSelect(selectedStack)
                  } else if (showCustom) {
                    handleCustomStack()
                  }
                }}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Confirming...' : 'Confirm Architecture Choice'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onStackSelect('')
                  setReasoning('')
                  setShowCustom(false)
                  setCustomStack('')
                }}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectedStack && !showCustom && (
        <Card className="bg-[hsl(var(--chart-4))]/10 border border-[hsl(var(--chart-4))]/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-[hsl(var(--chart-4))]">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--chart-4))]" />
              <span className="font-semibold">
                Selected: {patterns.find(p => p.id === selectedStack)?.name} architecture
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
