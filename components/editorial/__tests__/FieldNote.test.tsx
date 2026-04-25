import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FieldNote from "../FieldNote";

describe("FieldNote", () => {
  it("renders the number marker, title, and body", () => {
    render(
      <FieldNote number={1} title="Deposit timing">
        When is each installment due?
      </FieldNote>
    );
    expect(screen.getByText("No. 01")).toBeInTheDocument();
    expect(screen.getByText("Deposit timing")).toBeInTheDocument();
    expect(screen.getByText("When is each installment due?")).toBeInTheDocument();
  });

  it("zero-pads single-digit numbers", () => {
    render(<FieldNote number={3} title="t">b</FieldNote>);
    expect(screen.getByText("No. 03")).toBeInTheDocument();
  });

  it("does not zero-pad two-digit numbers", () => {
    render(<FieldNote number={12} title="t">b</FieldNote>);
    expect(screen.getByText("No. 12")).toBeInTheDocument();
  });
});
