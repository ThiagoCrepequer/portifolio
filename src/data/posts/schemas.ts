import { z } from "zod";

/**
 * Raw row as returned by SQLite/D1.
 * `content` and `tags` are stored as JSON-encoded strings.
 */
export const PostRowSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  content_html: z.string().nullable().default(null),
  excerpt: z.string().nullable().default(null),
  created_at: z.string(),
  updated_at: z.string(),
  category: z.string().nullable().default(null),
  tags: z.string().nullable().default(null),
  status: z.enum(["draft", "published"]).default("draft"),
  cover_image: z.string().nullable().default(null),
  author: z.string().nullable().default(null),
});
export type PostRow = z.infer<typeof PostRowSchema>;

/**
 * Domain object: parsed form, ready for the UI.
 * `tags` is `string[]` (parsed from the DB JSON string).
 * `content` is `unknown` — could be a parsed EditorJS object or the raw string.
 */
export const PostStatusSchema = z.enum(["draft", "published"]);

export const PostSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.any(),
  content_html: z.string().nullable(),
  excerpt: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  status: PostStatusSchema,
  cover_image: z.string().nullable(),
  author: z.string().nullable(),
});
export type Post = z.infer<typeof PostSchema>;

/**
 * Pagination parameters for the blog listing.
 * Defaults: page=0, pageSize=10, sortBy=created_at, order=DESC.
 */
export const PostPaginationParamsSchema = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["created_at", "updated_at", "title"]).default("created_at"),
  order: z.enum(["ASC", "DESC"]).default("DESC"),
  search: z.string().optional(),
});
export type PostPaginationParams = z.infer<typeof PostPaginationParamsSchema>;

/**
 * Single-slug query validator.
 * Accepts a non-empty slug consisting of lowercase letters, digits, and hyphens.
 */
export const PostSlugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");
export type PostSlug = z.infer<typeof PostSlugSchema>;

/**
 * Input for creating a new post (admin form).
 */
export const CreatePostInputSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200),
  slug: z.string().min(1, "Slug é obrigatório").max(200),
  content: z.unknown().optional(),
  content_html: z.string().optional(),
  excerpt: z.string().optional(),
  category: z.string().default("general"),
  tags: z.array(z.string()).default([]),
  status: PostStatusSchema.default("draft"),
  cover_image: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
});
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

/**
 * Pagination response envelope used by listing endpoints.
 */
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Result envelope for create-post (so we can return a typed error code).
 */
export type InsertResult =
  | { success: true; id: number; message: string }
  | { success: false; code: "SLUG_COLLISION" | "VALIDATION_ERROR" | "INTERNAL"; message: string };
