import { AuthProvider } from "../components/AuthProvider";

function AppWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default AppWrapper;
