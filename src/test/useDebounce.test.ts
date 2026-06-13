import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "@/hooks/useDebounce";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "hello", delay: 500 } },
    );

    expect(result.current.debouncedValue).toBe("hello");
  });

  it("should update value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    );

    rerender({ value: "updated", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.debouncedValue).toBe("updated");
  });

  it("should only emit the last value on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "a", delay: 500 } },
    );

    rerender({ value: "b", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "c", delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "d", delay: 500 });

    // Only 400ms have elapsed since the change to "d"
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current.debouncedValue).toBe("a");

    // Cross the 500ms threshold
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.debouncedValue).toBe("d");
  });

  it("should set isLoading true while waiting and false after update", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: "first", delay: 500 } },
    );

    // Change the value — triggers a new debounce cycle
    rerender({ value: "second", delay: 500 });
    expect(result.current.isLoading).toBe(true);

    // After the delay completes
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.debouncedValue).toBe("second");
  });
});
