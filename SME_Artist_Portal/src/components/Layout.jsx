import { useAuth0 } from '@auth0/auth0-react';

export default function Layout({ children }) {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      <header className="bg-gray-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🎶 SME Artist Portal</h1>
          <nav>
            <a href="/" className="mx-2 hover:underline">Dashboard</a>
            <a href="/admin/files" className="mx-2 hover:underline">Admin Panel</a>
            {isAuthenticated ? (
              <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="ml-4">Logout</button>
            ) : (
              <button onClick={() => loginWithRedirect()} className="ml-4">Login</button>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}