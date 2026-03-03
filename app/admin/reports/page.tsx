"use client";
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminReportsPage() {
  const [stats, setStats] = useState({
    totalMentors: 0,
    totalMentees: 0,
    totalSessions: 0,
    avgStressLevel: 'Low'
  });

  const [mentorData, setMentorData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] = useState('mentor-wise');

  useEffect(() => {
    fetch('/api/admin/reports')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats({
            totalMentors: data.totalMentors,
            totalMentees: data.totalMentees,
            totalSessions: data.totalSessions,
            avgStressLevel: data.avgStressLevel || 'Not enough data'
          });
          setMentorData(data.mentorWise || []);
          setProgressData(data.progress || []);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableTitle = reportType === 'mentor-wise' ? 'Mentor-wise Report' : 'Progress Analytics Report';

    doc.setFontSize(18);
    // Setting blue title color
    doc.setTextColor(37, 99, 235);
    doc.text(tableTitle, 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Student Mentoring Management System Analytics', 14, 30);

    if (reportType === 'mentor-wise') {
      const tableColumn = ["ID", "Mentor Name", "Department", "Assigned Mentees", "Completion %", "Last Activity"];
      const tableRows: any[] = [];

      mentorData.forEach(mentor => {
        const rowData = [
          mentor.id,
          mentor.name,
          mentor.department,
          mentor.menteeCount,
          `${mentor.completedPercentage}%`,
          mentor.lastActivity
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 38,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }
      });
    } else {
      const tableColumn = ["Enrollment", "Student Name", "Mentor Name", "Learner Type", "Stress Level", "Progress %", "Last Activity"];
      const tableRows: any[] = [];

      progressData.forEach(student => {
        const rowData = [
          student.enrollmentNo,
          student.name,
          student.mentorName,
          student.learnerType,
          student.stressLevel,
          `${student.progressPercentage}%`,
          student.lastActivity
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 38,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }
      });
    }

    doc.save(`${reportType}-report.pdf`);
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-black text-dark mb-1">Reports & Analytics</h2>
        <p className="text-secondary fw-medium">Comprehensive university mentoring insights</p>
      </div>

      {/* Analytics Overview Cards */}
      <div className="row g-4 mb-5">
        {[
          { label: 'Active Mentors', value: stats.totalMentors, icon: 'engineering', color: 'indigo' },
          { label: 'Total Mentees', value: stats.totalMentees, icon: 'school', color: 'blue' },
          { label: 'Sessions Conducted', value: stats.totalSessions, icon: 'forum', color: 'success' },
          { label: 'Avg. Stress Level', value: stats.avgStressLevel, icon: 'psychology', color: 'warning' }
        ].map((item, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card-main border-0 shadow-sm bg-white p-4">
              <div className={`avatar-md-circle bg-${item.color}-soft text-${item.color} mb-3`}>
                <span className="material-symbols-rounded">{item.icon}</span>
              </div>
              <h3 className="fw-black mb-0">{item.value}</h3>
              <p className="extra-small fw-bold text-muted text-uppercase ls-1 mb-0">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Generator Section */}
      <div className="card-main border-0 shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3">
            <button
              className={`btn rounded-pill px-4 fw-bold ${reportType === 'mentor-wise' ? 'btn-indigo-glow' : 'btn-light border'}`}
              onClick={() => setReportType('mentor-wise')}
            >
              Mentor-wise Report
            </button>
            <button
              className={`btn rounded-pill px-4 fw-bold ${reportType === 'progress' ? 'btn-indigo-glow' : 'btn-light border'}`}
              onClick={() => setReportType('progress')}
            >
              Progress Analytics
            </button>
          </div>
          <button
            className="btn btn-outline-dark rounded-pill fw-bold px-4"
            onClick={handleExportPDF}
            disabled={loading}
          >
            <span className="material-symbols-rounded align-middle me-2">download</span> Export PDF
          </button>
        </div>

        <div className="table-responsive p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light-soft text-uppercase extra-small fw-bold text-secondary">
              <tr>
                <th className="ps-4 py-3">Reference</th>
                <th className="py-3">Details</th>
                <th className="py-3">Status/Level</th>
                <th className="py-3">Last Activity</th>
                <th className="pe-4 py-3 text-end">Trends</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : reportType === 'mentor-wise' ? (
                mentorData.map((mentor, index) => (
                  <tr key={index} className="border-bottom">
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{mentor.name}</div>
                      <div className="extra-small text-muted">ID: {mentor.id}</div>
                    </td>
                    <td>
                      <div className="small fw-medium">Assigned to: {mentor.menteeCount} Mentees</div>
                      <div className="extra-small text-muted">{mentor.department}</div>
                    </td>
                    <td>
                      <span className="badge bg-success-soft text-success rounded-pill px-3">Completed {mentor.completedPercentage}%</span>
                    </td>
                    <td className="small text-secondary">{mentor.lastActivity}</td>
                    <td className="pe-4 text-end">
                      <div className="progress" style={{ height: '6px', width: '100px', marginLeft: 'auto' }}>
                        <div className="progress-bar bg-indigo" style={{ width: `${mentor.completedPercentage}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                progressData.map((student, index) => (
                  <tr key={index} className="border-bottom">
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{student.name}</div>
                      <div className="extra-small text-muted">{student.enrollmentNo}</div>
                    </td>
                    <td>
                      <div className="small fw-medium">Learner Type: {student.learnerType}</div>
                      <div className="extra-small text-muted">Mentor: {student.mentorName}</div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 ${student.stressLevel === 'High' ? 'bg-danger-soft text-danger' : student.stressLevel === 'Medium' ? 'bg-warning-soft text-warning' : 'bg-success-soft text-success'}`}>
                        Stress: {student.stressLevel}
                      </span>
                    </td>
                    <td className="small text-secondary">{student.lastActivity}</td>
                    <td className="pe-4 text-end">
                      <div className="progress" style={{ height: '6px', width: '100px', marginLeft: 'auto' }}>
                        <div className={`progress-bar ${student.progressPercentage > 50 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${student.progressPercentage}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .bg-indigo-soft { background: #eef2ff; color: #6366f1; }
        .bg-blue-soft { background: #eff6ff; color: #2563eb; }
        .bg-success-soft { background: #ecfdf5; color: #10b981; }
        .bg-warning-soft { background: #fffbeb; color: #f59e0b; }
        .bg-danger-soft { background: #fef2f2; color: #ef4444; }
        
        .avatar-md-circle {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }

        .ls-1 { letter-spacing: 0.5px; }
      `}</style>
    </div>
  );
}