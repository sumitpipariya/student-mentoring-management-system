"use client";
import React, { useEffect, useState } from 'react';
import styles from '../staff.module.css';

export default function MentoringHistory() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/staff/mentoring/history')
            .then(res => res.json())
            .then(data => {
                setLogs(data.sessions || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load history:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <span className="ms-3 fw-bold text-muted">Loading history...</span>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="container-fluid">
                <div className="mb-5">
                    <h2 className="fw-black text-dark">Session History</h2>
                    <p className="text-muted small">A chronological record of all mentoring activities.</p>
                </div>

                <div className={`${styles.tableContainer} shadow-premium border-0`}>
                    <table className={styles.customTable}>
                        <thead>
                            <tr>
                                <th className="ps-4">Mentee Name</th>
                                <th>Enrollment No</th>
                                <th>Date</th>
                                <th>Agenda</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Stress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log: any) => (
                                <tr key={log.id} className="table-row">
                                    <td className="ps-4">
                                        <div className="fw-bold text-dark">{log.studentName}</div>
                                    </td>
                                    <td>
                                        <span className="text-secondary fw-medium font-monospace" style={{ fontSize: '0.85rem' }}>{log.enrollmentNo}</span>
                                    </td>
                                    <td>
                                        <span className="text-muted small font-monospace">
                                            {log.date ? new Date(log.date).toLocaleDateString('en-CA') : 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                                            {(log.agenda || 'GENERAL SESSION').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-2 fw-bold ${log.status === 'Present' ? 'bg-success-soft text-success' : log.status === 'Absent' ? 'bg-danger-soft text-danger' : 'bg-light text-muted'}`} style={{ fontSize: '10px' }}>
                                            {(log.status || 'PENDING').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <span className={`fw-bold small ${log.stressLevel === 'High' ? 'text-danger' : log.stressLevel === 'Moderate' ? 'text-warning' : 'text-success'}`}>
                                            {log.stressLevel}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {logs.length === 0 && (
                        <div className="text-center py-5">
                            <span className="material-symbols-rounded text-muted opacity-25" style={{ fontSize: '4rem' }}>history_toggle_off</span>
                            <p className="text-muted mt-3">No history logs found.</p>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .table-row:hover { background-color: #fbfcfe; }
                .bg-primary-soft { background: rgba(79, 70, 229, 0.08); }
            `}</style>
        </div>
    );
}