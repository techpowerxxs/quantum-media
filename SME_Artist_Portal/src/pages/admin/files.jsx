import { useAuth0 } from '@auth0/auth0-react';

export default function AdminFiles() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Only allow admins with @quantumrecordings.ca email
  const isAdmin = user && user.email && user.email.endsWith("@quantumrecordings.ca");

  if (isLoading) {
    return (
      <div className="mega-root">
        <div className="mega-navbar">Quantum Records</div>
        <div className="mega-main">
          <div className="mega-card" style={{ textAlign: "center" }}>Loading...</div>
        </div>
      </div>
    );
  }
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="mega-root">
        <div className="mega-navbar">Quantum Records</div>
        <div className="mega-main">
          <div className="mega-card" style={{ color: "#e74c3c", fontWeight: "bold", textAlign: "center" }}>
            Access denied. Admins only.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mega-root">
      {/* Navbar */}
      <nav className="mega-navbar">
        <span className="mega-logo">Quantum Records</span>
      </nav>

      {/* Sidebar */}
      <aside className="mega-sidebar">
        <div className="mega-profile">
          <img src={user.picture} alt={user.name} className="mega-avatar-large" />
          <h2 className="mega-profile-name">{user.name}</h2>
          <div className="mega-profile-email">{user.email}</div>
        </div>
        <nav className="mega-sidebar-nav">
          <a href="/dummy" className="mega-sidebar-link">Dashboard</a>
          <a href="/profile" className="mega-sidebar-link">Profile</a>
          <a href="/announcements" className="mega-sidebar-link">Announcements</a>
          <a href="/admin/files" className="mega-sidebar-link mega-sidebar-link-active">Admin Files</a>
          <a href="/dummy" className="mega-sidebar-link">Dummy Link</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="mega-main">
        <section className="mega-card mega-admin-panel">
          <h2 className="mega-section-title">Admin Panel</h2>
          <p style={{ marginBottom: 24 }}>Manage artist uploads and files here.</p>
          <div className="mega-file-list">
            {/* Example file cards */}
            <div className="mega-file-card">
              <div className="mega-file-icon">🎵</div>
              <div className="mega-file-name">track01.wav</div>
              <button className="mega-btn mega-btn-danger">Delete</button>
            </div>
            <div className="mega-file-card">
              <div className="mega-file-icon">🎤</div>
              <div className="mega-file-name">vocal_take.mp3</div>
              <button className="mega-btn mega-btn-danger">Delete</button>
            </div>
            {/* Dummy file card link example */}
            <div className="mega-file-card">
              <div className="mega-file-icon">📄</div>
              <div className="mega-file-name">dummy_file.txt</div>
              <a href="/dummy" className="mega-btn">Open Dummy</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}