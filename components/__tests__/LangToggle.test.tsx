import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

vi.mock("@/i18n/routing", () => ({
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn() }),
}));

import LangToggle from "../LangToggle";

describe("LangToggle", () => {
  it("does not render the KO option when SHOW_KOREAN is false (v1 default)", () => {
    render(<LangToggle />);
    expect(screen.queryByText("KO")).toBeNull();
    expect(screen.queryByText("EN")).toBeNull();
  });
});
