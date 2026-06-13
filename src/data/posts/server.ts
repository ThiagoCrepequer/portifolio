import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import {
  PostSlugSchema,
  PostPaginationParamsSchema,
  CreatePostInputSchema,
} from "./schemas";
import { createPostRepo } from "./repository";

/**
 * Server functions for the blog. Each wraps a `createPostRepo(env.posts_database)`
 * call. Routed through the `data/posts/server` module so consumers import from
 * one place; legacy paths (`@/data/post-paginated` etc.) re-export from here.
 */

export const getPostFromSlug = createServerFn()
  .inputValidator((input: unknown) => {
    if (typeof input !== "string") {
      throw new Error("Invalid slug: expected string");
    }
    return PostSlugSchema.parse(input);
  })
  .handler(async ({ data }) => {
    const repo = createPostRepo(env.posts_database);
    return repo.findBySlug(data);
  });

export const getAllPosts = createServerFn({ method: "GET" }).handler(async () => {
  const repo = createPostRepo(env.posts_database);
  return repo.findAll();
});

export const getPostPaginated = createServerFn()
  .inputValidator((input: unknown) => {
    if (input == null || typeof input !== "object") {
      throw new Error("Invalid input: expected object");
    }
    return PostPaginationParamsSchema.parse(input);
  })
  .handler(async ({ data }) => {
    const repo = createPostRepo(env.posts_database);
    return repo.findPaginated(data);
  });

export const createPost = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (input == null || typeof input !== "object") {
      throw new Error("Invalid input: expected object");
    }
    return CreatePostInputSchema.parse(input);
  })
  .handler(async ({ data }) => {
    if (!import.meta.env.DEV) {
      return {
        success: false as const,
        code: "VALIDATION_ERROR" as const,
        message: "Post creation is only available in development mode",
      };
    }
    const repo = createPostRepo(env.posts_database);
    return repo.insert(data);
  });
