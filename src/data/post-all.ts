import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";

export const getAllPosts = createServerFn({
  method: "GET",
}).handler(async () => {
  const results = await env.posts_database.prepare("SELECT * FROM post").all();
  return results.results as Post[];
});
