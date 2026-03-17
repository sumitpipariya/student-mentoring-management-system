"use client";
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function StudentDashboard() {
  const [showAgenda, setShowAgenda] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setDashboardData(data);
        } else {
          // Set default data when API returns an error (e.g. no mentor assigned)
          setDashboardData({
            attendancePercentage: 0,
            stressLevel: 'N/A',
            learnerType: 'N/A',
            nextSessionDate: null,
            nextSessionAgenda: 'No sessions scheduled',
            chartData: {
              labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              data: [0, 0, 0, 0, 0]
            }
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setDashboardData({
          attendancePercentage: 0,
          stressLevel: 'N/A',
          learnerType: 'N/A',
          nextSessionDate: null,
          nextSessionAgenda: 'Unable to load',
          chartData: {
            labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [0, 0, 0, 0, 0]
          }
        });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-5 text-center">Loading dashboard...</div>;
  if (!dashboardData) return <div className="p-5 text-center">Loading dashboard...</div>;

  const nextDateFormatted = dashboardData.nextSessionDate
    ? new Date(dashboardData.nextSessionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    : 'Not Scheduled';

  const metrics = [
    { label: 'Attendance', value: `${dashboardData.attendancePercentage}%`, icon: 'task_alt', color: '#10b981', trend: 'Average' },
    { label: 'Stress Level', value: dashboardData.stressLevel, icon: 'psychology', color: '#6366f1', trend: 'Latest' },
    { label: 'Learner Type', value: dashboardData.learnerType, icon: 'visibility', color: '#f59e0b', trend: 'Profile' },
    { label: 'Next Session', value: nextDateFormatted, icon: 'event_upcoming', color: '#3b82f6', trend: 'Scheduled' },
  ];

  // Chart Data Configuration
  const chartData = {
    labels: dashboardData.chartData?.labels || ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        fill: true,
        label: 'Attendance %',
        data: dashboardData.chartData?.data || [0, 0, 0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { min: 0, max: 100, grid: { display: false } },
      x: { grid: { display: false } }
    },
  };

  return (
    <div className="container-fluid py-4 animate-fade-in">

      {/* 2. Welcome Header */}
      <div className="d-flex align-items-center gap-4 mb-4">
        <div className="welcome-icon-box bg-indigo">
          <span className="material-symbols-rounded text-white fs-2">school</span>
        </div>
        <div>
          <h2 className="fw-black text-dark mb-1">Academic Overview</h2>
          <p className="text-secondary fw-medium mb-0">Track your mentoring progress and session outcomes.</p>
        </div>
      </div>

      {/* 3. Metrics Grid */}
      <div className="row g-4 mb-4">
        {metrics.map((m) => (
          <div key={m.label} className="col-12 col-md-6 col-lg-3">
            <div className="card-stat shadow-sm bg-white border-0 h-100">
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="stat-icon-wrapper" style={{ backgroundColor: `${m.color}10`, color: m.color }}>
                    <span className="material-symbols-rounded fs-5">{m.icon}</span>
                  </div>
                  <div className="extra-small-text fw-bold" style={{ color: m.color }}>{m.trend}</div>
                </div>
                <h6 className="text-uppercase text-secondary fw-bold extra-small-text ls-1 mb-1">{m.label}</h6>
                <h4 className="fw-black mb-0 text-dark fs-4">{m.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* 4. Attendance Chart (NEW) */}
        <div className="col-12 col-xl-5">
          <div className="card-main border-0 shadow-sm h-100 bg-white p-4">
            <h5 className="fw-bold mb-1 text-dark">Attendance Trend</h5>
            <p className="small text-muted mb-4">Monthly participation percentage</p>
            <div style={{ height: '220px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* 5. Upcoming Session */}
        <div className="col-12 col-xl-7">
          <div className="card-main border-0 shadow-sm h-100 bg-white overflow-hidden">
            <div className="card-header-glass d-flex justify-content-between align-items-center p-4 border-bottom">
              <h5 className="fw-bold mb-0 text-indigo">Next Mentoring Session</h5>
              <span className="badge-live">UPCOMING</span>
            </div>
            <div className="p-4">
              <div className="session-highlight-box border p-4 rounded-4 bg-light-soft">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center mb-3 text-indigo fw-bold">
                      <span className="material-symbols-rounded me-2">calendar_month</span>
                      {dashboardData.nextSessionDate ? new Date(dashboardData.nextSessionDate).toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Date not set'}
                    </div>
                    <h4 className="fw-bold text-dark mb-2">{dashboardData.nextSessionAgenda}</h4>
                    <p className="text-muted small mb-0">Upcoming discussion agenda point.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}