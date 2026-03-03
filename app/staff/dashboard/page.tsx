"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../staff.module.css';

export default function StaffDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/staff/dashboard')
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard:", err);
        setLoading(false);
      });
  }, []);

  const stats = dashboardData ? [
    { label: 'Total Mentees', value: String(dashboardData.totalMentees).padStart(2, '0'), icon: 'groups', color: '#4f46e5', trend: `${dashboardData.totalMentees} assigned`, percentage: Math.min(dashboardData.totalMentees * 2, 100) },
    { label: 'Pending Feedback', value: String(dashboardData.pendingFeedbackCount).padStart(2, '0'), icon: 'pending_actions', color: '#f59e0b', trend: dashboardData.pendingFeedbackCount > 0 ? 'Needs attention' : 'All clear', percentage: Math.min(dashboardData.pendingFeedbackCount * 10, 100) },
    { label: 'Avg. Attendance', value: `${dashboardData.attendancePercentage}%`, icon: 'leaderboard', color: '#10b981', trend: dashboardData.attendancePercentage >= 80 ? 'Above target' : 'Below target', percentage: dashboardData.attendancePercentage },
    { label: 'High Stress Alert', value: String(dashboardData.highStressCount).padStart(2, '0'), icon: 'priority_high', color: '#ef4444', trend: dashboardData.highStressCount > 0 ? 'Immediate action' : 'No alerts', percentage: Math.min(dashboardData.highStressCount * 15, 100) },
  ] : [];

  // Generate Report Logic (CSV)
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    const reportData = [
      ["Student Name", "Enrollment No", "Last Meeting", "Stress Status", "Attendance"],
      ...(dashboardData?.recentActivity || []).map((a: any) => [
        a.studentName,
        a.enrollmentNo,
        a.lastMeeting ? new Date(a.lastMeeting).toLocaleDateString() : 'N/A',
        a.stressLevel,
        a.attendance
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8,"
      + reportData.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Mentoring_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsGenerating(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3 fw-bold text-muted">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="d-flex align-items-center mb-5 p-4 rounded-5 bg-card-custom shadow-sm border-start border-primary border-5">
        <div className="bg-primary-soft p-3 rounded-4 me-4">
          <span className="material-symbols-rounded fs-1 text-primary">analytics</span>
        </div>
        <div>
          <h2 className="fw-black text-dark-main mb-1">Faculty Overview</h2>
          <p className="text-muted mb-0 fw-medium">
            Managing {dashboardData?.totalMentees || 0} mentees
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`${styles.btnStaffPrimary} ms-auto d-none d-md-flex align-items-center gap-2`}
        >
          {isGenerating ? (
            <span className="spinner-border spinner-border-sm" role="status"></span>
          ) : (
            <span className="material-symbols-rounded fs-5">download</span>
          )}
          {isGenerating ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* METRICS GRID */}
      <div className="row g-4 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="col-12 col-md-6 col-lg-3">
            <div className={`${styles.managementCard} h-100 position-relative`}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-2 rounded-3 shadow-sm" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                  <span className="material-symbols-rounded">{s.icon}</span>
                </div>
                <span className="extra-small-text fw-bold px-2 py-1 rounded-pill" style={{ backgroundColor: `${s.color}10`, color: s.color }}>
                  {s.trend}
                </span>
              </div>
              <h6 className="text-uppercase text-muted extra-small-text fw-bold ls-1 mb-1">{s.label}</h6>
              <h3 className="fw-black mb-2 text-dark-main">{s.value}</h3>
              <div className="progress mt-3" style={{ height: '4px', backgroundColor: 'var(--border-light)' }}>
                <div className="progress-bar" style={{ width: `${s.percentage}%`, backgroundColor: s.color }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* RECENT ACTIVITY TABLE */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-card-custom">
            <div className="card-header bg-transparent py-4 px-4 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark-main">Recent Mentee Activity</h5>
              <Link href="/staff/mentees" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold extra-small-text">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light-soft">
                    <tr>
                      <th className="extra-small-text border-0 ps-4 py-3 text-muted">STUDENT</th>
                      <th className="extra-small-text border-0 py-3 text-muted">LAST MEETING</th>
                      <th className="extra-small-text border-0 py-3 text-muted">STATUS</th>
                      {/* <th className="extra-small-text border-0 text-end pe-4 py-3 text-muted">ACTION</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboardData?.recentActivity || []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">No recent activity found.</td>
                      </tr>
                    )}
                    {(dashboardData?.recentActivity || []).map((activity: any, i: number) => {
                      const stressColor = activity.stressLevel === 'High' ? 'danger' : activity.stressLevel === 'Moderate' ? 'warning' : 'success';
                      return (
                        <tr key={i}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center py-2">
                              <div className={`avatar-initials-sm bg-${stressColor}-soft text-${stressColor} me-3`}>
                                {activity.studentName.charAt(0)}
                              </div>
                              <div>
                                <p className="mb-0 fw-bold small text-dark-main">{activity.studentName}</p>
                                <p className="mb-0 extra-small-text text-muted">ID: {activity.enrollmentNo}</p>
                              </div>
                            </div>
                          </td>
                          <td className="small text-muted">
                            {activity.lastMeeting ? new Date(activity.lastMeeting).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles['status' + activity.stressLevel]}`}>
                              {activity.stressLevel}
                            </span>
                          </td>
                          {/* <td className="text-end pe-4">
                            <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold extra-small-text text-dark-main">Details</button>
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}