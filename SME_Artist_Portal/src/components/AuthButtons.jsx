import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './ui/button';

export function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
}

export function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </Button>
  );
}