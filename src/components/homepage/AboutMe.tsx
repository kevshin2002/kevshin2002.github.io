import React, { FunctionComponent } from "react";
import clsx from "clsx";
import Image from "@theme/IdealImage";
import styles from "./AboutMe.module.scss";

export interface AboutMeProps {
  avatar: string;
  descriptionComponent: React.ReactNode;
}

export const AboutMe: FunctionComponent<AboutMeProps> = ({
  avatar,
  descriptionComponent,
}) => {
  return (
    <div>
      <div className="row">
        <div className="col col--8">{descriptionComponent}</div>
        <div className={clsx("col col--3", styles.avatarContainer)}>
          <div className={styles.avatar}>
            <Image img={avatar} />
          </div>
        </div>
      </div>
    </div>
  );
};
