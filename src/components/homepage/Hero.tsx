import clsx from "clsx";
import React, { FunctionComponent } from "react";

import styles from "./Hero.module.scss";

export const Hero: FunctionComponent = () => {
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx("hero__title", styles.title)}>
          Hey, I'm <span className={styles.highlighted}>Kevin</span>,
          <br />
          <span className={styles.highlighted}>an Electrical Engineering Student</span>.
        </h1>
        <p className={clsx("hero__subtitle", styles.subtitle)}>
          Software engineer interested in continuous personal growth.
          <br /> Machine Learning, Robotics, and C++ enthusiast.
        </p>
      </div>
    </header>
  );
};
