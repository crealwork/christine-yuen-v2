import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DropCap from "../DropCap";

describe("DropCap", () => {
  it("wraps the first letter in a styled span and renders the rest of the paragraph", () => {
    render(<DropCap>Insider knowledge from MLA Canada.</DropCap>);
    const cap = screen.getByText("I");
    expect(cap.tagName).toBe("SPAN");
    expect(cap.className).toContain("drop-cap");
    expect(screen.getByText(/nsider knowledge from MLA Canada\./)).toBeInTheDocument();
  });

  it("returns the paragraph unchanged if children is an empty string", () => {
    const { container } = render(<DropCap>{""}</DropCap>);
    expect(container.querySelector(".drop-cap")).toBeNull();
  });
});
