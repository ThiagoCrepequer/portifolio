import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { z } from "zod";

// Schema de validação para criação de post
export const CreatePostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  content: z
    .array(z.any())
    .optional()
    .transform((blocks) => (blocks ? JSON.stringify(blocks) : undefined)),
  category: z.string().default("general"),
  tags: z.array(z.string()).default([]),
  excerpt: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

/**
 * Cria um novo post (apenas funciona localmente)
 */
export const createPost = createServerFn({ method: 'POST' })
  .inputValidator((input: CreatePostInput) => {
    try {
      return CreatePostSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        throw new Error(`Validation error: ${messages}`);
      }
      throw new Error("Invalid input");
    }
  })
  .handler(async ({ data }) => {
    // Verificar se está em ambiente de desenvolvimento local
    const isDev = import.meta.env.DEV;
    
    if (!isDev) {
      throw new Error("Post creation is only available in development mode");
    }

    const { title, slug, content, category, tags, excerpt } = data;

    try {
      const now = new Date().toISOString();

      const result = await env.posts_database
        .prepare(
          `INSERT INTO post (title, slug, content, category, tags, excerpt, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(title, slug, content, category, JSON.stringify(tags), excerpt, now, now)
        .run();

      return {
        success: true,
        id: result.meta.last_row_id,
        message: "Post created successfully",
      };
    } catch (error) {
      console.error("Error creating post:", error);
      throw new Error("Failed to create post");
    }
  });
