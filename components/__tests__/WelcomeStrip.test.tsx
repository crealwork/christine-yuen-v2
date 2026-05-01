import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import WelcomeStrip from "../WelcomeStrip";
import messages from "../../messages/en.json";

describe("WelcomeStrip", () => {
  it("renders wordmark and core nav links", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <WelcomeStrip />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Christine Yuen")).toBeInTheDocument();
    expect(screen.getByText("How I work")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });
});
