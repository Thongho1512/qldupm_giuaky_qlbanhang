/**
 * Format number to Vietnamese currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format number to Vietnamese currency without symbol
 * @param amount - Amount to format
 * @returns Formatted number string
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

/**
 * Parse currency string to number
 * @param currency - Currency string
 * @returns Parsed number
 */
export const parseCurrency = (currency: string): number => {
  return Number(currency.replace(/[^0-9.-]+/g, ''));
};