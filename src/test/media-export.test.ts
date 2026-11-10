import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  exportOrShareImage,
  isAndroidDevice,
  isIOSDevice,
  type ExportAction,
} from "../lib/media-export";

describe("media-export device detection & direct download", () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
  });

  it("detects Android user agents correctly", () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      configurable: true,
    });
    expect(isAndroidDevice()).toBe(true);
    expect(isIOSDevice()).toBe(false);
  });

  it("detects iOS user agents correctly", () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      configurable: true,
    });
    expect(isAndroidDevice()).toBe(false);
    expect(isIOSDevice()).toBe(true);
  });

  it("triggers direct download on Android instead of navigator.share", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      configurable: true,
    });

    const shareMock = vi.fn().mockResolvedValue(undefined);
    const canShareMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      configurable: true,
    });
    Object.defineProperty(navigator, "canShare", {
      value: canShareMock,
      configurable: true,
    });

    // Mock fetch for dataUrlToBlob
    const mockBlob = new Blob(["test"], { type: "image/png" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    } as any);

    // Mock createObjectURL & revokeObjectURL
    const mockCreateObjectURL = vi.fn().mockReturnValue("blob:http://localhost/test-blob");
    const mockRevokeObjectURL = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;

    // Spy on document.createElement to check anchor download
    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === "a") {
        el.click = clickMock;
      }
      return el;
    });

    const result = await exportOrShareImage({
      dataUrl: "data:image/png;base64,fake",
      filename: "test-photo.png",
    });

    // On Android, navigator.share should NOT have been invoked
    expect(shareMock).not.toHaveBeenCalled();
    // Anchor download should have been triggered
    expect(clickMock).toHaveBeenCalled();
    expect(result).toBe("downloaded");
  });

  it("allows navigator.share on iOS when supported", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      configurable: true,
    });

    const shareMock = vi.fn().mockResolvedValue(undefined);
    const canShareMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      configurable: true,
    });
    Object.defineProperty(navigator, "canShare", {
      value: canShareMock,
      configurable: true,
    });

    const mockBlob = new Blob(["test"], { type: "image/png" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    } as any);

    const result = await exportOrShareImage({
      dataUrl: "data:image/png;base64,fake",
      filename: "test-photo.png",
    });

    expect(shareMock).toHaveBeenCalled();
    expect(result).toBe("shared");
  });

  it("respects explicit action: 'download' even if native share is supported", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      configurable: true,
    });

    const shareMock = vi.fn().mockResolvedValue(undefined);
    const canShareMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      configurable: true,
    });
    Object.defineProperty(navigator, "canShare", {
      value: canShareMock,
      configurable: true,
    });

    const mockBlob = new Blob(["test"], { type: "image/png" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    } as any);

    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === "a") {
        el.click = clickMock;
      }
      return el;
    });

    const result = await exportOrShareImage({
      dataUrl: "data:image/png;base64,fake",
      filename: "test-photo.png",
      action: "download",
    });

    expect(shareMock).not.toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(result).toBe("downloaded");
  });

  it("respects explicit action: 'share' on Android when user explicitly wants to share", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      configurable: true,
    });

    const shareMock = vi.fn().mockResolvedValue(undefined);
    const canShareMock = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "share", {
      value: shareMock,
      configurable: true,
    });
    Object.defineProperty(navigator, "canShare", {
      value: canShareMock,
      configurable: true,
    });

    const mockBlob = new Blob(["test"], { type: "image/png" });
    globalThis.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    } as any);

    const result = await exportOrShareImage({
      dataUrl: "data:image/png;base64,fake",
      filename: "test-photo.png",
      action: "share",
    });

    expect(shareMock).toHaveBeenCalled();
    expect(result).toBe("shared");
  });
});
