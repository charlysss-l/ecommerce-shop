import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>MyShop</div>

      <ul className={styles.menu}>
        <li><Link href="/admin">Home</Link></li>
        <li><Link href="/admin/products">Products</Link></li>
       <li><Link href="/admin/products/create">Create Product</Link></li>
      </ul>
    </nav>
  );
}
