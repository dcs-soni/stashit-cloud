const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateRandomString = (length: number): string =>
  Array.from({ length }, () =>
    CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)),
  ).join("");
