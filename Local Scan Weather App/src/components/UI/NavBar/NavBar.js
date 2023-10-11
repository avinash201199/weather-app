import { GoHomeFill } from "react-icons/go";
import { BsFillChatFill, BsCloudSnowFill } from "react-icons/bs";
import { RiSurgicalMaskFill } from "react-icons/ri";
import { BiSolidUserCircle } from "react-icons/bi";

import styles from "./NavBar.module.css";

import logo from "../../../assets/logo.png";

const NavBar = () => {
	return (
		<ul className={styles["navbar__wrapper"]}>
			<li className={styles["navbar__items"]}>
				<img src={logo} width="50px" alt="Local Scan Logo" />
			</li>

			<div className={styles["navbar__wrapper__main"]}>
				<li className={`${styles["navbar__items"]} ${styles["navbar__items--active"]}`}>
					<GoHomeFill size="30px" />
				</li>
				<li className={styles["navbar__items"]}>
					<BsCloudSnowFill size="30px" />
				</li>
				<li className={styles["navbar__items"]}>
					<RiSurgicalMaskFill size="30px" />
				</li>
				<li className={styles["navbar__items"]}>
					<BsFillChatFill size="30px" />
				</li>
			</div>

			<li className={`${styles["navbar__items"]} ${styles["navbar__items--avatar"]}`}>
				<BiSolidUserCircle size="30px" />
			</li>
		</ul>
	);
};

export default NavBar;
