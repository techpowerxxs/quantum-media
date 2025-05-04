import { useAuth0 } from '@auth0/auth0-react';

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Login
    </button>
  );
}