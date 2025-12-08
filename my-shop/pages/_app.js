import { CustomerProvider } from '../context/CustomerContext';

function MyApp({ Component, pageProps }) {
  const userId = "user_123"; // replace with real logged-in user id

  return (
    <CustomerProvider userId={userId}>
      <Component {...pageProps} />
    </CustomerProvider>
  );
}

export default MyApp;
