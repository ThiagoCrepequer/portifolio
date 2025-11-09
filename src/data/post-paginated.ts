import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { z } from "zod";

// Schema de validação com Zod
export const PostPaginationParamsSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["created_at", "updated_at", "title"]).default("created_at"),
  order: z.enum(["ASC", "DESC"]).default("DESC"),
});

export type PostPaginationParams = z.infer<typeof PostPaginationParamsSchema>;

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
 * Busca posts com paginação
 * @param page - Página atual (começa em 0)
 * @param pageSize - Quantidade de items por página (padrão: 10, máximo: 100)
 * @param sortBy - Campo para ordenação (padrão: created_at)
 * @param order - Ordem: ASC ou DESC (padrão: DESC)
 */
export const getPostPaginated = createServerFn()
  .inputValidator((input: unknown) => {
    try {
      return PostPaginationParamsSchema.parse(input);
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
    const { page, pageSize, sortBy, order, search } = data;
    const offset = page * pageSize;

    try {
      let countQuery = "SELECT COUNT(*) as count FROM post";
      let selectQuery = "SELECT * FROM post";
      const queryParams: unknown[] = [];

      // Se houver busca, usar FTS5
      if (search && search.trim()) {
        countQuery = `
          SELECT COUNT(*) as count FROM post 
          WHERE id IN (
            SELECT rowid FROM posts_fts 
            WHERE posts_fts MATCH ?
          )
        `;
        selectQuery = `
          SELECT post.* FROM post 
          WHERE post.id IN (
            SELECT rowid FROM posts_fts 
            WHERE posts_fts MATCH ?
          )
        `;
        queryParams.push(`${search.trim()}*`);
      }

      // Buscar total de posts
      const countResult = await env.posts_database
        .prepare(countQuery)
        .bind(...queryParams)
        .first<{ count: number }>();

      const totalItems = countResult?.count ?? 0;

      // Buscar posts da página
      const finalQuery = `
        ${selectQuery}
        ORDER BY ${sortBy} ${order} 
        LIMIT ? OFFSET ?
      `;
      
      const { results } = await env.posts_database
        .prepare(finalQuery)
        .bind(...queryParams, pageSize, offset)
        .all<Post>();

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        data: results ?? [],
        pagination: {
          currentPage: page,
          pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages - 1,
          hasPreviousPage: page > 0,
        },
      } as PaginationResponse<Post>;
    } catch (error) {
      console.error("Error fetching paginated posts:", error);
      throw new Error("Failed to fetch posts");
    }
  });
