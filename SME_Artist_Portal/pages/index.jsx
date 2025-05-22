import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { auth0Client } from "../lib/auth0";
// import "./dashboard.css";

const dummyArtists = [
  {
    name: "DJ Echo",
    role: "Producer",
    lastUpload: "2025-05-10",
    profileLink: "/profile/echo",
  },
  {
    name: "MC Nova",
    role: "Vocalist",
    lastUpload: "2025-05-15",
    profileLink: "/profile/nova",
  },
  {
    name: "Synth Shadow",
    role: "Composer",
    lastUpload: "2025-04-30",
    profileLink: "/profile/shadow",
  },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    auth0Client.getUser().then(setUser);
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`/api/files?user=${user.email}`)
        .then((res) => res.json())
        .then(setUploadedFiles)
        .catch(() => setUploadStatus("❌ Error fetching files"));
    }
  }, [user]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("uploader", user.email);

    try {
      const response = await fetch("https://vps.yourlabel.com/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setUploadStatus("✅ Upload successful");
        setSelectedFile(null);
        fetch(`/api/files?user=${user.email}`)
          .then((res) => res.json())
          .then(setUploadedFiles)
          .catch(() => setUploadStatus("❌ Error fetching files"));
      } else {
        setUploadStatus("❌ Upload failed");
      }
    } catch (err) {
      setUploadStatus("❌ Error uploading file");
    }
  };

  if (!user) {
    return (
      <div className="dashboard-container" style={{ textAlign: "center" }}>
        <h1 className="dashboard-title" style={{ marginBottom: 16 }}>
          Please log in to access the portal.
        </h1>
        <button className="button" onClick={() => auth0Client.loginWithRedirect()}>
          Login
        </button>
      </div>
    );
  }

  const isAdmin = user.email.endsWith("@yourlabel.com");

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user.name}!</h1>
      <div className="card-grid">
        <div className="card">
          <div className="card-title">🎵 Downloads</div>
          <div className="card-desc">Access label files securely.</div>
          <a
            href="https://files.backend.yourlabel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="button"
            aria-label="Open File Portal"
          >
            Open File Portal
          </a>
        </div>
        <div className="card">
          <div className="card-title">📢 Announcements</div>
          <div className="card-desc">Read the latest label updates.</div>
          <a href="/announcements" className="button" aria-label="Go to Announcements">
            Go to Announcements
          </a>
        </div>
        <div className="card">
          <div className="card-title">📄 Artist Profile</div>
          <div className="card-desc">View or update your profile.</div>
          <a href="/profile" className="button" aria-label="Edit Profile">
            Edit Profile
          </a>
        </div>
      </div>

      <div className="section">
        <div className="section-title">⬆️ Upload Your Files</div>
        <div className="upload-box">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4"
            aria-label="Select file to upload"
          />
          <button
            className="button"
            onClick={handleFileUpload}
            disabled={!selectedFile || !user}
            aria-label="Upload File"
          >
            Upload File
          </button>
          {uploadStatus && <p style={{ marginTop: 8, fontSize: "0.95em" }}>{uploadStatus}</p>}
          <p style={{ fontSize: "0.85em", color: "#888", marginTop: 8 }}>
            Only admins and you can access your uploaded files.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="section-title">📁 Your Uploaded Files</div>
        <ul className="file-list">
          {uploadedFiles.map((file) => (
            <li key={file.id || file.url}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${file.name}`}
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <div className="section">
          <div className="section-title">🛠 Admin Panel</div>
          <div className="admin-panel">
            <p>View and manage all artist uploads.</p>
            <a href="/admin/files" className="button" aria-label="Open File Manager">
              Open File Manager
            </a>
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-title">🎤 Artist Dashboards</div>
        <div className="artist-card-grid">
          {dummyArtists.map((artist) => (
            <div className="card artist-card" key={artist.profileLink}>
              <div className="card-title">{artist.name}</div>
              <div className="card-desc">Role: {artist.role}</div>
              <div className="card-desc">Last Upload: {artist.lastUpload}</div>
              <a href={artist.profileLink} className="button" aria-label={`View ${artist.name} Dashboard`}>
                View Dashboard
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}