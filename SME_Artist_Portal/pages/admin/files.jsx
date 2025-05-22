import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { auth0Client } from "../../lib/auth0";

export default function AdminFiles() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    auth0Client.getUser().then(setUser);
  }, []);

  useEffect(() => {
    // Only fetch files if user is admin
    if (user && user.email.endsWith("@quantumrecordings.ca")) {
      fetch("/api/files")
        .then((res) => res.json())
        .then((data) => setFiles(data));
    }
  }, [user]);

  if (!user)
    return (
      <Layout>
        <p style={{ padding: 16 }}>Loading...</p>
      </Layout>
    );
  if (!user.email.endsWith("@quantumrecordings.ca"))
    return (
      <Layout>
        <p style={{ padding: 16, color: "red" }}>Access denied.</p>
      </Layout>
    );

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Quantum Records Admin Panel</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              {file.name}
            </a>
            <span
              style={{
                marginLeft: 8,
                fontSize: "0.9em",
                color: "#888",
              }}
            >
              (uploaded by {file.uploader})
            </span>
          </li>
        ))}
      </ul>
    </Layout>
  );
}