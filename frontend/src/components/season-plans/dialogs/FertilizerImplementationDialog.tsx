import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface FertilizerImplementationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fertilizerData: {
    appliedDate: string;
    notes: string;
  };
  onSave: () => void;
  onChange: (field: string, value: string) => void;
}

const FertilizerImplementationDialog: React.FC<FertilizerImplementationDialogProps> = ({
  open,
  onOpenChange,
  fertilizerData,
  onSave,
  onChange,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md">
        <Dialog.Title className="text-lg font-bold">Fertilizer Implementation</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-gray-600">
          Provide details for the fertilizer application.
        </Dialog.Description>
        <div className="mt-4 space-y-4">
          <label>
            Applied Date:
            <input
              type="date"
              value={fertilizerData.appliedDate}
              onChange={(e) => onChange('appliedDate', e.target.value)}
              className="block w-full border rounded p-2"
            />
          </label>
          <label>
            Notes:
            <textarea
              value={fertilizerData.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              className="block w-full border rounded p-2"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onSave}>
            Save
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FertilizerImplementationDialog;