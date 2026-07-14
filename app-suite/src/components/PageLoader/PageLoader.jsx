import styles from './PageLoader.module.css';

const PageLoader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}>
        <div className={styles.orb} />
        <div className={styles.orb} />
        <div className={styles.orb} />
      </div>
      <p className={styles.text}>Loading...</p>
    </div>
  );
};

export default PageLoader;
