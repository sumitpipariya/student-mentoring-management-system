import StudentNavbar from '@/components/student/StudentNavbar';
import StudentSidebar from '@/components/student/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex min-vh-100 bg-light-gray">
      {/* 1. SIDEBAR - Fixed Width */}
      <aside 
        className="d-none d-lg-block border-end bg-white" 
        style={{ width: '280px', position: 'fixed', height: '100vh', zIndex: 1030 }}
      >
        <StudentSidebar />
      </aside>

      {/* 2. MAIN WRAPPER - Offset by Sidebar width */}
      <div className="flex-grow-1 d-flex flex-column main-wrapper">
        <StudentNavbar />
        
        {/* 3. MAIN CONTENT CONTAINER */}
        <main className="p-1 p-md-4 p-lg-3" style={{ marginTop: '70px' }}>
          <div className="container-fluid">
            
            {/* THE CONTENT CARD WRAPPER */}
            <div className="card border-0 shadow-premium content-card animate-fade-in mt-3">
              <div className="card-body p-4 p-md-3 ">
                {children}
              </div>
            </div>

          </div>
        </main>

        <footer className="text-center pb-4 text-muted small">
          © 2026 Student Mentoring Management System
        </footer>
      </div>
    </div>
  );
}