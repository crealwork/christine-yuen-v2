import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FigureWithCaption from "../FigureWithCaption";

describe("FigureWithCaption", () => {
  it("renders an image with alt text and italic caption", () => {
    render(<FigureWithCaption src="/x.jpg" alt="arch" caption="On a site visit." />);
    const img = screen.getByAltText("arch");
    expect(img.getAttribute("src")).toContain("x.jpg");
    expect(screen.getByText("On a site visit.")).toBeInTheDocument();
  });
});
