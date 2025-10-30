import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format date to Vietnamese format (dd/MM/yyyy)
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: vi });
  } catch (error) {
    return '';
  }
};

/**
 * Format datetime to Vietnamese format (dd/MM/yyyy HH:mm)
 * @param date - Date string or Date object
 * @returns Formatted datetime string
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: vi });
  } catch (error) {
    return '';
  }
};

/**
 * Format date to relative time (e.g., "2 giờ trước")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: vi });
  } catch (error) {
    return '';
  }
};

/**
 * Format date to ISO string for API
 * @param date - Date object
 * @returns ISO date string
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse date string to Date object
 * @param dateString - Date string
 * @returns Date object
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  try {
    return parseISO(dateString);
  } catch (error) {
    return null;
  }
};