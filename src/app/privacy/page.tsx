import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Privacy Policy | Spec-Driven Platform",
  description: "How Spec-Driven collects, uses, and protects your data.",
}

const sections = [
  {
    title: "What we collect",
    items: [
      "Account data: name, email, authentication identifiers, and optional profile image.",
      "Project data: specifications, artifacts, prompts, and metadata you upload or generate.",
      "Usage data: feature usage, device/browser info, and approximate region for reliability and security.",
      "Optional integrations: OAuth identifiers from Google when you choose social sign-in.",
    ],
  },
  {
    title: "How we use data",
    items: [
      "Provide and improve the Spec-Driven platform, including orchestration, artifact generation, and dashboards.",
      "Authenticate users and secure access to projects and artifacts.",
      "Deliver notifications and operational emails (e.g., password resets).",
      "Monitor performance, detect abuse, and maintain service reliability.",
    ],
  },
  {
    title: "Sharing & third parties",
    items: [
      "Identity providers (Google) when you choose social sign-in.",
      "Cloud hosting, storage, and analytics providers that help us operate the service.",
      "We do not sell personal data. We only share with vendors under contractual obligations to protect your data.",
    ],
  },
  {
    title: "Security & retention",
    items: [
      "Encrypted transport (HTTPS) and managed Postgres (Neon) for data at rest.",
      "Least-privilege access for operational tooling.",
      "Retention tied to your account and projects; you can request deletion of your account and associated artifacts.",
    ],
  },
  {
    title: "Your choices",
    items: [
      "You can update or delete your account data, and request artifact deletion.",
      "You can opt out of optional communications.",
      "You can use password-based auth or Google sign-in; we store only the minimum identifiers required.",
    ],
  },
  {
    title: "International & compliance",
    items: [
      "Data may be processed in the United States and other regions where our providers operate.",
      "If you need a Data Processing Addendum (DPA) or have compliance questions, contact us.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3 text-center">
          <p className="inline-flex items-center justify-center rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Privacy Policy
          </p>
          <h1 className="text-3xl font-bold text-foreground">Your data, safeguarded</h1>
          <p className="text-muted-foreground">
            We collect only what we need to deliver the Spec-Driven experience and protect your projects.
          </p>
        </header>

        <Card className="border border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Spec-Driven Platform (“we”, “us”) orchestrates specification workflows and artifact generation.
              This policy explains what we collect, how we use it, and the choices you have.
            </p>
            <p>
              By using the service, you agree to this policy. If you have questions or requests, reach us at
              support@specdriven.ai.
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
            <p>If you have privacy questions or requests (access, deletion, DPA), contact:</p>
            <p className="font-medium text-foreground">support@specdriven.ai</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

