import React from 'react';
import Modal from '../../../components/ui/Modal';
import AIOverview from './AIOverview';

const AIAnalysisModal = ({ isOpen, onClose, job }) => {
  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`AI Analysis: ${job.title}`} size="xl">
      <div className="py-4">
        <AIOverview jobId={job._id} />
      </div>
    </Modal>
  );
};

export default AIAnalysisModal;
