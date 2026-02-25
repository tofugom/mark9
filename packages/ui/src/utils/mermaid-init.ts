/**
 * Shared mermaid initialization — single source of truth for config.
 *
 * Import this module wherever mermaid is used to ensure consistent
 * initialization with secure defaults.
 */
import mermaid from "mermaid";

/** Maximum diagram source size (50KB) to prevent DoS via complex diagrams. */
export const MERMAID_MAX_SIZE = 50_000;

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "strict",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
});

export { mermaid };
