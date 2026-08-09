import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useCertificationStore } from '../../../store/certificationStore';
import CertificationCard from './CertificationCard';
import CertificationForm from './CertificationForm';
import Modal from '../../../components/ui/Modal';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CertificationList = () => {
  const { certifications, isLoading, fetchMyCertifications, createCertification, updateCertification, deleteCertification } = useCertificationStore();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Active, Expired, No Expiry
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical

  useEffect(() => {
    fetchMyCertifications();
  }, [fetchMyCertifications]);

  const handleAddClick = () => {
    setEditingCertification(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (certification) => {
    setEditingCertification(certification);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let res;
    if (editingCertification) {
      res = await updateCertification(editingCertification._id, formData);
    } else {
      res = await createCertification(formData);
    }
    
    if (res.success) {
      toast.success(editingCertification ? 'Certification updated successfully' : 'Certification added successfully');
      setIsFormModalOpen(false);
    } else {
      toast.error(res.error || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    const res = await deleteCertification(deletingId);
    if (res.success) {
      toast.success('Certification deleted successfully');
      setIsDeleteModalOpen(false);
    } else {
      toast.error(res.error || 'Failed to delete certification');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setSortBy('newest');
  };

  const filteredAndSortedCertifications = useMemo(() => {
    let result = [...certifications];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.issuingOrganization && c.issuingOrganization.toLowerCase().includes(query)) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(query)))
      );
    }

    // Filter by status
    if (filterStatus !== 'All') {
      const now = new Date();
      result = result.filter(c => {
        if (filterStatus === 'No Expiry') {
          return !c.expiryDate;
        } else if (filterStatus === 'Expired') {
          return c.expiryDate && new Date(c.expiryDate) < now;
        } else if (filterStatus === 'Active') {
          return !c.expiryDate || new Date(c.expiryDate) >= now;
        }
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return (a.name || '').localeCompare(b.name || '');
      }
      
      const dateA = new Date(a.issueDate || a.createdAt).getTime();
      const dateB = new Date(b.issueDate || b.createdAt).getTime();
      
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      
      // Default newest
      return dateB - dateA;
    });

    return result;
  }, [certifications, searchQuery, filterStatus, sortBy]);

  if (isLoading && certifications.length === 0) {
    return <div className="py-8"><LoadingSpinner /></div>;
  }

  const hasActiveFilters = searchQuery !== '' || filterStatus !== 'All' || sortBy !== 'newest';

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
        <Button onClick={handleAddClick} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search certifications by name, org, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="No Expiry">No Expiry</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end items-center">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {certifications.length === 0 ? (
        <EmptyState 
          title="No Certifications Added" 
          description="Stand out to recruiters by adding your professional certifications and licenses."
          action={<Button onClick={handleAddClick} variant="primary" size="sm">Add Certification</Button>}
        />
      ) : filteredAndSortedCertifications.length === 0 ? (
        <EmptyState 
          title="No Matching Certifications" 
          description="Try adjusting your search or filters to find what you're looking for."
          action={<Button onClick={clearFilters} variant="outline" size="sm">Clear Filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedCertifications.map(cert => (
            <CertificationCard 
              key={cert._id} 
              certification={cert} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={editingCertification ? "Edit Certification" : "Add Certification"}
      >
        <div className="p-1">
          <CertificationForm 
            initialData={editingCertification} 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Certification"
        message="Are you sure you want to delete this certification? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default CertificationList;
