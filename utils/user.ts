/**
 * Extracts and formats the user's first name only.
 * Supports user objects with firstName, first_name, fullName, name, email, etc.
 * Or raw strings.
 */
export function extractFirstName(input: any): string {
  if (!input) return "";

  let raw = "";
  if (typeof input === "object") {
    raw =
      input.firstName ||
      input.first_name ||
      input.fullName ||
      input.name ||
      input.username ||
      input.email ||
      "";
  } else {
    raw = String(input);
  }

  if (!raw) return "";

  // If it's an email, take the portion before @
  if (raw.includes("@")) {
    raw = raw.split("@")[0];
  }

  // Replace separators (dots, underscores, dashes) with spaces
  raw = raw.replace(/[._-]/g, " ").trim();

  // Extract the first word only
  const firstWord = raw.split(/\s+/)[0] || "";
  if (!firstWord) return "";

  // Capitalize first character
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
}
