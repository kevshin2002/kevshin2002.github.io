/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ComponentProps } from "react";
import clsx from "clsx";

import styles from "@site/src/components/tagsearch/FavoriteIcon/styles.module.css";

interface Props {
  className?: string;
  style?: ComponentProps<"svg">["style"];
  size: "small" | "medium" | "large";
}

export default function FavoriteIcon({
  size,
  className,
  style,
}: Props): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clsx(styles.svg, styles[size], className)}
      style={style}
    >
      <path
        d="M13.75,20.06L4,10.31c-0.17-0.17-0.17-0.44,0-0.61c1.41-1.1,3.18-0.99,4.28,0.11l8.28,8.28c0.93,0.93,1.02,2.22,0.28,3.22c-0.1,0.13-0.27,0.21-0.45,0.21c-0.08,0-0.16-0.02-0.23-0.05ZM17.63,12.24l4.08-5.26c0.11-0.14,0.28-0.22,0.45-0.22c0.17,0,0.33,0.08,0.44,0.21l0.47,0.47c0.18,0.18,0.18,0.44,0,0.61l-9.8,9.8c-0.17,0.17-0.44,0.17-0.61,0l-0.47-0.47c-0.18-0.18-0.18-0.44,0-0.61l0.16-0.16,5.25-4.08c0.13-0.1,0.33-0.1,0.46,0ZM1.5,23.21l0.39-1.92L6.84,15.66l1.53,1.53L6.9,20.9Z"
        transform="scale(-1, -1) translate(-24, -24)"
      />
    </svg>
  );
}
