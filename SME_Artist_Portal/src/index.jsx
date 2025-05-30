import React, { useEffect, useState } from "react";
import { LoginButton, LogoutButton } from "../components/AuthButtons";
import { useAuth0 } from "@auth0/auth0-react";

const dummyArtists = [
  { name: "DJ Echo", role: "Producer", lastUpload: "2025-05-10", profileLink: "/dummy" },
  { name: "MC Nova", role: "Vocalist", lastUpload: "2025-05-15", profileLink: "/dummy" },
  { name: "Synth Shadow", role: "Composer", lastUpload: "2025-04-30", profileLink: "/dummy" },
];

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  const displayName = user?.nickname || user?.given_name || user?.name || user?.email || "";
  const isAdmin = user && user.email.endsWith("@quantumrecordings.ca");

  useEffect(() => {
    if (user) {
      setUploadStatus("Fetching files (mock)...");
      setTimeout(() => {
        setUploadedFiles([
          { id: 1, name: "mockfile1.wav", url: "/dummy" },
          { id: 2, name: "mockfile2.mp3", url: "/dummy" },
        ]);
        setUploadStatus("");
      }, 700);
    }
  }, [user]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;
    setUploadStatus("Uploading (mock)...");
    setTimeout(() => {
      setUploadStatus("✅ Upload successful (mock)");
      setUploadedFiles((prev) => [
        ...prev,
        { id: Date.now(), name: selectedFile.name, url: "/dummy" },
      ]);
      setSelectedFile(null);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="wire-root">
        <div className="wire-navbar">
          <div className="wire-logo">
            <span className="wire-logo-circle"></span>
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
            <span className="wire-logo-circle"></span>
            Quantum Records
          </div>
          <div className="wire-nav-group">
            <div className="wire-nav-pill">
              <a href="/dummy" className="wire-nav-link">Features</a>
              <a href="/dummy" className="wire-nav-link">Pricing</a>
              <a href="/dummy" className="wire-nav-link">FAQ</a>
              <a href="/dummy" className="wire-nav-link">
                <span role="img" aria-label="user">👤</span> Log In
              </a>
            </div>
            <button className="wire-nav-btn">GET STARTED</button>
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
            <a href="/dummy" className="wire-nav-link">Files</a>
            <a href="/dummy" className="wire-nav-link">Upload</a>
            <a href="/profile" className="wire-nav-link">Profile</a>
            <a href="/announcements" className="wire-nav-link">Announcements</a>
            {isAdmin && (
              <a href="/admin/files" className="wire-nav-link">Admin</a>
            )}
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
          <button
            className="wire-nav-btn"
            onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            GET STARTED
          </button>
        </div>
      </div>
      <img src={user.picture} alt={displayName} className="wire-profile-img" />
      <div className="wire-artist-name">{displayName}</div>
      <div className="wire-tagline">Your Artist Portal</div>
      <div className="wire-main-content">
        <div className="wire-card" id="upload-section">
          <h2>Upload Your Files</h2>
          <label className="wire-file-upload-label">
            Choose File
            <input
              type="file"
              onChange={handleFileChange}
              aria-label="Select file to upload"
              className="wire-file-input"
            />
          </label>
          {selectedFile && (
            <span style={{ marginLeft: 12, fontSize: "1rem" }}>{selectedFile.name}</span>
          )}
          <button
            onClick={handleFileUpload}
            disabled={!selectedFile || !user}
            aria-label="Upload File"
            className="wire-btn"
          >
            Upload File
          </button>
          {uploadStatus && (
            <p style={{ marginTop: 8, fontSize: "0.95em" }}>{uploadStatus}</p>
          )}
        </div>
        <div className="wire-card">
          <h2>Your Uploaded Files</h2>
          <ul className="wire-file-list">
            {uploadedFiles.map((file) => (
              <li key={file.id || file.url} className="wire-file-card">
                <div className="wire-file-icon">🎵</div>
                <div className="wire-file-name">{file.name}</div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wire-btn"
                  aria-label={`Download ${file.name}`}
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
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