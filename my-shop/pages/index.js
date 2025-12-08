import Navbar from '../components/Navbar';
import styles from './index.module.css';

export default function Home() {
  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to My Shop</h1>
        <p className={styles.description}>This is your homepage.</p>

        <a href="/products" className={styles.link}>
          Go to Products CRUD
        </a>
      </div>
    </>
  );
}
