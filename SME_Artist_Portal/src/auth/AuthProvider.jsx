import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const AuthProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  const domain = "dev-ahvdr6kyjhasmbry.us.auth0.com";
  const clientId = "bjVlVhyFUNCipNWP0RoVh9SZ81wHrSyw";
  const redirectUri = window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri }}
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || window.location.pathname);
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProviderWithNavigate;
