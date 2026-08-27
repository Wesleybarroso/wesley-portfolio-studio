export type PreviewVariant = "featured" | "catalog";

/**
 * As prévias do catálogo precisam iniciar ao abrir a lista: em mobile, a área
 * do catálogo pode ficar fora do limiar de lazy loading antes do timeout.
 */
export function getPreviewLoadingStrategy(variant: PreviewVariant): "eager" | "lazy" {
  return variant === "catalog" ? "eager" : "lazy";
}
