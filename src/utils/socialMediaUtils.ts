export const formatInstagramUrl = (username: string): string => {
  // Remove @ symbol if present
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  return `https://instagram.com/${cleanUsername}`;
};

export const isInstagramUsername = (text: string): boolean => {
  // Basic validation for Instagram usernames
  // Allows letters, numbers, periods, and underscores, with optional @ prefix
  const usernameRegex = /^@?[a-zA-Z0-9._]{1,30}$/;
  return usernameRegex.test(text);
};