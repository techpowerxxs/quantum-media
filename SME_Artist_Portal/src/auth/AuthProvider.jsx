import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/router';

const AuthProviderWithNavigate = ({ children }) => {
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri }}
      onRedirectCallback={(appState) => {
        router.push(appState?.returnTo || window.location.pathname);
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProviderWithNavigate;
