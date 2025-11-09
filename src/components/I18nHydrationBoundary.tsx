import React from "react";

/**
 * Wrapper para evitar o "flicker" de idioma ao carregar a página
 * Este componente apenas renderiza o conteúdo após a inicialização completa
 */
export const I18nHydrationBoundary: React.FC<{
  children: React.ReactNode;
  isReady: boolean;
}> = ({ children, isReady }) => {
  // Injetar um style que oculta o conteúdo até estar pronto
  React.useEffect(() => {
    if (isReady) {
      const style = document.getElementById("i18n-loading-style");
      if (style) {
        style.remove();
      }
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
};
