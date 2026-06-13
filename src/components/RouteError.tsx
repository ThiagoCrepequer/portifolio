import { Link } from "@tanstack/react-router";

interface RouteErrorProps {
  error: unknown;
  reset?: () => void;
}

export function RouteError({ error }: RouteErrorProps) {
  const message =
    error instanceof Error ? error.message : "Algo deu errado";

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-foreground mb-4">Erro</h1>
      <p className="text-muted-foreground mb-6 font-mono text-sm max-w-xl">
        {message}
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-accent-foreground bg-accent rounded-lg hover:bg-accent/90 transition-colors"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
