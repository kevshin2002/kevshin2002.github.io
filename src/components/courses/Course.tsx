import clsx from "clsx";
import React, { FunctionComponent } from "react";

import styles from "./Course.module.scss";

export interface CourseData {
  title: string;
  description: string;
  term: string;
}

export const Course: FunctionComponent<CourseData> = ({
  title,
  description,
}) => {
  return (
    <div className={clsx("col col--6", styles.cardContainer)}>
      <div className={clsx("card", styles.card)}>
        <div className="card__body">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};
