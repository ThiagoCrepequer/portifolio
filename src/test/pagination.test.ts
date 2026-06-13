import { describe, expect, it } from "vitest";
import { paginate } from "@/lib/pagination";

describe("paginate", () => {
  it("returns [1] when total is 1", () => {
    expect(paginate(1, 1)).toEqual([1]);
  });

  it("returns [1, 2] for total 2 current 1", () => {
    expect(paginate(1, 2)).toEqual([1, 2]);
  });

  it("clamps current below 1", () => {
    expect(paginate(0, 5)).toEqual([1, 2, 3, "ellipsis", 5]);
  });

  it("clamps current above total", () => {
    expect(paginate(999, 5)).toEqual([1, "ellipsis", 3, 4, 5]);
  });

  it("returns empty array when total is 0", () => {
    expect(paginate(1, 0)).toEqual([]);
  });

  describe("siblingCount = 1", () => {
    it("total 10 current 1 shows first 3 pages then ellipsis", () => {
      expect(paginate(1, 10, 1)).toEqual([1, 2, 3, "ellipsis", 10]);
    });

    it("total 10 current 5 shows sliding window with both ellipses", () => {
      expect(paginate(5, 10, 1)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
    });

    it("total 10 current 10 shows ellipsis then last 3 pages", () => {
      expect(paginate(10, 10, 1)).toEqual([1, "ellipsis", 8, 9, 10]);
    });
  });

  describe("siblingCount = 2", () => {
    it("total 20 current 10 shows wider window", () => {
      expect(paginate(10, 20, 2)).toEqual([
        1,
        "ellipsis",
        8,
        9,
        10,
        11,
        12,
        "ellipsis",
        20,
      ]);
    });
  });
});
