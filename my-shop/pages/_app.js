import { CustomerProvider } from '../context/CustomerContext';


export default function App({ Component, pageProps }) {
  return (
    <CustomerProvider>
      <Component {...pageProps} />
    </CustomerProvider>
  );
}
