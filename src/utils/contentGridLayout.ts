/**
 * Column count for a viewport width. Must stay in sync with `.content-grid`
 * @media rules in `App.css` (480 / 768 / 1200 breakpoints).
 */
export function contentGridColumnCountForViewportWidth(width: number): number {
  if (width <= 480) return 1;
  if (width <= 768) return 2;
  if (width <= 1200) return 3;
  return 4;
}
