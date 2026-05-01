import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import HospitalityFooter from "../HospitalityFooter";
import messages from "../../messages/en.json";

describe("HospitalityFooter", () => {
  it("renders license, brokerage, and IG handle", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HospitalityFooter />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(/BCFSA RE611159/)).toBeInTheDocument();
    expect(screen.getByText(/Grand Central Realty/)).toBeInTheDocument();
    expect(screen.getByText(/@christine\.604realtor/)).toBeInTheDocument();
  });
});
