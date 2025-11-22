import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Terms of Service | Spec-Driven Platform",
  description: "Terms governing use of the Spec-Driven Platform.",
}

const sections = [
  {
    title: "Acceptance",
    items: [
      "By accessing or using the Spec-Driven Platform, you agree to these Terms and our Privacy Policy.",
      "If you use the service on behalf of an organization, you represent you have authority to bind that organization.",
    ],
  },
  {
    title: "Accounts",
    items: [
      "You must provide accurate account information and keep credentials secure.",
      "You are responsible for activities that occur under your account.",
      "We may suspend or terminate accounts for breach, abuse, or security risk.",
    ],
  },
  {
    title: "Your Content",
    items: [
      "You retain ownership of the specs, artifacts, and data you upload or generate.",
      "You grant us a limited license to process your content to operate the service (e.g., generate artifacts, display dashboards, perform backups).",
      "You are responsible for ensuring you have rights to the content you submit.",
    ],
  },
  {
    title: "Acceptable Use",
    items: [
      "No unlawful, harmful, or abusive conduct, including attempts to disrupt or probe the service.",
      "No uploading of malicious code or infringing content.",
      "Respect rate limits and platform boundaries; avoid unauthorized automation.",
    ],
  },
  {
    title: "Generated Outputs",
    items: [
      "Artifacts and prompts may include AI-generated content provided “as is.” You are responsible for review and validation before use.",
      "We do not guarantee fitness for any specific purpose or regulatory compliance.",
    ],
  },
  {
    title: "Service Changes & Availability",
    items: [
      "We may update features, impose limits, or discontinue portions of the service with notice when reasonable.",
      "We aim for high availability but do not guarantee uninterrupted service.",
    ],
  },
  {
    title: "Security & Data",
    items: [
      "We implement industry-standard safeguards; see the Privacy Policy for details on collection, use, and retention.",
      "You must protect your credentials and notify us of any suspected compromise.",
    ],
  },
  {
    title: "Disclaimers & Liability",
    items: [
      "Service is provided “as is” without warranties of any kind, to the fullest extent permitted by law.",
      "Our liability is limited to the amount you paid for the service in the 3 months preceding the claim, to the extent allowed by law.",
    ],
  },
  {
    title: "Termination",
    items: [
      "You may stop using the service at any time; you can request account deletion.",
      "We may suspend or terminate access for violations or to protect the platform.",
    ],
  },
  {
    title: "Governing Law",
    items: [
      "These Terms are governed by the laws of your primary contracting entity’s jurisdiction unless otherwise agreed.",
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3 text-center">
          <p className="inline-flex items-center justify-center rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Terms of Service
          </p>
          <h1 className="text-3xl font-bold text-foreground">Use of the Spec-Driven Platform</h1>
          <p className="text-muted-foreground">
            Please read these Terms carefully; they govern your access to and use of the platform.
          </p>
        </header>

        <Card className="border border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              These Terms form a binding agreement between you (or your organization) and Spec-Driven
              Platform. If you do not agree, do not use the service.
            </p>
            <p>
              Some features may be subject to additional terms or policies; those will be presented when
              applicable.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title} className="border border-border/70 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>If you have questions about these Terms, reach us at:</p>
            <p className="font-medium text-foreground">support@specdriven.ai</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

