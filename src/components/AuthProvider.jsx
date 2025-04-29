import { Auth0Provider } from "@auth0/auth0-react";

const domain = "dev-ahvdr6kyjhasmbry.us.auth0.com";
const clientId = "bjVlVhyFUNCipNWP0RoVh9SZ81wHrSyw";

export const AuthProvider = ({ children }) => (
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    {children}
  </Auth0Provider>
);
