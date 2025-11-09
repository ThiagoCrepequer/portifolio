import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getPostFromSlug } from "@/data/post";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EDITOR_JS_TOOLS } from "@/lib/editorTools";
import { createReactEditorJS } from "react-editor-js";

const ReactEditorJS = createReactEditorJS();

export const Route = createFileRoute("/blog/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => await getPostFromSlug({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title} - Thiago Crepquer`,
        description: loaderData?.content.slice(0, 160) || "",
      },
    ],
  }),
});

function RouteComponent() {
  const post = Route.useLoaderData();

  return (
    <section className="py-20">
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/blog">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-6">
          <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>

          <ReactEditorJS
            readOnly
            hideToolbar
            holder="holder"
            tools={EDITOR_JS_TOOLS}
            defaultValue={{
              time: Date.now(),
              blocks: JSON.parse(post?.content || "{}"),
              version: "2.26.5",
            }}
          />
        </div>
      </div>
    </section>
  );
}
