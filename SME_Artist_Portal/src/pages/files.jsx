import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../components/AuthButtons";
import { useRouter } from "next/router";

// Helper to deep clone the file system object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Helper to auto-generate starter folders for a new artist
function generateDefaultArtistFS(artistName) {
  return {
    Content: {
      Audio: {},
      Images: {},
      Stems: {},
      Projects: {},
      Lyrics: {},
      Video: {},
      Docs: {},
    },
    "Notes.txt": { type: "text", uploadedAt: new Date().toISOString() }
  };
}

// Initial mock file system with uploadedAt
const initialMockFileSystem = {
  "SapphireDVD": generateDefaultArtistFS("SapphireDVD"),
  "DJ_Echo": generateDefaultArtistFS("DJ_Echo"),
};

// Helper to get node at a path
function getNode(fs, pathArr) {
  let node = fs;
  for (const part of pathArr) {
    if (node && typeof node === "object") node = node[part];
    else return null;
  }
  return node;
}

// Helper to set node at a path (mutates fs)
function setNode(fs, pathArr, value) {
  let node = fs;
  for (let i = 0; i < pathArr.length - 1; i++) {
    node = node[pathArr[i]];
  }
  node[pathArr[pathArr.length - 1]] = value;
}

// Helper to delete node at a path (mutates fs)
function deleteNode(fs, pathArr) {
  let node = fs;
  for (let i = 0; i < pathArr.length - 1; i++) {
    node = node[pathArr[i]];
  }
  delete node[pathArr[pathArr.length - 1]];
}

// Helper to recursively collect all files in a user's tree
function collectFiles(node, pathArr = []) {
  let files = [];
  if (typeof node !== "object" || node === null) return files;
  for (const [name, value] of Object.entries(node)) {
    if (typeof value === "object" && value.type) {
      files.push({
        name,
        path: [...pathArr, name],
        ...value
      });
    } else if (typeof value === "object") {
      files = files.concat(collectFiles(value, [...pathArr, name]));
    }
  }
  return files;
}

// Exported helper for main page to get recent files
export function getRecentFilesForUser(fs, artistRoot, count = 5) {
  const userRoot = fs[artistRoot];
  if (!userRoot) return [];
  const allFiles = collectFiles(userRoot);
  return allFiles
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, count);
}

function getFolderTree(node, path = []) {
  // Recursively collect folder paths for sidebar
  let folders = [];
  if (typeof node !== "object" || node === null) return folders;
  for (const [name, value] of Object.entries(node)) {
    if (typeof value === "object" && !value.type) {
      folders.push({ name, path: [...path, name] });
      folders = folders.concat(getFolderTree(value, [...path, name]));
    }
  }
  return folders;
}

export default function FilesPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [mockFS, setMockFS] = useState(initialMockFileSystem);
  const [path, setPath] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [viewFile, setViewFile] = useState(null);

  const router = useRouter();

  // Open upload modal if ?upload=1
  useEffect(() => {
    if (router.query.upload === "1") setShowUpload(true);
  }, [router.query]);

  // Normalize artist root
  const artistRoot = user?.nickname || user?.given_name || user?.name || user?.email?.split("@")[0];

  // Auto-generate folders for new users
  useEffect(() => {
    if (user && artistRoot && !mockFS[artistRoot]) {
      setMockFS(fs => ({
        ...fs,
        [artistRoot]: generateDefaultArtistFS(artistRoot)
      }));
    }
    // eslint-disable-next-line
  }, [user, artistRoot]);

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
          <div className="wire-card"><h2>Loading...</h2></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
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
            <h1>Welcome!</h1>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  if (!mockFS[artistRoot]) {
    // Wait for auto-generation to complete
    return null;
  }

  // Only allow navigation within the artist's own folders
  const currentNode = getNode(mockFS, [artistRoot, ...path]) || {};

  // Path bar
  const pathBar = [artistRoot, ...path];
  const handlePathClick = (idx) => {
    setPath(path.slice(0, idx));
  };

  // Upload handler (mock)
  const handleUpload = () => {
    if (!uploadFile) return;
    const ext = uploadFile.name.split(".").pop().toLowerCase();
    const fileType = ["jpg", "jpeg", "png", "gif"].includes(ext)
      ? "image"
      : ["wav", "mp3", "ogg"].includes(ext)
      ? "audio"
      : ["txt", "md"].includes(ext)
      ? "text"
      : "file";
    const now = new Date().toISOString();
    setMockFS(fs => {
      const newFS = deepClone(fs);
      setNode(newFS, [artistRoot, ...path, uploadFile.name], { type: fileType, uploadedAt: now });
      return newFS;
    });
    setShowUpload(false);
    setUploadFile(null);
  };

  // Create folder handler (mock)
  const handleCreateFolder = () => {
    if (!newFolderName) return;
    setMockFS(fs => {
      const newFS = deepClone(fs);
      setNode(newFS, [artistRoot, ...path, newFolderName], {});
      return newFS;
    });
    setShowNewFolder(false);
    setNewFolderName("");
  };

  // Create file handler (mock)
  const handleCreateFile = () => {
    if (!newFileName) return;
    const now = new Date().toISOString();
    setMockFS(fs => {
      const newFS = deepClone(fs);
      setNode(newFS, [artistRoot, ...path, newFileName], { type: "text", uploadedAt: now });
      return newFS;
    });
    setShowNewFile(false);
    setNewFileName("");
  };

  // Delete handler (mock)
  const handleDelete = (name) => {
    setMockFS(fs => {
      const newFS = deepClone(fs);
      deleteNode(newFS, [artistRoot, ...path, name]);
      return newFS;
    });
  };

  // View handler (mock)
  const handleView = (name, fileObj) => {
    setViewFile({ name, ...fileObj });
  };

  // Render file/folder list
  const entries = Object.entries(currentNode);

  // Sidebar folder tree
  const folderTree = [{ name: artistRoot, path: [] }, ...getFolderTree(mockFS[artistRoot])];

  // --- Quantum Records site color palette & improved alignment ---
  const styles = {
    sidebar: {
      width: 220,
      background: "linear-gradient(180deg, #FFD600 0%, #6C1AFF 100%)",
      color: "#fff",
      padding: "24px 0 0 0",
      borderRight: "none",
      overflowY: "auto",
      height: "100vh",
      boxSizing: "border-box"
    },
    sidebarButton: (active) => ({
      background: active ? "rgba(255,255,255,0.18)" : "none",
      color: "#fff",
      border: "none",
      width: "100%",
      textAlign: "left",
      padding: "8px 24px",
      cursor: "pointer",
      borderRadius: 0,
      fontWeight: active ? 700 : 400,
      fontSize: 16,
      transition: "background 0.15s"
    }),
    main: {
      flex: 1,
      background: "linear-gradient(135deg, #120016 0%, #6C1AFF 100%)",
      color: "#fff",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    },
    pathBar: {
      padding: "16px 32px 0 32px",
      fontWeight: 600,
      fontSize: "1.2rem",
      display: "flex",
      alignItems: "center",
      minHeight: 48,
      background: "rgba(255, 214, 0, 0.12)",
      borderBottom: "2px solid #FFD600"
    },
    actions: {
      padding: "16px 32px 0 32px",
      display: "flex",
      gap: 18,
      borderBottom: "2px solid #FFD600",
      background: "rgba(255, 214, 0, 0.08)"
    },
    tableWrap: {
      padding: "32px",
      flex: 1,
      overflow: "auto",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center"
    },
    tableCard: {
      width: "100%",
      maxWidth: 1100,
      background: "rgba(30,0,40,0.95)",
      borderRadius: 18,
      boxShadow: "0 4px 24px #12001655",
      overflow: "hidden",
      border: "2px solid #FFD600"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      textAlign: "left",
      padding: "16px 18px",
      background: "#FFD600",
      color: "#6C1AFF",
      fontWeight: 700,
      fontSize: 17,
      borderBottom: "2px solid #6C1AFF"
    },
    td: {
      padding: "16px 18px",
      borderBottom: "1.5px solid #FFD600",
      color: "#fff",
      fontSize: 16,
      verticalAlign: "middle"
    },
    row: {
      background: "none",
      transition: "background 0.15s"
    },
    rowHover: {
      background: "rgba(255, 214, 0, 0.08)"
    },
    actionBtn: {
      minWidth: 48,
      minHeight: 40,
      borderRadius: 12,
      border: "none",
      fontSize: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 2px 8px #12001622"
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#120016" }}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 28, textAlign: "center", color: "#6C1AFF", textShadow: "0 1px 8px #FFD600" }}>
          Folders
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {folderTree.map(folder => (
            <li key={folder.path.join("/")} style={{ marginBottom: 2 }}>
              <button
                style={styles.sidebarButton(path.join("/") === folder.path.join("/"))}
                onClick={() => setPath(folder.path)}
              >
                <span style={{ marginRight: 10, fontSize: 18 }}>📁</span>
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Path Bar */}
        <div style={styles.pathBar}>
          {pathBar.map((part, idx) => (
            <span key={idx}>
              <span
                style={{
                  cursor: idx < pathBar.length - 1 ? "pointer" : "default",
                  color: idx < pathBar.length - 1 ? "#FFD600" : "#fff",
                  textShadow: idx < pathBar.length - 1 ? "0 1px 8px #6C1AFF" : "none"
                }}
                onClick={() => idx < pathBar.length - 1 && setPath(path.slice(0, idx))}
              >
                {part}
              </span>
              {idx < pathBar.length - 1 && <span style={{ margin: "0 8px" }}>/</span>}
            </span>
          ))}
        </div>

        {/* File Actions */}
        <div style={styles.actions}>
          <button className="wire-btn" style={{ ...styles.actionBtn, background: "#FFD600", color: "#6C1AFF", fontWeight: 700 }} onClick={() => setShowUpload(true)}>Upload File</button>
          <button className="wire-btn" style={{ ...styles.actionBtn, background: "#6C1AFF", color: "#FFD600", fontWeight: 700 }} onClick={() => setShowNewFolder(true)}>New Folder</button>
          <button className="wire-btn" style={{ ...styles.actionBtn, background: "#FFD600", color: "#6C1AFF", fontWeight: 700 }} onClick={() => setShowNewFile(true)}>New File</button>
        </div>

        {/* File Table */}
        <div style={styles.tableWrap}>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Date Modified</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ color: "#888", padding: "18px" }}>No files or folders.</td>
                  </tr>
                )}
                {entries.map(([name, value]) => {
                  const isFolder = typeof value === "object" && !value.type;
                  const icon = isFolder
                    ? "📁"
                    : value.type === "image"
                    ? "🖼️"
                    : value.type === "audio"
                    ? "🎵"
                    : value.type === "text"
                    ? "📄"
                    : "📦";
                  const typeLabel = isFolder
                    ? "Folder"
                    : value.type === "image"
                    ? "Image"
                    : value.type === "audio"
                    ? "Audio"
                    : value.type === "text"
                    ? "Text"
                    : "File";
                  const size = isFolder ? "" : "1 MB";
                  const date = isFolder ? "" : (value.uploadedAt ? new Date(value.uploadedAt).toLocaleString() : "");
                  return (
                    <tr key={name} style={styles.row}>
                      <td style={{ ...styles.td, display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: 12, fontSize: "1.2em" }}>{icon}</span>
                        {isFolder ? (
                          <button
                            className="wire-btn"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#FFD600",
                              padding: 0,
                              fontWeight: 600,
                              fontSize: "1.05rem",
                              cursor: "pointer"
                            }}
                            onClick={() => setPath([...path, name])}
                          >
                            {name}
                          </button>
                        ) : (
                          <span>{name}</span>
                        )}
                      </td>
                      <td style={styles.td}>{date}</td>
                      <td style={styles.td}>{typeLabel}</td>
                      <td style={styles.td}>{size}</td>
                      <td style={{ ...styles.td, display: "flex", gap: 12 }}>
                        {isFolder ? (
                          <button
                            className="wire-btn"
                            style={{ ...styles.actionBtn, background: "#fff", color: "#e74c3c" }}
                            onClick={() => handleDelete(name)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        ) : (
                          <>
                            <button
                              className="wire-btn"
                              onClick={() => handleView(name, value)}
                              title="View"
                              style={{ ...styles.actionBtn, background: "#FFD600", color: "#6C1AFF" }}
                            >
                              👁️
                            </button>
                            <button
                              className="wire-btn"
                              onClick={() => alert("Download not implemented in mock")}
                              title="Download"
                              style={{ ...styles.actionBtn, background: "#6C1AFF", color: "#FFD600" }}
                            >
                              ⬇️
                            </button>
                            <button
                              className="wire-btn"
                              style={{ ...styles.actionBtn, background: "#fff", color: "#e74c3c" }}
                              onClick={() => handleDelete(name)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals (Upload, New Folder, New File, View) */}
        {showUpload && (
          <div className="wire-card" style={{ position: "absolute", top: 120, left: 0, right: 0, margin: "auto", maxWidth: 400, zIndex: 10, background: "#FFD600", color: "#6C1AFF" }}>
            <h3>Upload File</h3>
            <input
              type="file"
              onChange={e => setUploadFile(e.target.files[0])}
              style={{ marginBottom: 12 }}
            />
            <div>
              <button className="wire-btn" style={{ background: "#6C1AFF", color: "#FFD600", fontWeight: 700, border: "none", borderRadius: 8 }} onClick={handleUpload} disabled={!uploadFile}>Upload</button>
              <button className="wire-btn" style={{ marginLeft: 8, background: "#fff", color: "#6C1AFF", border: "none", borderRadius: 8 }} onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showNewFolder && (
          <div className="wire-card" style={{ position: "absolute", top: 120, left: 0, right: 0, margin: "auto", maxWidth: 400, zIndex: 10, background: "#FFD600", color: "#6C1AFF" }}>
            <h3>New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div>
              <button className="wire-btn" style={{ background: "#6C1AFF", color: "#FFD600", fontWeight: 700, border: "none", borderRadius: 8 }} onClick={handleCreateFolder} disabled={!newFolderName}>Create</button>
              <button className="wire-btn" style={{ marginLeft: 8, background: "#fff", color: "#6C1AFF", border: "none", borderRadius: 8 }} onClick={() => setShowNewFolder(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showNewFile && (
          <div className="wire-card" style={{ position: "absolute", top: 120, left: 0, right: 0, margin: "auto", maxWidth: 400, zIndex: 10, background: "#FFD600", color: "#6C1AFF" }}>
            <h3>New File</h3>
            <input
              type="text"
              placeholder="File name (e.g. notes.txt)"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div>
              <button className="wire-btn" style={{ background: "#6C1AFF", color: "#FFD600", fontWeight: 700, border: "none", borderRadius: 8 }} onClick={handleCreateFile} disabled={!newFileName}>Create</button>
              <button className="wire-btn" style={{ marginLeft: 8, background: "#fff", color: "#6C1AFF", border: "none", borderRadius: 8 }} onClick={() => setShowNewFile(false)}>Cancel</button>
            </div>
          </div>
        )}
        {viewFile && (
          <div className="wire-card" style={{ position: "absolute", top: 120, left: 0, right: 0, margin: "auto", maxWidth: 500, zIndex: 10, background: "#FFD600", color: "#6C1AFF" }}>
            <h3>View: {viewFile.name}</h3>
            {viewFile.type === "image" && (
              <div style={{ textAlign: "center" }}>
                <img src="https://via.placeholder.com/300x200?text=Image+Preview" alt={viewFile.name} style={{ maxWidth: "100%" }} />
              </div>
            )}
            {viewFile.type === "audio" && (
              <audio controls style={{ width: "100%" }}>
                <source src="#" type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            )}
            {viewFile.type === "text" && (
              <pre style={{ background: "#fff", color: "#6C1AFF", padding: 16, borderRadius: 8, maxHeight: 200, overflow: "auto" }}>
{`This is a dummy text file: ${viewFile.name}`}
              </pre>
            )}
            {viewFile.type === "file" && (
              <div style={{ color: "#888" }}>Cannot preview this file type.</div>
            )}
            <div style={{ marginTop: 16 }}>
              <button className="wire-btn" style={{ background: "#6C1AFF", color: "#FFD600", fontWeight: 700, border: "none", borderRadius: 8 }} onClick={() => setViewFile(null)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}