import styles from "../styles/Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.cube1}></div>
      <div className={styles.cube2}></div>
    </div>
  );
};

const SpinnerCirculo = () => {
  return (
    <div className={styles.sk_chase}>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
    </div>
  );
};

const SpinnerCirculoChico = () => {
  return (
    <div className={styles.sk_chase_small}>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
      <div className={styles.sk_chase_dot}></div>
    </div>
  );
};

export default Spinner;

export { SpinnerCirculo, SpinnerCirculoChico };
