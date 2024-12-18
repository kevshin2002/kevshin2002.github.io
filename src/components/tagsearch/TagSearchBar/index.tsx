/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import { useSearchName } from "../_utils";
import styles from "@site/src/components/tagsearch/TagSearchBar/styles.module.css";
import React from "react";

export default function TagSearchBar(): ReactNode {
  const [searchName, setSearchName] = useSearchName();
  return (
    <div className={styles.searchBar}>
      <input
        placeholder={translate({
          message: "Search for note title...",
          id: "tagsearch.searchBar.placeholder",
        })}
        value={searchName}
        onInput={(e) => {
          setSearchName(e.currentTarget.value);
        }}
      />
    </div>
  );
}
