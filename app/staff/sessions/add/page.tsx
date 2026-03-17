"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../staff.module.css';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Mentee {
    id: number;
    name: string;
    enrollment: string;
}

export default function AddSessionPage() {
    const router = useRouter();
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'success' | 'warning' | 'info';
        onConfirm: () => void;
    }>({
        isOpen: false, title: '', message: '', type: 'info',
        onConfirm: () => setDialogState(prev => ({ ...prev, isOpen: false }))
    });

    const [formData, setFormData] = useState({
        studentId: '',
        dateOfMentoring: new Date().toISOString().split('T')[0],
        scheduledMeetingDate: '',
        nextMentoringDate: '',
        mentoringMeetingAgenda: '',
        issuesDiscussed: '',
        attendanceStatus: 'Present',
        absentRemarks: '',
        stressLevel: '',
        learnerType: '',
        staffOpinion: '',
        studentsOpinion: '',
        isParentPresent: false,
        parentName: '',
        parentMobileNo: '',
        parentsOpinion: '',
        mentoringDocument: '',
        description: ''
    });

    // Fetch assigned mentees
    useEffect(() => {
        fetch('/api/staff/mentoring')
            .then(res => res.json())
            .then(data => {
                if (data.sessions) {
                    // Deduplicate students
                    const seen = new Set();
                    const uniqueMentees: Mentee[] = [];
                    for (const s of data.sessions) {
                        if (!seen.has(s.studentId)) {
                            seen.add(s.studentId);
                            uniqueMentees.push({
                                id: s.studentId,
                                name: s.name,
                                enrollment: s.enrollment
                            });
                        }
                    }
                    setMentees(uniqueMentees);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load mentees:", err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.studentId) {
            setDialogState({
                isOpen: true,
                title: 'Student Required',
                message: 'Please select a student before creating a session.',
                type: 'warning',
                onConfirm: () => { setDialogState(prev => ({ ...prev, isOpen: false })); setCurrentStep(1); }
            });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/staff/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                setDialogState({
                    isOpen: true,
                    title: 'Session Created!',
                    message: 'The mentoring session has been recorded successfully. You will be redirected to the sessions list.',
                    type: 'success',
                    onConfirm: () => { setDialogState(prev => ({ ...prev, isOpen: false })); router.push('/staff/sessions'); }
                });
            } else {
                setDialogState({
                    isOpen: true,
                    title: 'Creation Failed',
                    message: data.error || 'Failed to create session. Please verify all details and try again.',
                    type: 'danger',
                    onConfirm: () => setDialogState(prev => ({ ...prev, isOpen: false }))
                });
            }
        } catch (err) {
            console.error("Submit error:", err);
            setDialogState({
                isOpen: true,
                title: 'Connection Error',
                message: 'An error occurred while creating the session. Please check your connection and try again.',
                type: 'danger',
                onConfirm: () => setDialogState(prev => ({ ...prev, isOpen: false }))
            });
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status"></div>
                <span className="ms-3 fw-bold text-muted">Loading form...</span>
            </div>
        );
    }

    const selectedMentee = mentees.find(m => m.id === parseInt(formData.studentId));

    return (
        <div className="animate-fade-in">
            <ConfirmDialog
                isOpen={dialogState.isOpen}
                title={dialogState.title}
                message={dialogState.message}
                type={dialogState.type}
                confirmText="OK, Got it"
                onConfirm={dialogState.onConfirm}
                onCancel={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
                showCancel={false}
            />
            <div className="container-fluid">
                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                    <div>
                        <Link href="/staff/sessions" className="text-decoration-none text-muted d-flex align-items-center gap-2 mb-2 small fw-bold" style={{ transition: 'transform 0.2s' }}>
                            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_back</span>
                            Back to Sessions
                        </Link>
                        <h2 className="fw-black text-dark mb-1">
                            <span className="material-symbols-rounded text-primary me-2 align-middle" style={{ fontSize: '1.8rem' }}>add_circle</span>
                            Add New Session
                        </h2>
                        <p className="text-muted small mb-0">Create a new mentoring session record for your mentee</p>
                    </div>
                </div>

                {/* Stepper */}
                <div className={`${styles.tableContainer} p-4 mb-4 shadow-sm`}>
                    <div className="d-flex justify-content-between align-items-center position-relative">
                        <div className={styles.stepperLine}></div>
                        {[
                            { step: 1, label: 'Student & Dates', icon: 'person' },
                            { step: 2, label: 'Session Details', icon: 'assignment' },
                            { step: 3, label: 'Opinions', icon: 'chat' },
                            { step: 4, label: 'Parent & Notes', icon: 'family_restroom' }
                        ].map((s) => (
                            <div key={s.step} className="text-center position-relative" style={{ zIndex: 1, cursor: 'pointer' }} onClick={() => setCurrentStep(s.step)}>
                                <div className={`${styles.stepCircle} mx-auto mb-2 ${currentStep >= s.step ? styles.stepActive : ''}`}>
                                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>{s.icon}</span>
                                </div>
                                <div className={`small fw-bold ${currentStep >= s.step ? 'text-primary' : 'text-muted'}`} style={{ fontSize: '11px', letterSpacing: '0.3px' }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Student & Dates */}
                    {currentStep === 1 && (
                        <div className={`${styles.tableContainer} p-4 shadow-sm ${styles.animate}`}>
                            <h5 className="fw-black text-dark mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-rounded text-primary">person</span>
                                Select Student & Dates
                            </h5>

                            <div className="row g-4">
                                {/* Student Select */}
                                <div className="col-md-12">
                                    <label className={styles.fieldLabel}>Select Mentee *</label>
                                    <select
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className={`form-select ${styles.fieldInput}`}
                                        required
                                    >
                                        <option value="">-- Choose a student --</option>
                                        {mentees.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} ({m.enrollment})
                                            </option>
                                        ))}
                                    </select>
                                    {mentees.length === 0 && (
                                        <p className="text-danger small mt-2 mb-0">
                                            <span className="material-symbols-rounded align-middle me-1" style={{ fontSize: '16px' }}>warning</span>
                                            No mentees assigned to you. Please ask admin to assign students first.
                                        </p>
                                    )}
                                </div>

                                {/* Selected Student Card */}
                                {selectedMentee && (
                                    <div className="col-12">
                                        <div className="rounded-4 border p-3 d-flex align-items-center gap-3" style={{ background: '#f8fafc' }}>
                                            <div className={styles.avatar} style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                                {selectedMentee.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{selectedMentee.name}</div>
                                                <div className="text-muted small font-monospace">{selectedMentee.enrollment}</div>
                                            </div>
                                            <span className="badge bg-success-soft text-success rounded-pill ms-auto px-3 py-2 fw-bold" style={{ fontSize: '10px' }}>SELECTED</span>
                                        </div>
                                    </div>
                                )}

                                {/* Date Fields */}
                                <div className="col-md-4">
                                    <label className={styles.fieldLabel}>Date of Mentoring *</label>
                                    <input
                                        type="date"
                                        name="dateOfMentoring"
                                        value={formData.dateOfMentoring}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className={styles.fieldLabel}>Scheduled Meeting Date</label>
                                    <input
                                        type="date"
                                        name="scheduledMeetingDate"
                                        value={formData.scheduledMeetingDate}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className={styles.fieldLabel}>Next Mentoring Date</label>
                                    <input
                                        type="date"
                                        name="nextMentoringDate"
                                        value={formData.nextMentoringDate}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mt-4">
                                <button type="button" className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" onClick={() => setCurrentStep(2)}>
                                    Next
                                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Session Details */}
                    {currentStep === 2 && (
                        <div className={`${styles.tableContainer} p-4 shadow-sm`}>
                            <h5 className="fw-black text-dark mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-rounded text-primary">assignment</span>
                                Session Details
                            </h5>

                            <div className="row g-4">
                                <div className="col-md-12">
                                    <label className={styles.fieldLabel}>Mentoring Meeting Agenda</label>
                                    <textarea
                                        name="mentoringMeetingAgenda"
                                        value={formData.mentoringMeetingAgenda}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                        rows={3}
                                        placeholder="Enter meeting agenda..."
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className={styles.fieldLabel}>Issues Discussed</label>
                                    <textarea
                                        name="issuesDiscussed"
                                        value={formData.issuesDiscussed}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                        rows={3}
                                        placeholder="Enter issues discussed during the session..."
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className={styles.fieldLabel}>Attendance Status *</label>
                                    <select
                                        name="attendanceStatus"
                                        value={formData.attendanceStatus}
                                        onChange={handleChange}
                                        className={`form-select ${styles.fieldInput}`}
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className={styles.fieldLabel}>Stress Level</label>
                                    <select
                                        name="stressLevel"
                                        value={formData.stressLevel}
                                        onChange={handleChange}
                                        className={`form-select ${styles.fieldInput}`}
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Low">Low</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className={styles.fieldLabel}>Learner Type</label>
                                    <select
                                        name="learnerType"
                                        value={formData.learnerType}
                                        onChange={handleChange}
                                        className={`form-select ${styles.fieldInput}`}
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="Fast Learner">Fast Learner</option>
                                        <option value="Average">Average</option>
                                        <option value="Slow Learner">Slow Learner</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                {formData.attendanceStatus === 'Absent' && (
                                    <div className="col-md-12">
                                        <label className={styles.fieldLabel}>Absent Remarks</label>
                                        <textarea
                                            name="absentRemarks"
                                            value={formData.absentRemarks}
                                            onChange={handleChange}
                                            className={`form-control ${styles.fieldInput}`}
                                            rows={2}
                                            placeholder="Enter reason for absence..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" onClick={() => setCurrentStep(1)}>
                                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_back</span>
                                    Previous
                                </button>
                                <button type="button" className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" onClick={() => setCurrentStep(3)}>
                                    Next
                                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Opinions & Feedback */}
                    {currentStep === 3 && (
                        <div className={`${styles.tableContainer} p-4 shadow-sm`}>
                            <h5 className="fw-black text-dark mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-rounded text-primary">chat</span>
                                Opinions & Feedback
                            </h5>

                            <div className="row g-4">
                                <div className="col-md-12">
                                    <label className={styles.fieldLabel}>Staff Opinion</label>
                                    <textarea
                                        name="staffOpinion"
                                        value={formData.staffOpinion}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                        rows={3}
                                        placeholder="Enter your opinion as a mentor..."
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className={styles.fieldLabel}>Student&apos;s Opinion</label>
                                    <textarea
                                        name="studentsOpinion"
                                        value={formData.studentsOpinion}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                        rows={3}
                                        placeholder="Enter the student's feedback or opinion..."
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" onClick={() => setCurrentStep(2)}>
                                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_back</span>
                                    Previous
                                </button>
                                <button type="button" className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" onClick={() => setCurrentStep(4)}>
                                    Next
                                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Parent Info & Notes */}
                    {currentStep === 4 && (
                        <div className={`${styles.tableContainer} p-4 shadow-sm`}>
                            <h5 className="fw-black text-dark mb-4 d-flex align-items-center gap-2">
                                <span className="material-symbols-rounded text-primary">family_restroom</span>
                                Parent Details & Additional Notes
                            </h5>

                            <div className="row g-4">
                                <div className="col-md-12">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isParentPresent"
                                            id="isParentPresent"
                                            checked={formData.isParentPresent}
                                            onChange={handleChange}
                                            style={{ width: '48px', height: '24px' }}
                                        />
                                        <label className="form-check-label fw-bold text-dark ms-2" htmlFor="isParentPresent">
                                            Parent was present during session
                                        </label>
                                    </div>
                                </div>

                                {formData.isParentPresent && (
                                    <>
                                        <div className="col-md-4">
                                            <label className={styles.fieldLabel}>Parent Name</label>
                                            <input
                                                type="text"
                                                name="parentName"
                                                value={formData.parentName}
                                                onChange={handleChange}
                                                className={`form-control ${styles.fieldInput}`}
                                                placeholder="Enter parent name"
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className={styles.fieldLabel}>Parent Mobile No</label>
                                            <input
                                                type="text"
                                                name="parentMobileNo"
                                                value={formData.parentMobileNo}
                                                onChange={handleChange}
                                                className={`form-control ${styles.fieldInput}`}
                                                placeholder="Enter parent mobile"
                                            />
                                        </div>

                                        <div className="col-md-12">
                                            <label className={styles.fieldLabel}>Parent&apos;s Opinion</label>
                                            <textarea
                                                name="parentsOpinion"
                                                value={formData.parentsOpinion}
                                                onChange={handleChange}
                                                className={`form-control ${styles.fieldInput}`}
                                                rows={3}
                                                placeholder="Enter parent's feedback or opinion..."
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="col-md-12">
                                    <label className={styles.fieldLabel}>Mentoring Document</label>
                                    <input
                                        type="text"
                                        name="mentoringDocument"
                                        value={formData.mentoringDocument}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                        placeholder="Enter document name or reference..."
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className={styles.fieldLabel}>Description / Additional Notes</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={`form-control ${styles.fieldInput}`}
                                        rows={3}
                                        placeholder="Any additional notes about this session..."
                                    />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="d-flex justify-content-between mt-4">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2" onClick={() => setCurrentStep(3)}>
                                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_back</span>
                                    Previous
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-5 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
                                    disabled={submitting}
                                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none' }}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>check_circle</span>
                                            Create Session
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <style jsx>{`
                .bg-success-soft { background: rgba(16, 185, 129, 0.1); }
            `}</style>
        </div>
    );
}
