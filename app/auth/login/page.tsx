"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Logic: State to track which role is selected
    const [role, setRole] = useState('student');

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push(data.redirect);
            } else {
                setErrorMsg(data.error || 'Login failed');
                setLoading(false);
            }
        } catch (err) {
            setErrorMsg('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPageWrapper}>
            {/* LEFT SIDE: Premium Visual Branding */}
            <div className={`d-none d-lg-flex col-lg-7 ${styles.authBgGradient} position-relative overflow-hidden align-items-center justify-content-center p-5`}>

                {/* High-end mesh gradient effect */}
                <div className={styles.meshGradientOverlay}></div>
                <div className={styles.abstractShape1}></div>
                <div className={styles.abstractShape2}></div>

                <div className="z-2 text-white text-center">
                    {/* Floating Logo Branding */}
                    <div className={styles.premiumLogoContainer}>
                        <div className={styles.glassLogoIcon}>
                            <span className="material-symbols-rounded">rocket_launch</span>
                        </div>
                        <div className={styles.logoGlow}></div>
                    </div>

                    <div className="mt-5">
                        <h1 className={styles.heroTitle}>SMMS</h1>
                        <div className={styles.premiumDivider}></div>
                        <p className={styles.heroSubtitle}>
                            Elevating the <span className="fw-black text-white">Mentoring Experience</span>
                            <br /> through intelligent management.
                        </p>
                    </div>

                    {/* Dynamic Floating Badge Section */}
                    <div className="mt-5 d-flex gap-4 justify-content-center">
                        <div className={styles.premiumGlassBadge}>
                            <div className={styles.badgePulse}></div>
                            <span className="material-symbols-rounded fs-5">security</span>
                            <span>Enterprise Grade</span>
                        </div>
                        <div className={styles.premiumGlassBadge}>
                            <span className="material-symbols-rounded fs-5">auto_graph</span>
                            <span>AI Driven Insights</span>
                        </div>
                    </div>
                </div>

                {/* Subtle footer text for the left side */}
                <div className="position-absolute bottom-0 start-0 p-5 z-2 opacity-50">
                    <p className="extra-small-text fw-medium ls-2 mb-0">© 2026 UNIVERSITY ECOSYSTEM</p>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form - Kept your premium design */}
            <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center p-4 p-md-5">
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <div className="text-center mb-5">
                        <h2 className="fw-black text-dark mb-2">Welcome Back</h2>
                        <p className="text-secondary small fw-medium">Please enter your credentials</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        {errorMsg && (
                            <div className="alert alert-danger py-2 small fw-bold mb-4 border-0 shadow-sm d-flex align-items-center gap-2">
                                <span className="material-symbols-rounded fs-5">error</span>
                                {errorMsg}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className={styles.fieldLabel}>Username</label>
                            <div className={styles.inputGroupCustom}>
                                <span className={`material-symbols-rounded ${styles.inputIcon}`}>person</span>
                                <input
                                    type="text"
                                    className={styles.formControlCustom}
                                    placeholder="Enter Your Username.."
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex justify-content-between">
                                <label className={styles.fieldLabel}>Password</label>
                                <a href="#" className="extra-small fw-bold text-primary text-decoration-none">Forgot?</a>
                            </div>
                            <div className={styles.inputGroupCustom}>
                                <span className={`material-symbols-rounded ${styles.inputIcon}`}>lock</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={styles.formControlCustom}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={styles.btnTogglePass}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-rounded fs-6">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Updated Role Selection Logic with your existing CSS Classes */}
                        {/* Responsive Role Selection */}
                        <div className="mb-4">
                            <div className="row g-3">
                                {/* Student Role */}
                                <div className="col-12 col-md-4">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="role"
                                        id="role-student"
                                        checked={role === 'student'}
                                        onChange={() => setRole('student')}
                                    />
                                    <label
                                        className={`btn ${styles.btnOutlineCustom} w-100 py-3 d-flex align-items-center justify-content-center gap-2 small fw-bold`}
                                        htmlFor="role-student"
                                    >
                                        <span className="material-symbols-rounded fs-5">school</span>
                                        <span className="d-none d-md-inline">Student</span>
                                    </label>
                                </div>

                                {/* Staff Role */}
                                <div className="col-12 col-md-4">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="role"
                                        id="role-staff"
                                        checked={role === 'staff'}
                                        onChange={() => setRole('staff')}
                                    />
                                    <label
                                        className={`btn ${styles.btnOutlineCustom} w-100 py-3 d-flex align-items-center justify-content-center gap-2 small fw-bold`}
                                        htmlFor="role-staff"
                                    >
                                        <span className="material-symbols-rounded fs-5">badge</span>
                                        <span className="d-none d-md-inline">Staff</span>
                                    </label>
                                </div>

                                {/* Admin Role */}
                                <div className="col-12 col-md-4">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="role"
                                        id="role-admin"
                                        checked={role === 'admin'}
                                        onChange={() => setRole('admin')}
                                    />
                                    <label
                                        className={`btn ${styles.btnOutlineCustom} w-100 py-3 d-flex align-items-center justify-content-center gap-2 small fw-bold`}
                                        htmlFor="role-admin"
                                    >
                                        <span className="material-symbols-rounded fs-5">admin_panel_settings</span>
                                        <span className="d-none d-md-inline">Admin</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary-premium w-100 py-3 rounded-4 fw-bold shadow-lg"
                            disabled={loading}
                        >
                            {loading ? <div className="spinner-border spinner-border-sm" /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}