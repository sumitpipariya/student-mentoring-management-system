"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, studentId: 0 });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  // Static Initial data removed

  useEffect(() => {
    fetch('/api/admin/students')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStudents(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDeleteClick = (id: number) => {
    setConfirmDialog({ isOpen: true, studentId: id });
  };

  const handleDeleteConfirm = async () => {
    const id = confirmDialog.studentId;
    setConfirmDialog({ isOpen: false, studentId: 0 });
    try {
      const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStudents(students.filter(s => s.id !== id));
        showToast('Student record deleted successfully', 'success');
      } else {
        showToast('Failed to delete student record', 'error');
      }
    } catch (err) {
      console.error("Delete failed", err);
      showToast('An unexpected error occurred during deletion', 'error');
    }
  };

  const filteredStudents = students.filter(std =>
    std.StudentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    std.EnrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when search changes to avoid empty state
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remove Student Record"
        message="This will permanently delete the student's enrollment record, account credentials, and all related data. This action cannot be undone."
        type="danger"
        confirmText="Yes, Remove"
        cancelText="Keep Record"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, studentId: 0 })}
      />
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-black text-dark mb-1">Student Enrollment</h2>
          <p className="text-secondary fw-medium mb-0">University Mentee Records (Table: Student)</p>
        </div>
        <div className="d-flex gap-3">
          <div className="search-box position-relative">
            <span className="material-symbols-rounded position-absolute text-muted" style={{ left: '12px', top: '10px' }}>search</span>
            <input
              type="text"
              className="form-control rounded-pill bg-white border-0 shadow-sm ps-5 py-2"
              placeholder="Search by name or ENR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>
          <button
            className="btn btn-indigo-glow rounded-pill px-4 py-2 fw-bold d-flex align-items-center"
            onClick={() => router.push('/admin/users/students/new')}
          >
            <span className="material-symbols-rounded me-2">group_add</span> Register Student
          </button>
        </div>
      </div>

      <div className="card-main border-0 shadow-sm overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-uppercase extra-small fw-bold text-secondary">
              <tr>
                <th className="ps-4 py-3">Student Identity</th>
                <th className="py-3">Enrollment No</th>
                <th className="py-3">Contact</th>
                <th className="py-3">Registered On</th>
                <th className="pe-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((std) => (
                  <tr key={std.id} className="border-bottom">
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{std.StudentName}</div>
                      <div className="extra-small text-muted">ID: #{std.id}</div>
                    </td>
                    <td>
                      <span className="badge bg-primary-soft text-primary border fw-bold px-3">
                        {std.EnrollmentNo}
                      </span>
                    </td>
                    <td>
                      <div className="small text-dark fw-medium">{std.EmailAddress}</div>
                      <div className="extra-small text-muted">{std.MobileNo}</div>
                    </td>
                    <td className="small text-secondary">{std.created}</td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn-action-edit"
                          onClick={() => router.push(`/admin/users/students/${std.id}`)}
                        >
                          <span className="material-symbols-rounded">edit_square</span>
                        </button>
                        <button
                          className="btn-action-delete"
                          onClick={() => handleDeleteClick(std.id)}
                        >
                          <span className="material-symbols-rounded">person_remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted fw-bold">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Details */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
            <span className="extra-small text-secondary fw-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} results
            </span>
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-white border shadow-sm rounded-2 d-flex align-items-center justify-content-center"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>chevron_left</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`btn btn-sm border rounded-2 fw-bold ${currentPage === page ? 'btn-primary text-white border-primary' : 'btn-white text-dark shadow-sm'}`}
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="btn btn-sm btn-white border shadow-sm rounded-2 d-flex align-items-center justify-content-center"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .btn-action-edit {
          width: 38px; height: 38px; border-radius: 10px; border: none;
          background-color: #eff6ff; color: #2563eb; display: flex;
          align-items: center; justify-content: center; transition: all 0.2s ease;
        }
        .btn-action-edit:hover {
          background-color: #2563eb; color: white; transform: translateY(-2px);
        }
        .btn-action-delete {
          width: 38px; height: 38px; border-radius: 10px; border: none;
          background-color: #fff1f2; color: #e11d48; display: flex;
          align-items: center; justify-content: center; transition: all 0.2s ease;
        }
        .btn-action-delete:hover {
          background-color: #e11d48; color: white; transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}