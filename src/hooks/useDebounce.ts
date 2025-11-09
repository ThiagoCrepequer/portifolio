import { useState, useEffect } from "react";

/**
 * Hook de debounce que retorna um valor T após X segundos sem mudanças
 * @param value - Valor a ser debounceado
 * @param delay - Tempo em milissegundos antes de atualizar (padrão: 2000ms)
 * @returns Valor debounceado
 *
 * @example
 * ```tsx
 * const [searchText, setSearchText] = useState("");
 * const debouncedSearch = useDebounce(searchText, 500);
 *
 * useEffect(() => {
 *   // Chamará apenas 500ms após o usuário parar de digitar
 *   console.log("Searching for:", debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 2000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Criar um timeout que atualiza o valor debounceado
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpar o timeout anterior se o valor mudar novamente
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook de debounce com callback executado após o delay
 * Útil para operações como busca, filtro, salvo automático, etc
 *
 * @param value - Valor a ser debounceado
 * @param callback - Função chamada quando o debounce completa
 * @param delay - Tempo em milissegundos (padrão: 2000ms)
 *
 * @example
 * ```tsx
 * useDebounceCallback(searchText, (value) => {
 *   fetchSearchResults(value);
 * }, 500);
 * ```
 */
export function useDebounceCallback<T>(
  value: T,
  callback: (value: T) => void | Promise<void>,
  delay: number = 2000
): void {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, callback, delay]);
}

/**
 * Hook de debounce com loading state
 * Útil para mostrar estado de carregamento durante requisições
 *
 * @param value - Valor a ser debounceado
 * @param delay - Tempo em milissegundos (padrão: 2000ms)
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
  delay: number = 2000
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

/**
 * Hook de debounce com rastreamento de mudanças
 * Útil para detectar quando o valor realmente mudou após debounce
 *
 * @param value - Valor a ser debounceado
 * @param onDebounce - Callback chamado quando o valor é atualizado
 * @param delay - Tempo em milissegundos (padrão: 2000ms)
 * @returns Valor debounceado
 *
 * @example
 * ```tsx
 * const debouncedValue = useDebouncedSearch(search, (newValue) => {
 *   console.log("Search changed to:", newValue);
 *   analytics.trackSearch(newValue);
 * }, 300);
 * ```
 */
export function useDebouncedSearch<T>(
  value: T,
  onDebounce?: (value: T) => void,
  delay: number = 2000
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      onDebounce?.(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onDebounce]);

  return debouncedValue;
}

/**
 * Hook de debounce com histórico
 * Rastreia as mudanças anteriores do valor
 *
 * @param value - Valor a ser debounceado
 * @param delay - Tempo em milissegundos (padrão: 2000ms)
 * @param maxHistory - Número máximo de valores a guardar (padrão: 10)
 * @returns Objeto com valor debounceado e histórico
 *
 * @example
 * ```tsx
 * const { debouncedValue, history } = useDebouncedWithHistory(search, 500);
 *
 * return (
 *   <div>
 *     <input value={search} onChange={setSearch} />
 *     <RecentSearches items={history} />
 *   </div>
 * );
 * ```
 */
export function useDebouncedWithHistory<T>(
  value: T,
  delay: number = 2000,
  maxHistory: number = 10
): { debouncedValue: T; history: T[] } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [history, setHistory] = useState<T[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      
      // Adicionar ao histórico se o valor é diferente
      if (value !== debouncedValue) {
        setHistory((prev) => {
          const updated = [value, ...prev];
          // Limitar o tamanho do histórico
          return updated.slice(0, maxHistory);
        });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, debouncedValue, maxHistory]);

  return { debouncedValue, history };
}
