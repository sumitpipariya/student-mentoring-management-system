"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

export default function AdminStaffPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  // STATIC_DATA removed

  useEffect(() => {
    fetch('/api/admin/staff')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStaffList(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Permanently remove this mentor?")) {
      try {
        const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setStaffList(staffList.filter(s => s.id !== id));
          showToast('Mentor removed successfully', 'success');
        } else {
          showToast('Failed to remove mentor', 'error');
        }
      } catch (err) {
        console.error("Delete failed", err);
        showToast('An unexpected error occurred during deletion', 'error');
      }
    }
  };

  const filteredStaff = staffList.filter(staff =>
    staff.StaffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.EmailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.Description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const currentStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      {/* Header section... (keeping as per your design) */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-black text-dark mb-1">Faculty Mentors</h2>
          <p className="text-secondary fw-medium mb-0">Manage university staff and roles</p>
        </div>
        <div className="d-flex gap-3">
          <div className="search-box position-relative">
            <span className="material-symbols-rounded position-absolute text-muted" style={{ left: '12px', top: '10px' }}>search</span>
            <input
              type="text"
              className="form-control rounded-pill bg-white border-0 shadow-sm ps-5 py-2"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '280px' }}
            />
          </div>
          <button
            className="btn btn-indigo-glow rounded-pill px-4 py-2 fw-bold d-flex align-items-center"
            onClick={() => router.push('/admin/users/staff/new')}
          >
            <span className="material-symbols-rounded me-2">add_circle</span> Add Mentor
          </button>
        </div>
      </div>

      <div className="card card-main border-0 shadow-sm overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-secondary extra-small fw-bold text-uppercase">
                <th className="ps-4 py-3">Mentor Identity</th>
                <th className="py-3">Contact info</th>
                <th className="py-3">Role</th>
                <th className="pe-4 py-3 text-end">Management</th>
              </tr>
            </thead>
            <tbody>
              {currentStaff.length > 0 ? (
                currentStaff.map((staff) => (
                  <tr key={staff.id} className="border-bottom">
                    <td className="ps-4">
                      <div className="d-flex align-items-center py-2">
                        <div className="avatar-md-circle me-3 bg-indigo-soft fw-bold d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', borderRadius: '12px' }}>
                          {staff.StaffName.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{staff.StaffName}</div>
                          <div className="extra-small text-muted">ID: {staff.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="small">
                      <div className="text-dark fw-medium">{staff.EmailAddress}</div>
                      <div className="text-muted">{staff.MobileNo}</div>
                    </td>
                    <td><span className="badge rounded-pill bg-light text-indigo border px-3">{staff.Description}</span></td>

                    {/* PREMIUM BUTTONS SECTION */}
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {/* Edit Button: Soft Blue Circle */}
                        <button
                          className="btn-action-edit"
                          onClick={() => router.push(`/admin/users/staff/${staff.id}`)}
                          title="Edit Mentor"
                        >
                          <span className="material-symbols-rounded">edit_note</span>
                        </button>

                        {/* Delete Button: Soft Red Circle */}
                        <button
                          className="btn-action-delete"
                          onClick={() => handleDelete(staff.id)}
                          title="Delete Mentor"
                        >
                          <span className="material-symbols-rounded">delete_sweep</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted fw-bold">
                    No faculty mentors found matching your search.
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} results
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

      {/* Internal CSS for the Premium Buttons */}
      <style jsx>{`
        .btn-action-edit {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          background-color: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .btn-action-edit:hover {
          background-color: #2563eb;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-action-delete {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          background-color: #fff1f2;
          color: #e11d48;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .btn-action-delete:hover {
          background-color: #e11d48;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
        }

        .material-symbols-rounded {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}