import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onOpenChange, onConfirm }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md">
        <Dialog.Title className="text-lg font-bold">Confirm Deletion</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete this item? This action cannot be undone.
        </Dialog.Description>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteConfirmationDialog;