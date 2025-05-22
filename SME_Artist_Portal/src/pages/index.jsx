import { useAuth0 } from '@auth0/auth0-react';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Shared GitHub-style layout for all states
  function GitHubShell({ children }) {
    return (
      <div className="gh-root">
        <nav className="gh-navbar">
          <span className="gh-logo">Quantum Records</span>
        </nav>
        <div className="gh-main">
          <aside className="gh-sidebar">
            <div className="gh-profile">
              <div className="gh-avatar" style={{ background: "#e1e4e8", width: 80, height: 80, margin: "0 auto 12px", borderRadius: "50%" }} />
              <h2 className="gh-profile-name">Quantum Records</h2>
              <div className="gh-profile-email" style={{ color: "#586069" }}>dashboard</div>
            </div>
          </aside>
          <main className="gh-content">
            <section className="gh-section" style={{ textAlign: "center" }}>
              {children}
            </section>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <GitHubShell>
        <div style={{ fontSize: "1.2rem", color: "#586069" }}>Loading…</div>
      </GitHubShell>
    );
  }
  if (!isAuthenticated) {
    return (
      <GitHubShell>
        <div style={{ fontSize: "1.2rem", color: "#586069" }}>
          Please log in to view your dashboard.
        </div>
      </GitHubShell>
    );
  }
  if (!user) {
    return (
      <GitHubShell>
        <div style={{ fontSize: "1.2rem", color: "#d73a49" }}>User not found.</div>
      </GitHubShell>
    );
  }

  return (
    <div className="gh-root">
      {/* Top Navbar */}
      <nav className="gh-navbar">
        <span className="gh-logo">Quantum Records</span>
        <div className="gh-navbar-profile">
          <img src={user.picture} alt={user.name} className="gh-avatar-small" />
          <span>{user.name}</span>
        </div>
      </nav>
      <div className="gh-main">
        {/* Sidebar */}
        <aside className="gh-sidebar">
          <div className="gh-profile">
            <img src={user.picture} alt={user.name} className="gh-avatar" />
            <h2 className="gh-profile-name">{user.name}</h2>
            <div className="gh-profile-email">{user.email}</div>
          </div>
          <nav className="gh-sidebar-nav">
            <a href="/" className="gh-sidebar-link gh-sidebar-link-active">Dashboard</a>
            <a href="/profile" className="gh-sidebar-link">Profile</a>
            <a href="/announcements" className="gh-sidebar-link">Announcements</a>
            <a href="/admin/files" className="gh-sidebar-link">Admin Files</a>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="gh-content">
          <section className="gh-section">
            <h2 className="gh-section-title">Welcome, {user.name}</h2>
            <p>This is your Quantum Records artist dashboard.</p>
            <div className="gh-profile-details">
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              {/* Add more profile details here if desired */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}