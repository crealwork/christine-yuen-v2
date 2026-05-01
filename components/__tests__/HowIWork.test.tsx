import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import HowIWork from "../../components/sections/HowIWork";
import messages from "../../messages/en.json";

describe("HowIWork", () => {
  it("renders 4 numbered service tiles", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HowIWork />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("First conversation")).toBeInTheDocument();
    expect(screen.getByText("Market read")).toBeInTheDocument();
    expect(screen.getByText("Offer & close")).toBeInTheDocument();
    expect(screen.getByText("After the move")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });
});
