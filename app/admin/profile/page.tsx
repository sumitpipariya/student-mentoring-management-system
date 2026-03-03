"use client";
import React, { useState, useEffect } from 'react';
import Toast from '@/components/Toast';

interface AdminProfile {
    username: string;
    role: string;
    userId: number;
    totalMentors: number;
    totalStudents: number;
    totalAssignments: number;
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ show: true, message, type });
    };

    useEffect(() => {
        fetch('/api/admin/layout')
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setProfile(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPass !== passwords.confirm) {
            showToast('Passwords do not match!', 'error');
            return;
        }
        if (passwords.newPass.length < 4) {
            showToast('Password must be at least 4 characters', 'error');
            return;
        }

        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.newPass
                })
            });

            if (res.ok) {
                showToast('Password changed successfully!', 'success');
                setPasswords({ current: '', newPass: '', confirm: '' });
                setIsEditing(false);
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to change password', 'error');
            }
        } catch {
            showToast('An unexpected error occurred', 'error');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <Toast
                isVisible={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            <div className="mb-4">
                <h2 className="fw-black text-dark mb-1">Admin Profile</h2>
                <p className="text-secondary fw-medium">Your account details and system overview</p>
            </div>

            <div className="row g-4">
                {/* Profile Card */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                        <div className="card-body text-center p-4">
                            <div
                                className="mx-auto mb-3 bg-danger text-white d-flex align-items-center justify-content-center fw-black shadow"
                                style={{ width: '80px', height: '80px', borderRadius: '20px', fontSize: '1.8rem' }}
                            >
                                {profile?.username?.slice(0, 2).toUpperCase() || 'AD'}
                            </div>
                            <h4 className="fw-black text-dark mb-1">{profile?.username}</h4>
                            <span className="badge bg-danger rounded-pill px-3 py-1 fw-bold mb-3">{profile?.role}</span>
                            <p className="text-muted small mb-0">User ID: #{profile?.userId}</p>
                            <hr />
                            <div className="text-start">
                                <div className="d-flex justify-content-between py-2">
                                    <span className="text-muted small fw-bold">Access Level</span>
                                    <span className="text-dark small fw-bold">Full Access</span>
                                </div>
                                <div className="d-flex justify-content-between py-2">
                                    <span className="text-muted small fw-bold">Status</span>
                                    <span className="badge bg-success-soft text-success rounded-pill px-3">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats & Actions */}
                <div className="col-lg-8">
                    {/* Quick Stats */}
                    <div className="row g-3 mb-4">
                        {[
                            { label: 'Total Mentors', value: profile?.totalMentors || 0, icon: 'school', color: 'primary' },
                            { label: 'Total Students', value: profile?.totalStudents || 0, icon: 'groups', color: 'success' },
                            { label: 'Assignments', value: profile?.totalAssignments || 0, icon: 'swap_horiz', color: 'warning' },
                        ].map((stat, idx) => (
                            <div className="col-md-4" key={idx}>
                                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '16px' }}>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className={`bg-${stat.color} bg-opacity-10 text-${stat.color} rounded-3 d-flex align-items-center justify-content-center me-3`}
                                            style={{ width: '45px', height: '45px' }}
                                        >
                                            <span className="material-symbols-rounded">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="fw-black text-dark mb-0">{stat.value}</h4>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{stat.label}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Security Section */}
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-black text-dark mb-1">
                                        <span className="material-symbols-rounded align-middle me-2 text-danger">security</span>Security Settings
                                    </h5>
                                    <p className="text-muted small mb-0">Manage your account security</p>
                                </div>
                                {!isEditing && (
                                    <button
                                        className="btn btn-outline-primary rounded-pill px-4 fw-bold"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <span className="material-symbols-rounded align-middle me-1" style={{ fontSize: '18px' }}>edit</span> Change Password
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleChangePassword}>
                                    <div className="row g-3">
                                        <div className="col-md-12">
                                            <label className="form-label small fw-bold text-muted">Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control rounded-3"
                                                value={passwords.current}
                                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control rounded-3"
                                                value={passwords.newPass}
                                                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="form-control rounded-3"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-12 d-flex gap-2 mt-3">
                                            <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                                                <span className="material-symbols-rounded align-middle me-1" style={{ fontSize: '18px' }}>check</span> Save Password
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-light rounded-pill px-4 fw-bold border"
                                                onClick={() => { setIsEditing(false); setPasswords({ current: '', newPass: '', confirm: '' }); }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div className="bg-light rounded-3 p-3">
                                    <div className="d-flex align-items-center">
                                        <span className="material-symbols-rounded text-success me-2">check_circle</span>
                                        <span className="text-dark small fw-bold">Your password is currently set. Click &quot;Change Password&quot; to update.</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-success-soft { background: #ecfdf5; color: #10b981; }
      `}</style>
        </div>
    );
}
