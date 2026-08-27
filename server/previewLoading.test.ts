import { describe, expect, it } from "vitest";
import { getPreviewLoadingStrategy } from "../client/src/lib/previewLoading";

describe("getPreviewLoadingStrategy", () => {
  it("inicia imediatamente as prévias do catálogo para evitar fallback prematuro em mobile", () => {
    expect(getPreviewLoadingStrategy("catalog")).toBe("eager");
  });

  it("mantém lazy loading para a única prévia do card em destaque", () => {
    expect(getPreviewLoadingStrategy("featured")).toBe("lazy");
  });
});
