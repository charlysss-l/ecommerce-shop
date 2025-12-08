import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>MyShop</div>

      <ul className={styles.menu}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
       <li><Link href="/products/create">Create Product</Link></li>
      </ul>
    </nav>
  );
}
