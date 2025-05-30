import '../artist-portal.css';
import AuthProviderWithNavigate from '../auth/AuthProvider';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProviderWithNavigate>
      <Component {...pageProps} />
    </AuthProviderWithNavigate>
  );
}