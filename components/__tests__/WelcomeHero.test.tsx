import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import WelcomeHero from "../../components/sections/WelcomeHero";
import messages from "../../messages/en.json";

describe("WelcomeHero", () => {
  it("renders greeting, subheadline, CTAs, and portrait", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <WelcomeHero />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Hi, I'm Christine.")).toBeInTheDocument();
    expect(screen.getByText("Let's talk about your move.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Schedule a chat/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read about my process/ })).toBeInTheDocument();
    expect(screen.getByAltText(/Christine Yuen/)).toBeInTheDocument();
  });
});
