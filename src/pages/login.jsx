import { useAuth0 } from "@auth0/auth0-react";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    if (typeof window !== "undefined") window.location.href = "/downloads";
    return null;
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Staff Login</h1>
      <button
        onClick={() => loginWithRedirect()}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login with Auth0
      </button>
    </div>
  );
}
