'use client';

import { useState, useCallback } from 'react';

interface UseDisclosureProps {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setIsOpen: (value: boolean) => void;
}

/**
 * Custom hook for managing disclosure state (modals, drawers, etc.)
 * @param options - Configuration options
 * @returns Disclosure state and handlers
 */
export function useDisclosure({
  defaultOpen = false,
  onOpen,
  onClose,
}: UseDisclosureProps = {}): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
