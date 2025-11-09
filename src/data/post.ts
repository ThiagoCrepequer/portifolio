import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const getPostFromSlug = createServerFn()
  .inputValidator((id: string) => {
    if (typeof id === "string") return id;
    throw new Error("Invalid id");
  })
  .handler(async ({ data: id }) => {
    const results = await env.posts_database
      .prepare("SELECT * FROM post WHERE slug = ?")
      .bind(id)
      .first<Post>();
    return results;
  });
