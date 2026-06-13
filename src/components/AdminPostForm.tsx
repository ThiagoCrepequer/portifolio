import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createReactEditorJS } from "react-editor-js";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createPost } from "@/data/post-create";
import { EDITOR_JS_TOOLS } from "@/lib/editorTools";
import { type CreatePostInput, type InsertResult } from "@/data/posts/schemas";
import { slugify } from "@/lib/slugify";
import { extractExcerpt } from "@/lib/editorJs";
import { renderBlocksToHtml } from "@/lib/editorJsServer";

const ReactEditorJS = createReactEditorJS();

type EditorBlock = { type: string; data: Record<string, unknown> };
interface EditorCore {
  save(): Promise<{ blocks: EditorBlock[] }>;
  clear(): Promise<void>;
}

/** Form values for react-hook-form. `tags` is a comma-separated string in the UI,
 *  split into `string[]` on submit. */
type FormValues = {
  title: string;
  slug: string;
  category: string;
  tags: string;
};

const splitTags = (raw: string | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

export function AdminPostForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: "", slug: "", category: "general", tags: "" },
  });

  const title = watch("title") ?? "";
  const editorRef = useRef<EditorCore | null>(null);

  // Auto-generate the slug whenever the title changes.
  useEffect(() => {
    setValue("slug", slugify(title), { shouldValidate: false, shouldDirty: true });
  }, [title, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    if (!editorRef.current) {
      toast.error("Editor não foi inicializado");
      return;
    }
    const saved = await editorRef.current.save();
    const blocks: EditorBlock[] = Array.isArray(saved?.blocks) ? saved.blocks : [];
    if (blocks.length === 0) {
      toast.error("Conteúdo é obrigatório");
      return;
    }
    const tags = splitTags(values.tags);
    const excerpt = extractExcerpt(blocks, 160);
    const content_html = renderBlocksToHtml(blocks);

    const payload: CreatePostInput = {
      title: values.title,
      slug: values.slug,
      content: blocks,
      content_html,
      excerpt,
      category: values.category || "general",
      tags,
      status: "draft",
    };

    let result: InsertResult;
    try {
      result = await createPost({ data: payload });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao criar post");
      return;
    }

    if (!result.success) {
      if (result.code === "SLUG_COLLISION") {
        setError("slug", { type: "server", message: result.message });
        toast.error(result.message);
        return;
      }
      toast.error(result.message);
      return;
    }

    toast.success("Post criado com sucesso!");
    if (editorRef.current) {
      await editorRef.current.clear();
    }
    reset({ title: "", slug: "", category: "general", tags: "" });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <ReactEditorJS
        placeholder="Escreva o conteúdo do post aqui..."
        holder="admin-editor"
        onInitialize={(editor: EditorCore) => {
          editorRef.current = editor;
        }}
        tools={EDITOR_JS_TOOLS}
        defaultValue={{
          time: Date.now(),
          blocks: [],
          version: "2.26.5",
        }}
      />

      <div>
        <label htmlFor="admin-title" className="block text-sm font-medium mb-2">
          Título
        </label>
        <Input
          id="admin-title"
          {...register("title")}
          disabled={isSubmitting}
          placeholder="Título do post"
        />
        {errors.title && <p role="alert" className="text-sm text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="admin-slug" className="block text-sm font-medium mb-2">
          Slug
        </label>
        <Input
          id="admin-slug"
          {...register("slug")}
          disabled={isSubmitting}
          placeholder="url-do-post"
          title="Gerado automaticamente a partir do título"
        />
        {errors.slug && <p role="alert" className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
      </div>

      <div>
        <label htmlFor="admin-category" className="block text-sm font-medium mb-2">
          Categoria
        </label>
        <Input
          id="admin-category"
          {...register("category")}
          disabled={isSubmitting}
          placeholder="general"
        />
      </div>

      <div>
        <label htmlFor="admin-tags" className="block text-sm font-medium mb-2">
          Tags (separadas por vírgula)
        </label>
        <Input
          id="admin-tags"
          {...register("tags")}
          disabled={isSubmitting}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar Post"}
      </Button>
    </form>
  );
}
