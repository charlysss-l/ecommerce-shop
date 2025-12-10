import { CustomerProvider } from '../context/CustomerContext';

function MyApp({ Component, pageProps }) {
  const userId = typeof window !== "undefined" ? localStorage.getItem("customerId") : null;

return (
  <CustomerProvider userId={userId}>
    <Component {...pageProps} />
  </CustomerProvider>
);
}

export default MyApp;
