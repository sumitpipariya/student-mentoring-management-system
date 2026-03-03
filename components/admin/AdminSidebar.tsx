"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';

const adminMenuItems = [
  { name: 'Dashboard', icon: 'grid_view', href: '/admin/dashboard' },
  { name: 'Mentors', icon: 'school', href: '/admin/users/staff' },
  { name: 'Students', icon: 'person_search', href: '/admin/users/students' },
  { name: 'Assignments', icon: 'swap_horiz', href: '/admin/users/assign' },
  { name: 'Reports', icon: 'monitoring', href: '/admin/reports' },
];

interface AdminData {
  username: string;
  role: string;
  userId: number;
  totalMentors: number;
  totalStudents: number;
  totalAssignments: number;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  adminData: AdminData;
}

export default function AdminSidebar({ isCollapsed, onToggle, adminData }: SidebarProps) {
  const pathname = usePathname();

  const initials = adminData.username
    ? adminData.username.slice(0, 2).toUpperCase()
    : 'AD';

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/auth/login';
      })
      .catch(() => {
        window.location.href = '/auth/login';
      });
  };

  return (
    <div className="h-100 d-flex flex-column bg-white">
      {/* Brand Header */}
      <div className="p-4 d-flex align-items-center justify-content-between">
        {!isCollapsed && (
          <div className="d-flex align-items-center">
            <div className="bg-dark rounded-3 p-2 me-2 shadow-sm">
              <span className="material-symbols-rounded text-white fs-4">shield_person</span>
            </div>
            <span className="fw-black fs-4 text-dark ls-tight">
              SMMS <span className="text-danger fs-6">Admin</span>
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="btn btn-light btn-sm rounded-circle border-0 shadow-sm"
        >
          <span className="material-symbols-rounded fs-5">
            {isCollapsed ? 'side_navigation' : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 px-3 mt-3">
        {!isCollapsed && (
          <label className="extra-small-text text-uppercase fw-bold text-muted ls-2 px-3 mb-2 d-block">
            System Control
          </label>
        )}
        <hr className="sidebar-divider mx-3" />

        <div className="nav flex-column gap-2 mt-3">
          {adminMenuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} className="text-decoration-none">
                <div
                  className={`sidebar-link ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-content-center px-0' : 'px-3'}`}
                >
                  <span className="material-symbols-rounded fs-5">{item.icon}</span>
                  {!isCollapsed && <span className="ms-3 fw-medium">{item.name}</span>}
                  {isActive && !isCollapsed && <div className="active-dot bg-danger"></div>}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin Profile */}
      <div className="p-3 mt-auto border-top bg-light-soft d-flex flex-column gap-3">
        <Link href="/admin/profile" className="text-decoration-none">
          <div className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
            <div
              className="avatar-sm bg-dark text-white rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: '40px', height: '40px', minWidth: '40px' }}
            >
              {initials}
            </div>
            {!isCollapsed && (
              <div className="ms-3 overflow-hidden">
                <p className="mb-0 fw-bold text-dark small text-truncate">{adminData.username}</p>
                <p className="mb-0 extra-small-text text-muted">ID: #{adminData.userId}</p>
              </div>
            )}
          </div>
        </Link>

        {/* Logout Button */}
        <button
          className="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center fw-bold shadow-sm mb-2"
          onClick={handleLogout}
          title="Sign Out"
        >
          <span className="material-symbols-rounded">logout</span>
          {!isCollapsed && <span className="ms-2">Logout</span>}
        </button>
      </div>
    </div>
  );
}