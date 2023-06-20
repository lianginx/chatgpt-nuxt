export const trimPrompt = (input: string) => {
  return input
    .split("\n")
    .map((line) => line.trim()) // Removing leading whitespace characters.
    .join("\n")
    .trim(); // Removing the first/last empty line.
};
