/**
 * Validate Vietnamese phone number
 * @param phone - Phone number
 * @returns true if valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate email
 * @param email - Email address
 * @returns true if valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username
 * @param username - Username
 * @returns true if valid
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

/**
 * Validate password strength
 * @param password - Password
 * @returns true if valid
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate file type
 * @param file - File object
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if valid
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param file - File object
 * @param maxSize - Max size in bytes
 * @returns true if valid
 */
export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * Get file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate image file
 * @param file - File object
 * @returns Error message or null if valid
 */
export const validateImageFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!isValidFileType(file, allowedTypes)) {
    return 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)';
  }

  if (!isValidFileSize(file, maxSize)) {
    return `Kích thước file không được vượt quá ${formatFileSize(maxSize)}`;
  }

  return null;
};