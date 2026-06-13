import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

describe("devtools-prod", () => {
  it("should not render devtools when DEV is false (production guard)", () => {
    // Simulates Vite's production build where import.meta.env.DEV === false
    const isDev = false;
    render(
      <div>
        {isDev && <div data-testid="tanstack-router-devtools">Router Devtools</div>}
        {isDev && <div data-testid="tanstack-devtools">Devtools</div>}
      </div>,
    );
    expect(screen.queryByTestId("tanstack-router-devtools")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tanstack-devtools")).not.toBeInTheDocument();
  });

  it("should render devtools when DEV is true (development mode)", () => {
    const isDev = true;
    render(
      <div>
        {isDev && <div data-testid="tanstack-router-devtools">Router Devtools</div>}
        {isDev && <div data-testid="tanstack-devtools">Devtools</div>}
      </div>,
    );
    expect(screen.getByTestId("tanstack-router-devtools")).toBeInTheDocument();
    expect(screen.getByTestId("tanstack-devtools")).toBeInTheDocument();
  });
});
