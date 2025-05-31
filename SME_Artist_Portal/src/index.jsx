import React, { useEffect, useState } from "react";
import { LoginButton, LogoutButton } from "../components/AuthButtons";
import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";
// Import the helper to get recent files from your files page
import { getRecentFilesForUser } from "./files";

const dummyArtists = [
  { name: "DJ Echo", role: "Producer", lastUpload: "2025-05-10", profileLink: "/dummy" },
  { name: "MC Nova", role: "Vocalist", lastUpload: "2025-05-15", profileLink: "/dummy" },
  { name: "Synth Shadow", role: "Composer", lastUpload: "2025-04-30", profileLink: "/dummy" },
];

// Import the same mock file system as in files.jsx for demo purposes
const initialMockFileSystem = {
  "SapphireDVD": {
    "Content": {
      "Audio": {
        "track1.wav": { type: "audio", uploadedAt: "2025-05-30T12:00:00Z" },
        "track2.wav": { type: "audio", uploadedAt: "2025-05-29T12:00:00Z" }
      },
      "Images": {
        "cover.jpg": { type: "image", uploadedAt: "2025-05-28T12:00:00Z" }
      }
    },
    "Notes.txt": { type: "text", uploadedAt: "2025-05-27T12:00:00Z" }
  },
  "DJ_Echo": {
    "beats": {
      "beat1.wav": { type: "audio", uploadedAt: "2025-05-29T12:00:00Z" }
    }
  }
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [recentFiles, setRecentFiles] = useState([]);

  const displayName = user?.nickname || user?.given_name || user?.name || user?.email || "";
  const isAdmin = user && user.email.endsWith("@quantumrecordings.ca");

  useEffect(() => {
    if (user) {
      // Use the helper to get recent files for the signed-in user
      const artistRoot = user.nickname || user.given_name || user.name || user.email.split("@")[0];
      setRecentFiles(getRecentFilesForUser(initialMockFileSystem, artistRoot, 5));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="wire-root">
        <div className="wire-navbar">
          <div className="wire-logo">
             Quantum Records
          </div>
        </div>
        <div className="wire-main-content">
          <div className="wire-card">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wire-root">
        <div className="wire-navbar">
        <div className="wire-logo">
          <img
            src="https://media.quantumrecordings.ca/assets/images/favicon.png"
            alt="Quantum Records Logo"
            style={{ width: 38, height: 38, borderRadius: "50%", marginRight: 12, background: "#35323a" }}
          />
          Quantum Records
        </div>
        <div className="wire-nav-group">
          <div className="wire-nav-pill">
            <a href="/files" className="wire-nav-link">Files</a>
            <a href="/files?upload=1" className="wire-nav-link">Upload</a>
            <a href="/profile" className="wire-nav-link">Profile</a>
            <a href="/announcements" className="wire-nav-link">Announcements</a>
            {isAdmin && (
              <a href="/admin/files" className="wire-nav-link">Admin</a>
            )}
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
          <button
            className="wire-nav-btn"
            onClick={() => window.location.href = "/files"}
          >
            GET STARTED
          </button>
        </div>
      </div>
        <div className="wire-main-content">
          <div className="wire-card">
            <h1>Welcome!</h1>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wire-root">
      <div className="wire-navbar">
        <div className="wire-logo">
          <span className="wire-logo-circle"></span>
          Quantum Records
        </div>
        <div className="wire-nav-group">
          <div className="wire-nav-pill">
            <Link href="/files" className="wire-nav-link">Files</Link>
            <Link href="/files?upload=1" className="wire-nav-link">Upload</Link>
            <Link href="/profile" className="wire-nav-link">Profile</Link>
            <Link href="/announcements" className="wire-nav-link">Announcements</Link>
            {isAdmin && (
              <Link href="/admin/files" className="wire-nav-link">Admin</Link>
            )}
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
          <button
            className="wire-nav-btn"
            onClick={() => window.location.href = "/files"}
          >
            GET STARTED
          </button>
        </div>
      </div>
      <img src={user.picture} alt={displayName} className="wire-profile-img" />
      <div className="wire-artist-name">{displayName}</div>
      <div className="wire-tagline">Your Artist Portal</div>
      <div className="wire-main-content">
        {/* Recently Uploaded Files */}
        <div className="wire-card">
          <h2>Recently Uploaded Files</h2>
          <ul className="wire-file-list">
            {recentFiles.length === 0 && (
              <li className="wire-file-card" style={{ color: "#888" }}>
                No recent files found.
              </li>
            )}
            {recentFiles.map((file) => (
              <li key={file.name + file.uploadedAt} className="wire-file-card">
                <div className="wire-file-icon">
                  {file.type === "image" ? "🖼️" : file.type === "audio" ? "🎵" : file.type === "text" ? "📄" : "📦"}
                </div>
                <div className="wire-file-name">{file.name}</div>
                <div style={{ fontSize: "0.9em", color: "#888", marginBottom: 8 }}>
                  Uploaded: {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString() : ""}
                </div>
                <a
                  href="#"
                  className="wire-btn"
                  aria-label={`Download ${file.name}`}
                  style={{ pointerEvents: "none", opacity: 0.5 }}
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 16 }}>
            <Link href="/files" className="wire-btn">
              Go to File Explorer
            </Link>
            <Link href="/files?upload=1" className="wire-btn" style={{ marginLeft: 8 }}>
              Upload New File
            </Link>
          </div>
        </div>
        <div className="wire-card">
          <h2>Quick Links</h2>
          <a
            href="https://files.backend.quantumrecordings.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="wire-btn"
          >
            File Portal
          </a>
          <a href="/announcements" className="wire-btn">
            Announcements
          </a>
          <a href="/profile" className="wire-btn">
            Edit Profile
          </a>
          {isAdmin && (
            <a href="/admin/files" className="wire-btn">
              Admin
            </a>
          )}
          <a href="/dummy" className="wire-btn">
            Dummy Link
          </a>
        </div>
        <div className="wire-card">
          <h2>Artist Dashboards</h2>
          <ul className="wire-file-list">
            {dummyArtists.map((artist) => (
              <li className="wire-file-card artist-card" key={artist.profileLink}>
                <div className="wire-file-name">{artist.name}</div>
                <div className="card-desc">Role: {artist.role}</div>
                <div className="card-desc">Last Upload: {artist.lastUpload}</div>
                <a
                  href={artist.profileLink}
                  className="wire-btn"
                  aria-label={`View ${artist.name} Dashboard`}
                >
                  View Dashboard
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}