import clsx from "clsx";
import React, { FunctionComponent } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

import styles from "./Hero.module.scss";

export const Hero: FunctionComponent = () => {
  const backgroundImage = useBaseUrl("/img/escape_velocity.jpg");

  return (
    <header
      className={clsx("hero hero--primary", styles.heroBanner)}
      style={{ backgroundImage: `url(${backgroundImage})` }} // Add inline background image
    >
      <div className="container">
        <h1 className={clsx("hero__title", styles.title)}>
          Hey, I'm <span className={styles.highlighted}>Kevin</span>,
          <br />
        </h1>
        <p className={clsx("hero__subtitle", styles.subtitle)}>
          Software engineer interested in continuous personal growth.
          <br /> Machine Learning, Robotics, and C++ enthusiast.
        </p>
      </div>
    </header>
  );
};
