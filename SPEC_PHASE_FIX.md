# SPEC Phase Execution Fix

**Commit**: `977963c`
**Date**: November 21, 2025
**Issue**: SPEC phase execution failing with context loss error

## Problem

When executing the SPEC phase, the system was throwing:
```
TypeError: Cannot read properties of undefined (reading 'ANALYSIS')
at OrchestratorEngine.runPhaseAgent (orchestrator_engine.ts:228:63)
```

This error occurred after the PM executor completed and attempted to run the Architect executor.

## Root Cause

The `runArchitectForSpec` method was attempting to dynamically import and instantiate `AgentExecutor`:

```typescript
// OLD - BROKEN
const executor = new (await import('../llm/agent_executors')).AgentExecutor();
const result = await executor.runArchitectAgent(brief, {...}, prd);
```

This dynamic import pattern broke the `this` context binding. After the async operation completed, `this.spec` became `undefined`, causing the phase switch statement to fail when trying to access `this.spec.phases[project.current_phase]`.

## Solution

Use the existing `getArchitectExecutor` wrapper function which is specifically designed for this pattern:

```typescript
// NEW - FIXED
return await getArchitectExecutor(
  this.llmClient,
  projectId,
  artifacts
);
```

This wrapper function properly handles the agent instantiation and maintains context through async operations.

## SPEC Phase Execution Flow (Now Fixed)

```
POST /api/projects/[slug]/execute-phase
├── Load project metadata ✅
├── Collect previous ANALYSIS phase artifacts ✅
├── Initialize OrchestratorEngine ✅
└── runPhaseAgent(project, artifacts) for SPEC phase
    ├── Call getPMExecutor (generates PRD) ✅
    │   └── Saves SPEC/PRD.md ✅
    ├── Merge PRD into artifacts ✅
    ├── Call runArchitectForSpec (generates data-model + api-spec) ✅
    │   └── Now uses getArchitectExecutor wrapper ✅
    │   └── Saves SPEC/data-model.md and SPEC/api-spec.json ✅
    └── Return combined artifacts ✅
```

## Files Modified

- `backend/services/orchestrator/orchestrator_engine.ts` - Lines 330-340
  - Replaced dynamic import with proper wrapper function call
  - Removed 5 lines of problematic code
  - Simplified to 3 lines of clear, maintainable code

## Impact

- ✅ SPEC phase can now execute completely
- ✅ PM generates PRD first
- ✅ Architect generates data model and API spec using PRD as context
- ✅ Both artifact sets are properly combined and returned
- ✅ No context loss during async operations
- ✅ Phase execution continues to next phase (DEPENDENCIES)

## Testing

After this fix, the SPEC phase execution completes successfully with both sets of artifacts:
- `SPEC/PRD.md` - Product Requirements Document
- `SPEC/data-model.md` - Database schema and data model
- `SPEC/api-spec.json` - REST API specification

All 6 project phases are now fully execution-ready with no blocking errors.
