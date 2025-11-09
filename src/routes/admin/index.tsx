import { AdminPostForm } from "@/components/AdminPostForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    // Verificar se está em desenvolvimento local
    if (!import.meta.env.DEV) {
      throw new Error("Admin page is only available in development mode");
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="py-20">
      <div className="h-16"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Criar Novo Post</h1>
        <AdminPostForm />
      </div>
    </section>
  );
}
