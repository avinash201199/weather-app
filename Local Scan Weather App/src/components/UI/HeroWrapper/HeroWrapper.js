import styles from "./HeroWrapper.module.css";

const HeroWrapper = (props) => {
	return <main className={styles.wrapper}>{props.children}</main>;
};

export default HeroWrapper;