"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/Toast';

const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication',
  'Chemical Engineering',
  'Automobile Engineering',
  'Biomedical Engineering',
  'Applied Sciences & Humanities',
  'Business Administration',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Environmental Engineering',
];

export default function StaffFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== 'new';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };
  const [formData, setFormData] = useState({
    StaffName: '',
    EmailAddress: '',
    MobileNo: '',
    Password: '',
    Description: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetch('/api/admin/staff')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            const staff = data.find((s: any) => s.id.toString() === id);
            if (staff) {
              setFormData({
                StaffName: staff.StaffName || '',
                EmailAddress: staff.EmailAddress || '',
                MobileNo: staff.MobileNo || '',
                Password: '',
                Description: staff.Description || ''
              });
            }
          }
        });
    }
  }, [id, isEdit]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isEdit) {
      try {
        const res = await fetch(`/api/admin/staff/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          showToast('Staff profile updated successfully!', 'success');
          setTimeout(() => router.push('/admin/users/staff'), 1500);
        } else {
          showToast('Failed to update staff profile.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('An unexpected error occurred.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        const res = await fetch('/api/admin/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          showToast('Mentor registered successfully!', 'success');
          setTimeout(() => router.push('/admin/users/staff'), 1500);
        } else {
          showToast('Failed to register mentor.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('An unexpected error occurred.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card-main border-0 shadow-lg bg-white overflow-hidden">
            <div className="p-4 bg-indigo text-white d-flex justify-content-between align-items-center" style={{ background: '#4f46e5' }}>
              <h4 className="fw-bold mb-0">{isEdit ? 'Update Profile' : 'New Mentor Registration'}</h4>
              <button className="btn btn-sm btn-white bg-white bg-opacity-25 text-white border-0" onClick={() => router.back()}>Cancel</button>
            </div>

            <form onSubmit={handleSave} className="p-4 p-md-5">
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Mentor Full Name</label>
                  <input type="text" className="form-control border-0 bg-light p-3 rounded-3" value={formData.StaffName}
                    onChange={(e) => setFormData({ ...formData, StaffName: e.target.value })} required placeholder="e.g. Dr. Jane Smith" />
                </div>

                <div className="col-md-6">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Email</label>
                  <input type="email" className="form-control border-0 bg-light p-3 rounded-3" value={formData.EmailAddress}
                    onChange={(e) => setFormData({ ...formData, EmailAddress: e.target.value })} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Mobile</label>
                  <input type="text" className="form-control border-0 bg-light p-3 rounded-3" value={formData.MobileNo}
                    onChange={(e) => setFormData({ ...formData, MobileNo: e.target.value })} required />
                </div>

                {!isEdit && (
                  <div className="col-12">
                    <label className="form-label extra-small fw-black text-muted text-uppercase">Temporary Password</label>
                    <input type="password" className="form-control border-0 bg-light p-3 rounded-3" value={formData.Password}
                      onChange={(e) => setFormData({ ...formData, Password: e.target.value })} required />
                  </div>
                )}

                <div className="col-12">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Department</label>
                  <select
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                    required
                  >
                    <option value="" disabled>-- Select Department --</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 mt-5">
                  <button type="submit" className="btn btn-indigo-glow w-100 py-3 rounded-pill fw-bold text-uppercase ls-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {isEdit ? 'Update Record' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}