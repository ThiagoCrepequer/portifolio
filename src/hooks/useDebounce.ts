import { useState, useEffect } from "react";

/**
 * Hook de debounce com loading state
 * Retorna um valor após um delay sem mudanças, além de um flag de loading
 *
 * @param value - Valor a ser debounceado
 * @param delay - Tempo em milissegundos antes de atualizar (padrão: 2000ms)
 * @returns Objeto com valor debounceado e estado de carregamento
 *
 * @example
 * ```tsx
 * const { debouncedValue, isLoading } = useDebouncedValue(searchText, 500);
 *
 * return (
 *   <div>
 *     {isLoading && <Spinner />}
 *     <Results query={debouncedValue} />
 *   </div>
 * );
 * ```
 */
export function useDebouncedValue<T>(
  value: T,
  delay: number = 2000,
): { debouncedValue: T; isLoading: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsLoading(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [value, delay]);

  return { debouncedValue, isLoading };
}
