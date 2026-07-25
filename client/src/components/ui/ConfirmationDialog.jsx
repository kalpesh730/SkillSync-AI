import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-gray-600 mb-6">{message}</div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
