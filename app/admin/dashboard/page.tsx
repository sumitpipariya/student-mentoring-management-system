"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();

  // States aligned with Database Schema counts
  const [counts, setCounts] = useState({
    mentors: 0,   // From Staff table
    students: 0,  // From Student table
    mappings: 0,  // From StudentMentor table
    alerts: 0     // Based on High Stress levels in StudentMentoring
  });

  const [recentMappings, setRecentMappings] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setCounts({
            mentors: data.mentors,
            students: data.students,
            mappings: data.mappings,
            alerts: data.alerts
          });
          setRecentMappings(data.recentMappings);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { label: "Total Mentors", value: counts.mentors, icon: "assignment_ind", color: "#6366f1", trend: "Faculty Staff" },
    { label: "Total Mentees", value: counts.students, icon: "school", color: "#10b981", trend: "Active Enrollment" },
    { label: "Active Mappings", value: counts.mappings, icon: "link", color: "#f59e0b", trend: "Mentor-Student Pairs" },
    { label: "Stress Alerts", value: counts.alerts, icon: "warning", color: "#f43f5e", trend: "Immediate Review" },
  ];

  return (
    <div className='container m-1'>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h2 className={styles.pageTitle}>System Overview</h2>
        </div>
        <button className={styles.btnAdminPrimary} onClick={() => router.push('/admin/reports')}>
          <span className="material-symbols-rounded align-middle me-2">analytics</span>
          Generate Insights
        </button>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        {stats.map((stat, index) => (
          <div className="col-md-6 col-xl-3" key={index}>
            <div className={`card border-0 shadow-sm p-4 h-100 ${styles.shadowPremium}`} style={{ borderRadius: '24px' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="rounded-4 p-3" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  <span className="material-symbols-rounded fs-2">{stat.icon}</span>
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                  {stat.trend}
                </span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#1e293b' }}>{stat.value}</h2>
              <p className={styles.extraSmallText + " text-muted mb-0"}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Table View: Student-Mentor Assignments [cite: 18, 44] */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Recent Assignments</h5>
              <button className="btn btn-light btn-sm rounded-pill px-4 fw-bold border" onClick={() => router.push('/admin/users/assign')}>View All</button>
            </div>
            <div className="table-responsive">
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Mentee</th>
                    <th>Mentor Assigned</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMappings.map((map, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className={`avatar-sm me-3 ${styles.bgIndigoSoft} rounded-circle p-2 fw-bold`}>
                            {map.StudentName.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark small">{map.StudentName}</div>
                            <div className="extra-small-text text-muted">ID: {map.id.toString().slice(-4)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="small fw-medium text-secondary">{map.StaffName}</td>
                      <td className="small text-muted">{map.FromDate}</td>
                      <td><span className={styles.badge + " " + styles.badgeActive}>Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Management Portal Hub  */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
            <h5 className="fw-bold mb-4 text-white d-flex align-items-center">
              <span className="material-symbols-rounded me-2">admin_panel_settings</span>
              Management Hub
            </h5>
            <div className="d-grid gap-3">
              <button className="btn w-100 text-start p-3 rounded-4 border-0 d-flex align-items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => router.push('/admin/users/staff')}>
                <div className="p-2 bg-info bg-opacity-10 rounded-3 text-info"><span className="material-symbols-rounded">person_add</span></div>
                <div>
                  <div className="fw-bold small text-white">Mentor Profiles</div>
                  <div className="extra-small-text text-white-50">Manage Faculty </div>
                </div>
              </button>

              <button className="btn w-100 text-start p-3 rounded-4 border-0 d-flex align-items-center gap-3"
                style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => router.push('/admin/users/students')}>
                <div className="p-2 bg-success bg-opacity-10 rounded-3 text-success"><span className="material-symbols-rounded">school</span></div>
                <div>
                  <div className="fw-bold small text-white">Student Enrollment</div>
                  <div className="extra-small-text text-white-50">Mentee Records </div>
                </div>
              </button>

              <button className="btn w-100 text-start p-3 rounded-4 border-0 d-flex align-items-center gap-3"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => router.push('/admin/users/assign')}>
                <div className="p-2 bg-primary rounded-3 text-white"><span className="material-symbols-rounded">link</span></div>
                <div>
                  <div className="fw-bold small text-white">Mentor Mapping</div>
                  <div className="extra-small-text text-white-50">Assign Pairs </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}