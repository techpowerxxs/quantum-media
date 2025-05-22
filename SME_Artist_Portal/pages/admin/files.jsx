import { useEffect, useState } from "react";
import { auth0Client } from "../../lib/auth0";
import { Button } from "../../components/ui/button";

export default function AdminFiles() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    auth0Client.getUser().then(setUser);
  }, []);

  useEffect(() => {
    if (user && user.email.endsWith("@yourlabel.com")) {
      fetch(`/api/files?user=${user.email}`)
        .then((res) => res.json())
        .then(setFiles);
    }
  }, [user]);

  if (!user) return <p className="p-4">Loading...</p>;
  if (!user.email.endsWith("@yourlabel.com"))
    return <p className="p-4 text-red-500">Access denied.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin File Manager</h1>
      <ul className="list-disc list-inside space-y-2">
        {files.map((file, idx) => (
          <li key={idx}>
            <a
              href={file.url}
              className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.name}
            </a>
            <span className="ml-2 text-sm text-gray-500">(uploaded by {file.uploader})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}