import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export default function UploadForm() {
  const { isAuthenticated, user } = useAuth0();
  const [file, setFile] = useState(null);

  if (!isAuthenticated) return null;

  // Optional: restrict to internal users only
  if (!user.email.endsWith("@quantumrecordings.ca")) return null;

  const handleUpload = () => {
    alert("Upload not connected yet — ready for Cloudinary or Supabase.");
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
