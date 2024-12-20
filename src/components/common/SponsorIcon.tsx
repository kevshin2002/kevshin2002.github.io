import React, { FunctionComponent } from "react";
import styles from "./SponsorIcon.module.scss";

export interface SponsorIconProps {
  message: string;
  sponsor_url: string;
}

export const SponsorIcon: FunctionComponent<SponsorIconProps> = ({
  message,
  sponsor_url,
}) => {
  return (
    <a href={sponsor_url} target="_blank">
      <img
        className={styles.size}
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt={message}
      />
    </a>
  );
};

export default SponsorIcon;
