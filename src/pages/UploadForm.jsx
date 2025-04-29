import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export default function UploadForm() {
  const { isAuthenticated, user } = useAuth0();
  const [file, setFile] = useState(null);

  if (!isAuthenticated) return null;

  // Optional: restrict to internal users only
  if (!user.email.endsWith("@quantumrecordings.ca")) return null;

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("/.netlify/functions/upload-music", {
        method: "POST",
        body: formData,
      });
  
      const result = await res.json();
  
      if (res.ok) {
        alert(`Upload successful: ${result.path}`);
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Unexpected error uploading file.");
    }
  };
  
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Upload a File</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mb-2"
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}
