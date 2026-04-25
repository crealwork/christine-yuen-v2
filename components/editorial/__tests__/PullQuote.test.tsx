import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PullQuote from "../PullQuote";

describe("PullQuote", () => {
  it("renders the quote text and attribution with em-dash separator", () => {
    render(<PullQuote attribution="from the field notes">The details matter.</PullQuote>);
    expect(screen.getByText("The details matter.")).toBeInTheDocument();
    expect(screen.getByText(/—\s*from the field notes/)).toBeInTheDocument();
  });

  it("omits attribution when not provided", () => {
    render(<PullQuote>Quiet detail.</PullQuote>);
    expect(screen.queryByText(/—/)).toBeNull();
  });
});
