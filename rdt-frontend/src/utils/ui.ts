/* eslint-disable no-restricted-globals */

import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * @param inputs - Class values to merge.
 * @returns Merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Unified UI Utility for interactions.
 */
export const ui = {
  /**
   * Show a success toast.
   * @param message - The success message to display.
   */
  success: (message: string) => {
    toast.success(message);
  },

  /**
   * Show an error toast.
   * @param message - The error message to display.
   */
  error: (message: string) => {
    toast.error(message);
  },

  /**
   * Show a warning toast.
   * @param message - The warning message to display.
   */
  warning: (message: string) => {
    toast.warning(message);
  },

  /**
   * Show an info toast.
   * @param message - The info message to display.
   */
  info: (message: string) => {
    toast.info(message);
  },

  /**
   * Show a loading toast.
   * @param message - The loading message to display.
   * @returns The toast ID.
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a toast.
   * @param toastId - Optional toast ID to dismiss. If not provided, dismisses all.
   */
  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Confirm dialog (Browser native for now, can be replaced with custom modal later).
   * @param message - The confirmation message.
   * @returns True if confirmed, false otherwise.
   */
  confirm: (message: string): boolean => {
    return globalThis.confirm(message);
  },

  /**
   * Alert dialog (Browser native for now).
   * @param message - The alert message.
   */
  alert: (message: string): void => {
    globalThis.alert(message);
  },

  /**
   * Prompt dialog (Browser native for now).
   * @param message - The prompt message.
   * @param _default - Optional default value.
   * @returns The user input or null if cancelled.
   */
  prompt: (message: string, _default?: string): string | null => {
    return globalThis.prompt(message, _default);
  },

  /**
   * Native Notification.
   * @param title - The notification title.
   * @param options - Notification options.
   */
  notify: (title: string, options?: NotificationOptions) => {
    if (!('Notification' in globalThis)) {
      console.warn('This browser does not support desktop notification');
      return;
    }
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      void Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, options);
        }
      });
    }
  },
};
