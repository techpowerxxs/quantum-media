import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import UploadForm from "./UploadForm";

export default function DownloadsPage() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">🎵 Downloads</h1>
      <ul className="list-disc pl-6 mb-6">
        <li>
          <a href="https://media.quantumrecordings.ca/files/album-pack.zip">Album Pack</a>
        </li>
        <li>
          <a href="https://media.quantumrecordings.ca/files/press-kit.pdf">Press Kit</a>
        </li>
        <li>
          <a href="https://media.quantumrecordings.ca/files/sample-loops.zip">Sample Loops</a>
        </li>
      </ul>
      <UploadForm />
      <LogoutButton />
    </div>
  );
}
