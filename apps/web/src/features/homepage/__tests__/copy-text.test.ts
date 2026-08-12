import { describe, expect, it, vi } from "vitest";
import { copyText } from "../../../lib/copy-text";

describe("homepage clipboard behavior", () => {
  it("starts the Clipboard API and synchronous fallback inside the same user activation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const fallback = vi.fn(() => false);

    await expect(copyText("install", { writeText, fallback })).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("install");
    expect(fallback).toHaveBeenCalledWith("install");
  });

  it("falls back when the Clipboard API rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    const fallback = vi.fn(() => true);

    await expect(copyText("install", { writeText, fallback })).resolves.toBe(true);
    expect(fallback).toHaveBeenCalledWith("install");
  });

  it("reports failure instead of rejecting when neither copy path works", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    const fallback = vi.fn(() => false);

    await expect(copyText("install", { writeText, fallback })).resolves.toBe(false);
  });

  it("falls back when a Clipboard API write stalls", async () => {
    const writeText = vi.fn(() => new Promise<void>(() => undefined));
    const fallback = vi.fn(() => true);

    await expect(copyText("install", { writeText, fallback, timeoutMs: 5 })).resolves.toBe(true);
    expect(fallback).toHaveBeenCalledWith("install");
  });
});
