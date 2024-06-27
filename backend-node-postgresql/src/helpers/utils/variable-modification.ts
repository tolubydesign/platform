
/**
 * @description Remove unnecessary text characters and spacing. 
 * @param text 
 * @returns text
 */
export function removeSpacing(text: string | undefined): string | undefined {
  if (!text) return undefined;
  // Regex below remove new lines (\n) and double spaces (  ).
  return text.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, "").trim()
}
