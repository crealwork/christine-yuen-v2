import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TableOfContents from "../TableOfContents";

describe("TableOfContents", () => {
  it("renders entries with zero-padded numbers and anchor links", () => {
    render(
      <TableOfContents
        entries={[
          { num: 1, label: "Editor's Note", href: "#editor-note" },
          { num: 2, label: "Field Notes", href: "#field-notes" },
        ]}
      />
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Editor's Note")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Editor's Note/ })).toHaveAttribute("href", "#editor-note");
  });
});
