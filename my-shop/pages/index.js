import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin'); // redirect root to admin
  }, []);

  return null; // or a loading indicator
}
