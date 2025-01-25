export function isValidTextFile(data: string) {
  // Check if the file contains only printable characters
  const printableRegex = /^[\s\x21-\x7E\xA0-\uD7FF\uE000-\uFFFD]*$/u;
  return printableRegex.test(data);
}
