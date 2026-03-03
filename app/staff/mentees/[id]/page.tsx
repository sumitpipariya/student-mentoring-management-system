"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../staff.module.css';

export default function MenteeDetail() {
    const router = useRouter();
    const params = useParams();
    const [mentee, setMentee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) return;

        fetch(`/api/staff/mentees/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Student not found');
                return res.json();
            })
            .then(data => {
                setMentee(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load mentee:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) {
        return (
            <div className="vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <span className="text-muted fw-bold">Loading Profile...</span>
            </div>
        );
    }

    if (error || !mentee) {
        return (
            <div className="vh-100 d-flex flex-column align-items-center justify-content-center">
                <span className="material-symbols-rounded text-muted opacity-50 mb-3" style={{ fontSize: '3rem' }}>person_off</span>
                <h5 className="fw-bold text-dark">Student Not Found</h5>
                <p className="text-muted small">{error || 'Could not load student data.'}</p>
                <button onClick={() => router.back()} className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                    Go Back
                </button>
            </div>
        );
    }

    const { student, stats, mentoringHistory, assignment } = mentee;

    return (
        <div className="animate-fade-in">
            <div className="container py-2">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="btn btn-link text-decoration-none text-muted mb-4 p-0 d-flex align-items-center gap-2 hover-translate-x"
                    style={{ transition: 'transform 0.2s' }}
                >
                    <span className="material-symbols-rounded fs-5">arrow_back</span>
                    <span className="fw-bold small text-uppercase ls-1">Back to Directory</span>
                </button>

                <div className="row g-4">
                    {/* Left: Profile Sidebar */}
                    <div className="col-lg-4">
                        <div className={`${styles.tableContainer} p-4 text-center h-100 shadow-premium`}>
                            <div className="position-relative d-inline-block mb-4">
                                <div className={styles.premiumNameIcon} style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                                    {student.name.charAt(0)}
                                </div>
                                <span className="position-absolute bottom-0 end-0 bg-success border border-white border-3 rounded-circle p-2" title="Active"></span>
                            </div>

                            <h3 className="fw-black text-dark mb-1">{student.name}</h3>
                            <p className="text-muted small mb-4">
                                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-bold">
                                    {student.enrollmentNo}
                                </span>
                            </p>

                            <hr className="my-4 opacity-50" />

                            <div className="text-start">
                                <label className={styles.fieldLabel}>Email Address</label>
                                <p className="fw-bold small mb-3">{student.email}</p>
                                <label className={styles.fieldLabel}>Phone</label>
                                <p className="fw-bold small mb-3">{student.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed Analytics */}
                    <div className="col-lg-8">
                        {/* Status Grid */}
                        <div className="row g-3 mb-4">
                            {[
                                { label: 'Stress Level', value: stats.stressLevel, color: stats.stressLevel === 'High' ? 'text-danger' : 'text-success', icon: 'psychology' },
                                { label: 'Attendance', value: `${stats.attendancePercentage}%`, color: 'text-dark', icon: 'event_available' },
                                { label: 'Total Sessions', value: stats.totalSessions, color: 'text-dark', icon: 'auto_stories' }
                            ].map((item, idx) => (
                                <div className="col-sm-4" key={idx}>
                                    <div className={`${styles.tableContainer} p-3 border-0 shadow-sm card-hover-up`}>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="material-symbols-rounded text-muted fs-5">{item.icon}</span>
                                            <small className="text-muted fw-bold text-uppercase ls-1" style={{ fontSize: '10px' }}>{item.label}</small>
                                        </div>
                                        <span className={`fs-5 fw-black ${item.color}`}>{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* History Timeline */}
                        <div className={`${styles.tableContainer} p-4 shadow-sm`}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-black text-dark mb-0 d-flex align-items-center gap-2">
                                    <span className="material-symbols-rounded text-primary">history</span>
                                    Mentoring History
                                </h5>
                            </div>

                            {mentoringHistory.length === 0 ? (
                                <div className="text-center py-4">
                                    <span className="material-symbols-rounded text-muted opacity-25" style={{ fontSize: '3rem' }}>history_toggle_off</span>
                                    <p className="text-muted mt-2">No mentoring history found.</p>
                                </div>
                            ) : (
                                <div className="position-relative ps-4 border-start border-2" style={{ borderColor: '#f1f5f9 !important' }}>
                                    {mentoringHistory.map((entry: any, idx: number) => (
                                        <div className={`${idx < mentoringHistory.length - 1 ? 'mb-5' : ''} position-relative`} key={entry.id}>
                                            <div
                                                className={`position-absolute ${idx === 0 ? 'bg-primary' : 'bg-secondary'} rounded-circle ${idx === 0 ? 'shadow-primary-lg' : ''}`}
                                                style={{ width: '14px', height: '14px', left: '-32px', top: '5px', border: '3px solid white' }}
                                            ></div>
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className="fw-bold text-dark mb-0">{entry.agenda}</h6>
                                                <small className={`fw-bold px-2 py-1 rounded ${idx === 0 ? 'text-primary bg-primary-soft' : 'text-muted bg-light'}`}>
                                                    {entry.date ? new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </small>
                                            </div>
                                            <p className="small text-muted mb-0">
                                                {entry.issues || 'No details recorded.'}
                                                {entry.stressLevel !== 'N/A' && <span className="ms-2 badge bg-light text-muted">Stress: {entry.stressLevel}</span>}
                                                {entry.status !== 'Pending' && <span className="ms-2 badge bg-light text-muted">{entry.status}</span>}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* In-page styles for the hover effects */}
            <style jsx>{`
                .card-hover-up {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }
                .card-hover-up:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 20px rgba(0,0,0,0.08) !important;
                }
                .hover-translate-x:hover {
                    transform: translateX(-5px);
                }
                .ls-1 { letter-spacing: 1px; }
            `}</style>
        </div>
    );
}