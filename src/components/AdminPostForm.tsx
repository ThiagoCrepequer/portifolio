import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPost } from "@/data/post-create";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "@/lib/editorTools";

const ReactEditorJS = createReactEditorJS();

interface EditorCore {
  save(): Promise<{ blocks: Array<{ type: string; data: object }> }>;
  clear(): Promise<void>;
}

export function AdminPostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "general",
    tags: "",
  });
  const editorCore = useRef<EditorCore | null>(null);

  // Função para converter texto em slug URL-safe
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/-+/g, "-"); // Remove múltiplos hífens
  };

  // Função para extrair o primeiro parágrafo dos blocos
  const extractFirstParagraph = (
    blocks: Array<{ type: string; data: object }>
  ): string => {
    for (const block of blocks) {
      if (block.type === "paragraph") {
        const data = block.data as { text?: string };
        if (data.text) {
          // Remove tags HTML e limita a 160 caracteres
          return data.text
            .replace(/<[^>]*>/g, "") // Remove tags HTML
            .trim();
        }
      }
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      // Se o título foi alterado, atualiza o slug automaticamente
      if (name === "title") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleInitialize = (editor: EditorCore) => {
    editorCore.current = editor;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title.trim()) {
        toast.error("Título é obrigatório");
        setIsLoading(false);
        return;
      }
      if (!formData.slug.trim()) {
        toast.error("Slug é obrigatório");
        setIsLoading(false);
        return;
      }
      if (!editorCore.current) {
        toast.error("Editor não foi inicializado");
        setIsLoading(false);
        return;
      }

      const savedData = await editorCore.current.save();
      if (!savedData.blocks || savedData.blocks.length === 0) {
        toast.error("Conteúdo é obrigatório");
        setIsLoading(false);
        return;
      }

      const tagsArray = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];

      const excerpt = extractFirstParagraph(savedData.blocks);

      await createPost({
        data: {
          title: formData.title,
          slug: formData.slug,
          // @ts-ignore
          content: savedData.blocks,
          category: formData.category,
          tags: tagsArray,
          excerpt,
        },
      });

      toast.success("Post criado com sucesso!");
      setFormData({
        title: "",
        slug: "",
        category: "general",
        tags: "",
      });
      if (editorCore.current) {
        await editorCore.current.clear();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao criar post"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <ReactEditorJS
        placeholder="Escreva o conteúdo do post aqui..."
        holder="asd"
        onInitialize={handleInitialize}
        tools={EDITOR_JS_TOOLS}
        defaultValue={{
          time: Date.now(),
          blocks: [],
          version: "2.26.5",
        }}
      />

      <div>
        <label className="block text-sm font-medium mb-2">Título</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título do post"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <Input
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="url-do-post"
          disabled={isLoading}
          title="Gerado automaticamente a partir do título"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Categoria</label>
        <Input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="general"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tags (separadas por vírgula)
        </label>
        <Input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="tag1, tag2, tag3"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Criando..." : "Criar Post"}
      </Button>
    </form>
  );
}
