"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../staff.module.css';

interface Session {
    id: number;
    studentMentorId: number;
    studentName: string;
    enrollmentNo: string;
    studentEmail: string;
    studentPhone: string;
    dateOfMentoring: string | null;
    scheduledMeetingDate: string | null;
    nextMentoringDate: string | null;
    issuesDiscussed: string;
    mentoringMeetingAgenda: string;
    attendanceStatus: string;
    absentRemarks: string;
    isParentPresent: boolean;
    parentName: string;
    parentMobileNo: string;
    studentsOpinion: string;
    parentsOpinion: string;
    staffOpinion: string;
    stressLevel: string;
    learnerType: string;
    mentoringDocument: string;
    description: string;
    created: string;
    modified: string;
}

export default function StudentSessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, pending: 0 });

    useEffect(() => {
        fetch('/api/staff/sessions')
            .then(res => res.json())
            .then(data => {
                setSessions(data.sessions || []);
                setFilteredSessions(data.sessions || []);
                setStats(data.stats || { total: 0, present: 0, absent: 0, pending: 0 });
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load sessions:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let filtered = sessions;

        if (search.trim()) {
            const query = search.toLowerCase();
            filtered = filtered.filter(s =>
                s.studentName.toLowerCase().includes(query) ||
                s.enrollmentNo.toLowerCase().includes(query) ||
                s.mentoringMeetingAgenda.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => s.attendanceStatus === statusFilter);
        }

        setFilteredSessions(filtered);
    }, [search, statusFilter, sessions]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <span className="ms-3 fw-bold text-muted">Loading student sessions...</span>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="container-fluid">
                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                    <div>
                        <h2 className="fw-black text-dark mb-1">
                            <span className="material-symbols-rounded text-primary me-2 align-middle" style={{ fontSize: '1.8rem' }}>school</span>
                            Student Sessions
                        </h2>
                        <p className="text-muted small mb-0">Detailed mentoring session records for all your mentees</p>
                    </div>
                    <Link href="/staff/sessions/add" className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm text-decoration-none" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none' }}>
                        <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>add_circle</span>
                        Add Session
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="row g-3 mb-4">
                    {[
                        { label: 'Total Sessions', value: stats.total, icon: 'event_note', gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', textColor: 'white' },
                        { label: 'Present', value: stats.present, icon: 'check_circle', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', textColor: 'white' },
                        { label: 'Absent', value: stats.absent, icon: 'cancel', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', textColor: 'white' },
                        { label: 'Pending', value: stats.pending, icon: 'pending', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', textColor: 'white' },
                    ].map((card, idx) => (
                        <div className="col-6 col-lg-3" key={idx}>
                            <div className="rounded-4 p-3 d-flex align-items-center gap-3 shadow-sm" style={{ background: card.gradient, color: card.textColor }}>
                                <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)' }}>
                                    <span className="material-symbols-rounded fs-4">{card.icon}</span>
                                </div>
                                <div>
                                    <div className="fw-black fs-4">{card.value}</div>
                                    <div className="small fw-bold opacity-75" style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{card.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters Row */}
                <div className={`${styles.tableContainer} p-3 mb-4 shadow-sm`}>
                    <div className="row g-3 align-items-center">
                        {/* Search */}
                        <div className="col-md-6">
                            <div className="position-relative">
                                <span className="material-symbols-rounded position-absolute top-50 translate-middle-y text-muted" style={{ left: '14px', fontSize: '20px' }}>search</span>
                                <input
                                    type="text"
                                    className="form-control ps-5 rounded-3 border-light"
                                    placeholder="Search by name, enrollment or agenda..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ height: '44px', fontWeight: 600 }}
                                />
                            </div>
                        </div>
                        {/* Status Filter */}
                        <div className="col-md-3">
                            <select
                                className="form-select rounded-3 border-light fw-bold"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ height: '44px' }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div className="col-md-3 text-end">
                            <span className="badge bg-light text-dark rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '12px' }}>
                                Showing {filteredSessions.length} of {sessions.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sessions Table */}
                <div className={`${styles.tableContainer} shadow-premium border-0`}>
                    <div className="table-responsive">
                        <table className={styles.customTable}>
                            <thead>
                                <tr>
                                    <th className="ps-4">Student</th>
                                    <th>Date</th>
                                    <th>Agenda</th>
                                    <th>Attendance</th>
                                    <th>Stress Level</th>
                                    <th>Learner Type</th>
                                    <th className="text-center">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSessions.map((session) => (
                                    <tr key={session.id} className="table-row-hover" style={{ cursor: 'pointer' }} onClick={() => setSelectedSession(session)}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <div className={styles.avatar}>
                                                    {session.studentName.charAt(0)}
                                                </div>
                                                <div className="ms-3">
                                                    <div className="fw-bold text-dark">{session.studentName}</div>
                                                    <div className="text-muted small font-monospace">{session.enrollmentNo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="material-symbols-rounded text-muted" style={{ fontSize: '16px' }}>calendar_today</span>
                                                <span className="small fw-bold text-dark">
                                                    {session.dateOfMentoring
                                                        ? new Date(session.dateOfMentoring).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                                                {(session.mentoringMeetingAgenda || 'GENERAL SESSION').toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill px-3 py-2 fw-bold ${session.attendanceStatus === 'Present'
                                                ? 'bg-success-soft text-success'
                                                : session.attendanceStatus === 'Absent'
                                                    ? 'bg-danger-soft text-danger'
                                                    : 'bg-light text-muted'}`}
                                                style={{ fontSize: '10px' }}>
                                                {(session.attendanceStatus || 'PENDING').toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`fw-bold small ${session.stressLevel === 'High' ? 'text-danger'
                                                : session.stressLevel === 'Moderate' ? 'text-warning'
                                                    : session.stressLevel === 'Low' ? 'text-success'
                                                        : 'text-muted'}`}>
                                                {session.stressLevel}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-info-soft text-info px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                                                {(session.learnerType || 'N/A').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                                                onClick={(e) => { e.stopPropagation(); setSelectedSession(session); }}
                                            >
                                                <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredSessions.length === 0 && (
                        <div className="text-center py-5">
                            <span className="material-symbols-rounded text-muted opacity-25" style={{ fontSize: '4rem' }}>event_busy</span>
                            <p className="text-muted mt-3 fw-bold">No sessions found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {selectedSession && (
                    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                                {/* Modal Header */}
                                <div className="modal-header border-0 px-4 pt-4 pb-2">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={styles.avatar} style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                            {selectedSession.studentName.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className="fw-black text-dark mb-0">{selectedSession.studentName}</h5>
                                            <span className="text-muted small font-monospace">{selectedSession.enrollmentNo}</span>
                                        </div>
                                    </div>
                                    <button type="button" className="btn-close" onClick={() => setSelectedSession(null)}></button>
                                </div>

                                <div className="modal-body px-4 pb-4">
                                    {/* Quick Stats Row */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-4">
                                            <div className="rounded-3 bg-light p-3 text-center">
                                                <div className="text-muted small fw-bold mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Attendance</div>
                                                <span className={`fw-black ${selectedSession.attendanceStatus === 'Present' ? 'text-success' : selectedSession.attendanceStatus === 'Absent' ? 'text-danger' : 'text-warning'}`}>
                                                    {selectedSession.attendanceStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="rounded-3 bg-light p-3 text-center">
                                                <div className="text-muted small fw-bold mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Stress Level</div>
                                                <span className={`fw-black ${selectedSession.stressLevel === 'High' ? 'text-danger' : selectedSession.stressLevel === 'Moderate' ? 'text-warning' : 'text-success'}`}>
                                                    {selectedSession.stressLevel}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="rounded-3 bg-light p-3 text-center">
                                                <div className="text-muted small fw-bold mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Learner Type</div>
                                                <span className="fw-black text-primary">{selectedSession.learnerType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dates Section */}
                                    <div className="rounded-4 border p-3 mb-4">
                                        <h6 className="fw-black text-dark mb-3 d-flex align-items-center gap-2">
                                            <span className="material-symbols-rounded text-primary" style={{ fontSize: '18px' }}>event</span>
                                            Session Dates
                                        </h6>
                                        <div className="row g-3">
                                            {[
                                                { label: 'Date of Mentoring', value: selectedSession.dateOfMentoring },
                                                { label: 'Scheduled Date', value: selectedSession.scheduledMeetingDate },
                                                { label: 'Next Mentoring', value: selectedSession.nextMentoringDate }
                                            ].map((d, i) => (
                                                <div className="col-md-4" key={i}>
                                                    <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d.label}</div>
                                                    <div className="fw-bold text-dark small">
                                                        {d.value ? new Date(d.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Discussion Details */}
                                    <div className="rounded-4 border p-3 mb-4">
                                        <h6 className="fw-black text-dark mb-3 d-flex align-items-center gap-2">
                                            <span className="material-symbols-rounded text-primary" style={{ fontSize: '18px' }}>forum</span>
                                            Discussion Details
                                        </h6>
                                        <div className="mb-3">
                                            <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agenda</div>
                                            <p className="fw-medium text-dark small mb-0">{selectedSession.mentoringMeetingAgenda || 'Not specified'}</p>
                                        </div>
                                        <div className="mb-3">
                                            <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issues Discussed</div>
                                            <p className="fw-medium text-dark small mb-0">{selectedSession.issuesDiscussed || 'No issues recorded'}</p>
                                        </div>
                                        {selectedSession.absentRemarks && (
                                            <div>
                                                <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Absent Remarks</div>
                                                <p className="fw-medium text-danger small mb-0">{selectedSession.absentRemarks}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Opinions Section */}
                                    <div className="rounded-4 border p-3 mb-4">
                                        <h6 className="fw-black text-dark mb-3 d-flex align-items-center gap-2">
                                            <span className="material-symbols-rounded text-primary" style={{ fontSize: '18px' }}>chat</span>
                                            Opinions & Feedback
                                        </h6>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Staff Opinion</div>
                                                <p className="small fw-medium text-dark mb-0">{selectedSession.staffOpinion || '—'}</p>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Opinion</div>
                                                <p className="small fw-medium text-dark mb-0">{selectedSession.studentsOpinion || '—'}</p>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parent Opinion</div>
                                                <p className="small fw-medium text-dark mb-0">{selectedSession.parentsOpinion || '—'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parent Info */}
                                    {selectedSession.isParentPresent && (
                                        <div className="rounded-4 border p-3 mb-4">
                                            <h6 className="fw-black text-dark mb-3 d-flex align-items-center gap-2">
                                                <span className="material-symbols-rounded text-primary" style={{ fontSize: '18px' }}>family_restroom</span>
                                                Parent Details
                                            </h6>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parent Name</div>
                                                    <p className="small fw-bold text-dark mb-0">{selectedSession.parentName || '—'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="small text-muted fw-bold mb-1" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parent Mobile</div>
                                                    <p className="small fw-bold text-dark mb-0">{selectedSession.parentMobileNo || '—'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {selectedSession.description && (
                                        <div className="rounded-4 border p-3">
                                            <h6 className="fw-black text-dark mb-2 d-flex align-items-center gap-2">
                                                <span className="material-symbols-rounded text-primary" style={{ fontSize: '18px' }}>description</span>
                                                Additional Notes
                                            </h6>
                                            <p className="small fw-medium text-dark mb-0">{selectedSession.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .table-row-hover {
                    transition: all 0.2s ease;
                }
                .table-row-hover:hover {
                    background-color: #fbfcfe !important;
                }
                .bg-success-soft { background: rgba(16, 185, 129, 0.1); }
                .bg-danger-soft { background: rgba(239, 68, 68, 0.1); }
                .bg-primary-soft { background: rgba(79, 70, 229, 0.08); }
                .bg-info-soft { background: rgba(6, 182, 212, 0.1); }
            `}</style>
        </div>
    );
}
