import { useAuth0 } from '@auth0/auth0-react';
import Layout from '../../components/Layout';

export default function AdminFiles() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Only allow admins with @quantumrecordings.ca email
  const isAdmin = user && user.email && user.email.endsWith("@quantumrecordings.ca");

  if (isLoading) return <Layout><p>Loading...</p></Layout>;
  if (!isAuthenticated || !isAdmin) {
    return <Layout><p style={{ color: "red", fontWeight: "bold" }}>Access denied. Admins only.</p></Layout>;
  }

  return (
    <div className="gh-root">
      <nav className="gh-navbar">
        <span className="gh-logo">Quantum Records</span>
        <div className="gh-navbar-profile">
          <img src={user.picture} alt={user.name} className="gh-avatar-small" />
          <span>{user.name}</span>
        </div>
      </nav>
      <div className="gh-main">
        <aside className="gh-sidebar">
          <div className="gh-profile">
            <img src={user.picture} alt={user.name} className="gh-avatar" />
            <h2 className="gh-profile-name">{user.name}</h2>
            <div className="gh-profile-email">{user.email}</div>
          </div>
          <nav className="gh-sidebar-nav">
            <a href="/" className="gh-sidebar-link">Dashboard</a>
            <a href="/profile" className="gh-sidebar-link">Profile</a>
            <a href="/announcements" className="gh-sidebar-link">Announcements</a>
            <a href="/admin/files" className="gh-sidebar-link gh-sidebar-link-active">Admin Files</a>
          </nav>
        </aside>
        <main className="gh-content">
          <section className="gh-section">
            <h2 className="gh-section-title">Admin Panel</h2>
            <p>Manage artist uploads and files here.</p>
            {/* Add file management UI here */}
          </section>
        </main>
      </div>
    </div>
  );
}