export const getFirstName = (name: string) => {
  let firstName = '';

  for (const char of name) {
    if (char === ' ') return firstName;
    firstName += char;
  }

  return firstName;
};
