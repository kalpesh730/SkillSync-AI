import React, { useEffect, useState } from 'react';
import useCompanyStore from '../../../store/companyStore';
import { useAuthStore } from '../../../store/authStore';
import CompanyCard from './CompanyCard';
import CompanyForm from './CompanyForm';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';

const CompanyList = () => {
  const { companies, fetchCompanies, deleteCompany, isLoading, error } = useCompanyStore();
  const { user } = useAuthStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deletingCompanyId, setDeletingCompanyId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const canManage = ['COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'COMPANY_HR'].includes(user?.role);

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingCompany(null);
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCompanyId) {
      await deleteCompany(deletingCompanyId);
      setDeletingCompanyId(null);
    }
  };

  if (isLoading && companies.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and view partner companies.</p>
        </div>
        {canManage && (
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Company
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {companies.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No companies found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard 
              key={company._id} 
              company={company} 
              canManage={canManage && (user.role !== 'COMPANY_HR' || user.companyId === company._id)}
              onEdit={handleEdit}
              onDelete={(id) => setDeletingCompanyId(id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingCompany ? 'Edit Company' : 'Add New Company'}
        size="xl"
      >
        <CompanyForm 
          initialData={editingCompany} 
          onSuccess={handleCloseForm} 
          onCancel={handleCloseForm} 
        />
      </Modal>

      <ConfirmationDialog
        isOpen={!!deletingCompanyId}
        title="Delete Company"
        message="Are you sure you want to delete this company? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCompanyId(null)}
        variant="danger"
      />
    </div>
  );
};

export default CompanyList;
