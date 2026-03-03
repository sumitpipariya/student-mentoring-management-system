"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/Toast';

export default function StudentFormPage() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id !== 'new';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };
  const [formData, setFormData] = useState({
    StudentName: '',
    EnrollmentNo: '',
    EmailAddress: '',
    MobileNo: '',
    Password: '',
    ParentName: '',
    ParentMobileNo: '',
    Description: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetch('/api/admin/students')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            const student = data.find((s: any) => s.id.toString() === id);
            if (student) {
              setFormData({
                StudentName: student.StudentName || '',
                EnrollmentNo: student.EnrollmentNo || '',
                EmailAddress: student.EmailAddress || '',
                MobileNo: student.MobileNo || '',
                Password: '',
                ParentName: student.ParentName || '',
                ParentMobileNo: student.ParentMobileNo || '',
                Description: student.Description || ''
              });
            }
          }
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isEdit) {
      try {
        const res = await fetch(`/api/admin/students/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          showToast('Student details updated successfully!', 'success');
          setTimeout(() => router.push('/admin/users/students'), 1500);
        } else {
          showToast('Failed to update student. Please try again.', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('An unexpected error occurred.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        const res = await fetch('/api/admin/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (res.ok) {
          showToast('Student registered successfully!', 'success');
          setTimeout(() => router.push('/admin/users/students'), 1500);
        } else {
          showToast('Failed to register student.', 'error');
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
    <div className="container py-5">
      <Toast
        isVisible={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card-main border-0 shadow-lg bg-white overflow-hidden">
            <div className="p-4 bg-primary text-white d-flex justify-content-between align-items-center" style={{ background: '#2563eb' }}>
              <h4 className="fw-bold mb-0">{isEdit ? 'Update Student' : 'New Enrollment'}</h4>
              <button className="btn btn-sm btn-light border-0 fw-bold" onClick={() => router.back()}>Back</button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 p-md-5">
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Full Name</label>
                  <input type="text" className="form-control border-0 bg-light p-3" value={formData.StudentName}
                    onChange={(e) => setFormData({ ...formData, StudentName: e.target.value })} required />
                </div>

                <div className="col-md-12">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Enrollment Number</label>
                  <input type="text" className="form-control border-0 bg-light p-3" value={formData.EnrollmentNo}
                    onChange={(e) => setFormData({ ...formData, EnrollmentNo: e.target.value })} required placeholder="e.g. ENR2026XXX" />
                </div>

                <div className="col-md-6">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Email</label>
                  <input type="email" className="form-control border-0 bg-light p-3" value={formData.EmailAddress}
                    onChange={(e) => setFormData({ ...formData, EmailAddress: e.target.value })} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Mobile</label>
                  <input type="text" className="form-control border-0 bg-light p-3" value={formData.MobileNo}
                    onChange={(e) => setFormData({ ...formData, MobileNo: e.target.value })} required />
                </div>

                {!isEdit && (
                  <div className="col-12">
                    <label className="form-label extra-small fw-black text-muted text-uppercase">Login Password</label>
                    <input type="password" className="form-control border-0 bg-light p-3" value={formData.Password}
                      onChange={(e) => setFormData({ ...formData, Password: e.target.value })} required />
                  </div>
                )}

                <div className="col-md-6">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Parent Name</label>
                  <input type="text" className="form-control border-0 bg-light p-3" value={formData.ParentName}
                    onChange={(e) => setFormData({ ...formData, ParentName: e.target.value })} />
                </div>

                <div className="col-md-6">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Parent Mobile</label>
                  <input type="text" className="form-control border-0 bg-light p-3" value={formData.ParentMobileNo}
                    onChange={(e) => setFormData({ ...formData, ParentMobileNo: e.target.value })} />
                </div>

                <div className="col-12">
                  <label className="form-label extra-small fw-black text-muted text-uppercase">Description / Notes</label>
                  <textarea className="form-control border-0 bg-light p-3" rows={3} value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })} placeholder="Any extra information..."></textarea>
                </div>

                <div className="col-12 mt-5">
                  <button type="submit" className="btn btn-indigo-glow w-100 py-3 rounded-pill fw-bold" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {isEdit ? 'Save Changes' : 'Confirm Enrollment'}
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