"use client";
import React from 'react';
import Link from 'next/link';

interface AdminData {
  username: string;
  role: string;
  userId: number;
  totalMentors: number;
  totalStudents: number;
  totalAssignments: number;
}

export default function AdminNavbar({ sidebarWidth, adminData }: { sidebarWidth: string; adminData: AdminData }) {
  const initials = adminData.username
    ? adminData.username.slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom px-4"
      style={{
        height: '70px',
        position: 'fixed',
        right: 0,
        left: sidebarWidth,
        top: 0,
        zIndex: 1030,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <div className="d-none d-lg-block">
            <h5 className="fw-black text-dark mb-0">Central Administration</h5>
            <p className="text-muted extra-small-text mb-0 fw-bold">SYSTEM CONTROL PANEL</p>
          </div>
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">

          {/* Quick Stats */}
          <div className="d-none d-xl-flex align-items-center gap-3 pe-3 border-end">
            <div className="text-center">
              <p className="mb-0 fw-black text-dark" style={{ fontSize: '0.85rem' }}>{adminData.totalMentors}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.6rem', letterSpacing: '0.5px' }}>MENTORS</p>
            </div>
            <div className="text-center">
              <p className="mb-0 fw-black text-dark" style={{ fontSize: '0.85rem' }}>{adminData.totalStudents}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.6rem', letterSpacing: '0.5px' }}>STUDENTS</p>
            </div>
          </div>

          {/* Admin Identity */}
          <Link href="/admin/profile" className="text-decoration-none">
            <div className="d-flex align-items-center gap-2 px-2 ps-3 ms-2" style={{ cursor: 'pointer' }}>
              <div className="text-end d-none d-lg-block">
                <p className="mb-0 fw-black text-dark" style={{ fontSize: '0.75rem', lineHeight: '1' }}>{adminData.username.toUpperCase()}</p>
                <p className="mb-0 text-danger fw-bold" style={{ fontSize: '0.65rem' }}>{adminData.role}</p>
              </div>
              <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
                <span className="fw-bold" style={{ fontSize: '0.75rem' }}>{initials}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}