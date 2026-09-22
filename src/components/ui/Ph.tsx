import { site } from "@/content/site";

/**
 * A visible [ADD …] marker for facts that haven't been confirmed yet.
 * Flip `site.showPlaceholders` to false to hide them all at once.
 */
export function Ph({ children, className }: { children: string; className?: string }) {
  if (!site.showPlaceholders) return null;
  return (
    <span className={className ? `ph ${className}` : "ph"} title="Placeholder — fill this in under src/content">
      [{children}]
    </span>
  );
}

/** Render `value`, or a placeholder when it's unknown. */
export function Known({ value, todo }: { value: string | number | null | undefined; todo: string }) {
  if (value === null || value === undefined || value === "") return <Ph>{todo}</Ph>;
  return <>{value}</>;
}
