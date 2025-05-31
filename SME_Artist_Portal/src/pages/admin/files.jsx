import React, { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';

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

// Helper to recursively collect all folders for sidebar
function getFolderTree(fs, path = []) {
  let folders = [];
  if (typeof fs !== "object" || fs === null) return folders;
  for (const [name, value] of Object.entries(fs)) {
    if (typeof value === "object" && !value.type) {
      folders.push({ name, path: [...path, name] });
      folders = folders.concat(getFolderTree(value, [...path, name]));
    }
  }
  return folders;
}

export default function AdminFiles() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [mockFS, setMockFS] = useState(initialMockFileSystem);
  const [path, setPath] = useState([]); // path is an array: [user, ...folders]
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [viewFile, setViewFile] = useState(null);

  // Only allow admins with @quantumrecordings.ca email
  const isAdmin = user && user.email && user.email.endsWith("@quantumrecordings.ca");

  // --- Windows-style CSS (site colors) ---
  const styles = {
    sidebar: {
      width: 220,
      background: "#232323",
      color: "#fff",
      padding: "16px 0",
      borderRight: "1px solid #222",
      overflowY: "auto",
      boxShadow: "2px 0 8px 0 #181818"
    },
    sidebarButton: (active) => ({
      background: active ? "#222" : "none",
      color: "#fff",
      border: "none",
      width: "100%",
      textAlign: "left",
      padding: "6px 18px",
      cursor: "pointer",
      borderRadius: 4,
      fontWeight: active ? 700 : 400,
      transition: "background 0.15s"
    }),
    main: {
      flex: 1,
      background: "#181818",
      color: "#fff",
      padding: 0,
      display: "flex",
      flexDirection: "column"
    },
    pathBar: {
      padding: "18px 32px 0 32px",
      fontWeight: 600,
      fontSize: "1.1rem",
      display: "flex",
      alignItems: "center",
      minHeight: 40,
      background: "#20202a",
      borderBottom: "1px solid #232323"
    },
    actions: {
      padding: "12px 32px 0 32px",
      display: "flex",
      gap: 12,
      borderBottom: "1px solid #222",
      background: "#20202a"
    },
    tableWrap: {
      padding: "0 32px",
      flex: 1,
      overflow: "auto"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 16,
      background: "#232323",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 2px 8px #181818"
    },
    th: {
      textAlign: "left",
      padding: "8px",
      background: "#232323",
      color: "#3a8bfd",
      fontWeight: 700,
      borderBottom: "1px solid #444"
    },
    td: {
      padding: "8px",
      borderBottom: "1px solid #222",
      color: "#fff"
    },
    row: {
      transition: "background 0.15s"
    },
    rowHover: {
      background: "#25253a"
    }
  };
  // --- END Windows-style CSS ---

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

  // Sidebar folder tree (all users at root)
  const folderTree = Object.keys(mockFS).flatMap(userKey => [
    { name: userKey, path: [userKey] },
    ...getFolderTree(mockFS[userKey], [userKey])
  ]);

  // If no user is selected at root, show all user folders
  const currentNode = getNode(mockFS, path) || {};

  // Path bar
  const pathBar = path.length === 0 ? ["All Users"] : path;
  const handlePathClick = (idx) => {
    setPath(path.slice(0, idx));
  };

  // Create folder handler (mock)
  const handleCreateFolder = () => {
    if (!newFolderName) return;
    setMockFS(fs => {
      const newFS = deepClone(fs);
      setNode(newFS, [...path, newFolderName], {});
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
      setNode(newFS, [...path, newFileName], { type: "text", uploadedAt: now });
      return newFS;
    });
    setShowNewFile(false);
    setNewFileName("");
  };

  // Delete handler (mock)
  const handleDelete = (name) => {
    setMockFS(fs => {
      const newFS = deepClone(fs);
      deleteNode(newFS, [...path, name]);
      return newFS;
    });
  };

  // View handler (mock)
  const handleView = (name, fileObj) => {
    setViewFile({ name, ...fileObj });
  };

  // Render file/folder list
  const entries = Object.entries(currentNode);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#181818" }}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18, textAlign: "center" }}>
          <span style={{ color: "#3a8bfd" }}>Folders</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {folderTree.map(folder => (
            <li key={folder.path.join("/")} style={{ marginBottom: 4 }}>
              <button
                style={styles.sidebarButton(path.join("/") === folder.path.join("/"))}
                onClick={() => setPath(folder.path)}
              >
                <span style={{ marginRight: 8 }}>📁</span>
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
                  color: idx < pathBar.length - 1 ? "#3a8bfd" : "#fff"
                }}
                onClick={() => idx < pathBar.length - 1 && handlePathClick(idx)}
              >
                {part}
              </span>
              {idx < pathBar.length - 1 && <span style={{ margin: "0 8px" }}>/</span>}
            </span>
          ))}
        </div>

        {/* File Actions */}
        <div style={styles.actions}>
          <button className="mega-btn" onClick={() => setShowNewFolder(true)}>New Folder</button>
          <button className="mega-btn" onClick={() => setShowNewFile(true)}>New File</button>
        </div>

        {/* File Table */}
        <div style={styles.tableWrap}>
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
                  <td colSpan={5} style={{ color: "#888", padding: "12px" }}>No files or folders.</td>
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
                      <span style={{ marginRight: 8, fontSize: "1.2em" }}>{icon}</span>
                      {isFolder ? (
                        <button
                          className="wire-btn"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#3a8bfd",
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
                    <td style={{ ...styles.td, display: "flex", gap: 8 }}>
                      {isFolder ? (
                        <button
                          className="wire-btn"
                          style={{ background: "#fff", color: "#e74c3c", borderColor: "#e74c3c" }}
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
                          >
                            👁️
                          </button>
                          <button
                            className="wire-btn"
                            onClick={() => alert("Download not implemented in mock")}
                            title="Download"
                          >
                            ⬇️
                          </button>
                          <button
                            className="wire-btn"
                            style={{ background: "#fff", color: "#e74c3c", borderColor: "#e74c3c" }}
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

        {/* New Folder Modal */}
        {showNewFolder && (
          <div className="mega-card" style={{ position: "absolute", top: 120, left: 0, right: 0, margin: "auto", maxWidth: 400, zIndex: 10 }}>
            <h3>New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div>
              <button className="mega-btn" onClick={handleCreateFolder} disabled={!newFolderName}>Create</button>
              <button className="mega-btn" onClick={() => setShowNewFolder(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </div>
        )}
        {/* New File Modal */}
        {showNewFile && (
          <div className="mega-card" style={{ position: "absolute", top: 120, left: 0, right: 0, margin: "auto", maxWidth: 400, zIndex: 10 }}>
            <h3>New File</h3>
            <input
              type="text"
              placeholder="File name (e.g. notes.txt)"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div>
              <button className="mega-btn" onClick={handleCreateFile} disabled={!newFileName}>Create</button>
              <button className="mega-btn" onClick={() => setShowNewFile(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </div>
        )}
        {/* File Viewer Modal */}
        {viewFile && (
          <div className="mega-card" style={{ position: "absolute", top: 120, left: 0, right: 0, margin: "auto", maxWidth: 500, zIndex: 10 }}>
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
              <pre style={{ background: "#f7f7f7", color: "#222", padding: 16, borderRadius: 8, maxHeight: 200, overflow: "auto" }}>
{`This is a dummy text file: ${viewFile.name}`}
              </pre>
            )}
            {viewFile.type === "file" && (
              <div style={{ color: "#888" }}>Cannot preview this file type.</div>
            )}
            <div style={{ marginTop: 16 }}>
              <button className="mega-btn" onClick={() => setViewFile(null)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}