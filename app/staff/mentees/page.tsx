"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styles from '../staff.module.css';

export default function MenteesPage() {
    const [mentees, setMentees] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/staff/mentees')
            .then(res => res.json())
            .then(data => {
                setMentees(data.mentees || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load mentees:", err);
                setLoading(false);
            });
    }, []);

    const filteredMentees = mentees.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.roll.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats for the header
    const highStressCount = mentees.filter(m => m.stress === 'High').length;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <span className="ms-3 fw-bold text-muted">Loading mentees...</span>
            </div>
        );
    }

    return (
        <div className="container-fluid">

            {/* --- Premium Header Section --- */}
            <div className="mb-5">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4">
                    <div>
                        <span className="badge bg-primary-soft text-primary fw-bold px-3 py-2 rounded-pill mb-3 ls-1 text-uppercase" style={{ fontSize: '10px' }}>
                            Staff Portal • Mentoring
                        </span>
                        <h2 className="fw-black text-dark mb-1">Mentee Directory</h2>
                        <p className="text-muted small mb-0">Manage and monitor student performance and well-being.</p>
                    </div>

                    <div className="d-flex gap-3 align-items-center">
                        {/* Summary Mini-Cards */}
                        <div className="d-none d-lg-flex gap-2 me-3">
                            <div className="text-end border-end pe-3">
                                <div className="fw-black text-dark h5 mb-0">{mentees.length}</div>
                                <small className="text-muted extra-small-text fw-bold">TOTAL</small>
                            </div>
                            <div className="text-end ps-2">
                                <div className="fw-black text-danger h5 mb-0">{highStressCount}</div>
                                <small className="text-muted extra-small-text fw-bold">HIGH STRESS</small>
                            </div>
                        </div>

                        <div className={styles.searchWrapper}>
                            <span className="material-symbols-rounded">search</span>
                            <input
                                type="text"
                                className={`form-control ${styles.searchInput}`}
                                placeholder="Search by name or roll..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Table Section --- */}
            <div className={`${styles.tableContainer} shadow-premium border-0`}>
                <div className="table-responsive">
                    <table className={styles.customTable}>
                        <thead>
                            <tr>
                                <th className="ps-4">Student Details</th>
                                <th>Roll Number</th>
                                <th>Category</th>
                                <th>Stress Level</th>
                                <th className="text-end pe-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMentees.map((s) => (
                                <tr key={s.id} className="table-row-hover">
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center py-1">
                                            <div className={styles.avatar} style={{ background: s.stress === 'High' ? '#fee2e2' : '#e0e7ff', color: s.stress === 'High' ? '#ef4444' : '#4f46e5' }}>
                                                {s.name.charAt(0)}
                                            </div>
                                            <div className="ms-3">
                                                <div className="fw-bold text-dark mb-0">{s.name}</div>
                                                <div className="text-muted extra-small-text">{s.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="fw-bold text-secondary font-monospace" style={{ fontSize: '0.85rem' }}>{s.roll}</span>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-muted border-0 fw-bold px-3 py-2 rounded-pill" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                            {(s.type || 'N/A').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className={`status-dot ${s.stress === 'High' ? 'bg-danger' : 'bg-success'}`}></div>
                                            <span className={`fw-black small ${s.stress === 'High' ? 'text-danger' : 'text-success'}`}>
                                                {s.stress}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-end pe-4">
                                        <Link href={`/staff/mentees/${s.id}`} className="text-decoration-none">
                                            <button className={styles.viewActionBtn}>
                                                <span>View Profile</span>
                                                <span className="material-symbols-rounded fs-6 ms-1">chevron_right</span>
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredMentees.length === 0 && (
                    <div className="text-center py-5">
                        <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                            <span className="material-symbols-rounded text-muted opacity-50" style={{ fontSize: '2.5rem' }}>search_off</span>
                        </div>
                        <h5 className="fw-bold text-dark">No mentees found</h5>
                        <p className="text-muted small">Try adjusting your search terms or filters.</p>
                    </div>
                )}
            </div>


            {/* Component-Specific Styles */}
            <style jsx>{`
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.03);
                }
                .table-row-hover {
                    transition: all 0.2s ease;
                }
                .table-row-hover:hover {
                    background-color: #fbfcfe !important;
                    transform: scale(1.002);
                }
                .bg-primary-soft { background: rgba(79, 70, 229, 0.08); }
            `}</style>
        </div>
    );
}