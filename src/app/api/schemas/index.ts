import { z } from 'zod';

/**
 * Project creation schema with validation
 */
export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(5000, 'Description must not exceed 5000 characters')
    .trim()
    .optional()
    .default(''),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

/**
 * Stack approval schema with validation
 */
export const ApproveStackSchema = z.object({
  stack_choice: z
    .string()
    .min(1, 'Stack choice is required')
    .trim(),
  reasoning: z
    .string()
    .max(2000, 'Reasoning must not exceed 2000 characters')
    .trim()
    .optional()
    .default(''),
  platform: z
    .string()
    .optional(),
});

export type ApproveStackInput = z.infer<typeof ApproveStackSchema>;

/**
 * Dependency package schema
 */
const DependencyPackageSchema = z.object({
  name: z.string(),
  version: z.string(),
  size: z.string().optional(),
  category: z.enum(['core', 'ui', 'data', 'auth', 'utils', 'dev']),
});

/**
 * Dependency option schema (preset selection)
 */
const DependencyOptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  frontend: z.string(),
  backend: z.string(),
  database: z.string(),
  deployment: z.string(),
  packages: z.array(DependencyPackageSchema),
  highlights: z.array(z.string()),
});

/**
 * Custom stack schema
 */
const CustomStackSchema = z.object({
  frontend: z.string(),
  backend: z.string(),
  database: z.string(),
  deployment: z.string(),
  dependencies: z.array(z.string()),
  requests: z.string().optional(),
});

/**
 * Dependencies approval schema with validation
 */
export const ApproveDependenciesSchema = z.object({
  notes: z
    .string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .trim()
    .optional(),
  // New fields for dependency selection
  mode: z.enum(['preset', 'custom']).optional(),
  architecture: z.string().optional(),
  option: DependencyOptionSchema.optional(),
  customStack: CustomStackSchema.optional(),
});

export type ApproveDependenciesInput = z.infer<typeof ApproveDependenciesSchema>;
export type DependencyPackage = z.infer<typeof DependencyPackageSchema>;
export type DependencyOption = z.infer<typeof DependencyOptionSchema>;
