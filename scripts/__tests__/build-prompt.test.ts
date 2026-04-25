import { describe, it, expect } from "vitest";
import { buildPrompt } from "../generate-images";

describe("buildPrompt", () => {
  it("prepends the style preset followed by two newlines and the image prompt", () => {
    expect(buildPrompt("STYLE", "subject details")).toBe("STYLE\n\nsubject details");
  });
});
