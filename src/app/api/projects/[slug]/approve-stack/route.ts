import { NextRequest, NextResponse } from 'next/server';
import { getProjectMetadata, saveProjectMetadata, writeArtifact, persistProjectToDB } from '@/app/api/lib/project-utils';
import { ProjectDBService } from '@/backend/services/database/drizzle_project_db_service';
import { logger } from '@/lib/logger';
import { withAuth, type AuthSession } from '@/app/api/middleware/auth-guard';
import { ApproveStackSchema, type CustomStackComposition, type TechnicalPreferences } from '@/app/api/schemas';

export const runtime = 'nodejs';

/**
 * Generate stack-decision.md content based on mode (template or custom)
 */
function generateStackDecisionContent(
  mode: 'template' | 'custom',
  stackChoice: string,
  reasoning: string,
  customComposition?: CustomStackComposition,
  technicalPreferences?: TechnicalPreferences,
  alternativesConsidered?: Array<{ stack: string; reason_not_chosen: string }>
): string {
  const date = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toISOString();

  // Build composition table based on mode
  let compositionTable = '';
  if (mode === 'custom' && customComposition) {
    compositionTable = `| Layer | Technology | Details |
|-------|------------|---------|
| Frontend | ${customComposition.frontend.framework} | ${customComposition.frontend.meta_framework || 'N/A'} + ${customComposition.frontend.styling} + ${customComposition.frontend.ui_library} |
| Mobile | ${customComposition.mobile.platform} | ${customComposition.mobile.platform === 'none' ? 'Responsive web only' : customComposition.mobile.platform} |
| Backend | ${customComposition.backend.language} | ${customComposition.backend.framework} |
| Database | ${customComposition.database.provider} | ${customComposition.database.type}${customComposition.database.orm ? ` + ${customComposition.database.orm}` : ''} |
| Deployment | ${customComposition.deployment.platform} | ${customComposition.deployment.architecture} architecture |`;
  } else {
    compositionTable = `| Layer | Selection |
|-------|-----------|
| Template | ${stackChoice} |

*See stack_templates in orchestrator_spec.yml for full composition details.*`;
  }

  // Build technical preferences table
  let preferencesTable = '';
  if (technicalPreferences && Object.keys(technicalPreferences).length > 0) {
    const prefs = Object.entries(technicalPreferences)
      .filter(([, v]) => v)
      .map(([k, v]) => `| ${k.replace(/_/g, ' ')} | ${v} |`)
      .join('\n');
    preferencesTable = `## Technical Preferences Applied

| Category | Library |
|----------|---------|
${prefs}`;
  }

  // Build alternatives table
  let alternativesTable = '';
  if (alternativesConsidered && alternativesConsidered.length > 0) {
    const alts = alternativesConsidered
      .map((alt) => `| ${alt.stack} | ${alt.reason_not_chosen} |`)
      .join('\n');
    alternativesTable = `## Alternatives Considered

| Stack | Why Not Chosen |
|-------|----------------|
${alts}`;
  }

  return `---
title: "Technology Stack Decision"
owner: "architect"
version: "1"
date: "${date}"
status: "approved"
mode: "${mode}"
template: "${stackChoice}"
---

# Technology Stack Decision

## Selection Mode
**${mode === 'custom' ? 'Custom Stack' : 'Template: ' + stackChoice}**

## Composition

${compositionTable}

${preferencesTable}

## Rationale
${reasoning || 'Stack approved by user.'}

${alternativesTable}

## Approval Details
- **Approved At**: ${timestamp}
- **Mode**: ${mode}

## Next Steps
This stack decision will guide dependency generation in the DEPENDENCIES phase.
`;
}

/**
 * Generate stack-rationale.md content for audit trail
 */
function generateStackRationaleContent(
  mode: 'template' | 'custom',
  stackChoice: string,
  reasoning: string,
  alternativesConsidered?: Array<{ stack: string; reason_not_chosen: string }>
): string {
  const date = new Date().toISOString().split('T')[0];

  return `---
title: "Stack Selection Rationale"
owner: "architect"
version: "1"
date: "${date}"
status: "approved"
---

# Stack Selection Rationale

## Summary
- **Selection Mode**: ${mode}
- **Chosen Stack**: ${stackChoice}
- **Decision Date**: ${date}

## Reasoning

${reasoning || 'User approved the stack selection.'}

## Decision Factors

The stack was selected based on:
1. Project requirements from project-brief.md
2. User persona needs from personas.md
3. Technical constraints from constitution.md

${alternativesConsidered && alternativesConsidered.length > 0 ? `
## Alternatives Considered

${alternativesConsidered.map((alt) => `### ${alt.stack}
**Why not chosen**: ${alt.reason_not_chosen}
`).join('\n')}` : ''}

## Trade-offs Accepted

*To be detailed based on the specific stack choice.*

## Future Considerations

- Monitor performance and scalability as the project grows
- Re-evaluate stack if requirements change significantly
- Consider migration paths documented in orchestrator_spec.yml
`;
}

export const POST = withAuth(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
    session: AuthSession
  ) => {
    try {
      const { slug } = await params;
      const body = await request.json();

      // Validate input with Zod schema
      const validationResult = ApproveStackSchema.safeParse(body);
      if (!validationResult.success) {
        logger.warn('POST /api/projects/:slug/approve-stack - validation failed', {
          errors: validationResult.error.flatten(),
        });
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid input',
            details: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const {
        mode = 'template',
        stack_choice,
        custom_composition,
        technical_preferences,
        reasoning,
        alternatives_considered,
        platform,
      } = validationResult.data;

      const metadata = await getProjectMetadata(slug, session.user.id);

      if (!metadata || metadata.created_by_id !== session.user.id) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        );
      }

      // Generate stack-decision.md
      const stackDecisionContent = generateStackDecisionContent(
        mode,
        stack_choice,
        reasoning || '',
        custom_composition,
        technical_preferences,
        alternatives_considered
      );

      // Generate stack-rationale.md
      const stackRationaleContent = generateStackRationaleContent(
        mode,
        stack_choice,
        reasoning || '',
        alternatives_considered
      );

      // Write artifacts to filesystem
      await writeArtifact(slug, 'STACK_SELECTION', 'stack-decision.md', stackDecisionContent);
      await writeArtifact(slug, 'STACK_SELECTION', 'stack-rationale.md', stackRationaleContent);

      // DB-primary: persist artifacts to database
      const dbService = new ProjectDBService();
      const dbProject = await dbService.getProjectBySlug(slug, session.user.id);

      if (dbProject) {
        try {
          await dbService.saveArtifact(
            dbProject.id,
            'STACK_SELECTION',
            'stack-decision.md',
            stackDecisionContent
          );
          await dbService.saveArtifact(
            dbProject.id,
            'STACK_SELECTION',
            'stack-rationale.md',
            stackRationaleContent
          );

          logger.info('Stack approval artifacts persisted to database', {
            slug,
            projectId: dbProject.id,
            mode,
          });
        } catch (dbError) {
          logger.warn(
            `Failed to persist stack artifacts to database: ${dbError instanceof Error ? dbError.message : String(dbError)}`,
            { slug }
          );
        }
      }

      // Update project metadata with extended information
      const updated = {
        ...metadata,
        stack_choice,
        stack_mode: mode,
        platform_type: platform,
        stack_approved: true,
        stack_approval_date: new Date().toISOString(),
        stack_reasoning: reasoning,
        technical_preferences: technical_preferences || {},
        custom_composition: mode === 'custom' ? custom_composition : undefined,
        created_by_id: metadata.created_by_id || session.user.id,
        updated_at: new Date().toISOString(),
      };

      await saveProjectMetadata(slug, updated);
      await persistProjectToDB(slug, updated);

      logger.info('Stack selection approved', {
        slug,
        userId: session.user.id,
        stackChoice: stack_choice,
        mode,
      });

      return NextResponse.json({
        success: true,
        data: {
          slug,
          stack_choice,
          mode,
          platform_type: platform,
          stack_approved: true,
          technical_preferences,
          message: 'Stack selection approved successfully',
        },
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Error approving stack:', err);
      return NextResponse.json(
        { success: false, error: 'Failed to approve stack' },
        { status: 500 }
      );
    }
  }
);
