/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import type { ReactNode, CSSProperties } from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import FavoriteIcon from "../FavoriteIcon";
import { Tags, TagList, type TagType } from "../../../data/notes";
import Heading from "@theme/Heading";
import TagSearchTagSelect from "../TagSearchTagSelect";
import OperatorButton from "../OperatorButton";
import ClearAllButton from "../ClearAllButton";
import { useFilteredNotes, useSiteCountPlural } from "../_utils";

import styles from "@site/src/components/tagsearch/TagSearchFilters/styles.module.css";

function TagCircleIcon({
  color,
  style,
}: {
  color: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        backgroundColor: color,
        width: 10,
        height: 10,
        borderRadius: "50%",
        ...style,
      }}
    />
  );
}

function TagSearchListItem({ tag }: { tag: TagType }) {
  const { label, description, color } = Tags[tag];
  return (
    <li className={styles.tagListItem}>
      <TagSearchTagSelect
        tag={tag}
        label={label}
        description={description}
        icon={
          tag === "pinned" ? (
            <FavoriteIcon size="small" style={{ marginLeft: 8 }} />
          ) : (
            <TagCircleIcon
              color={color}
              style={{
                backgroundColor: color,
                marginLeft: 8,
              }}
            />
          )
        }
      />
    </li>
  );
}

function TagSearchTagList() {
  return (
    <ul className={clsx("clean-list", styles.tagList)}>
      {TagList.map((tag) => {
        return <TagSearchListItem key={tag} tag={tag} />;
      })}
    </ul>
  );
}

function HeadingText() {
  const filteredNotes = useFilteredNotes();
  const siteCountPlural = useSiteCountPlural();
  return (
    <div className={styles.headingText}>
      <Heading as="h2">
        <Translate id="tagsearch.filters.title">Filters</Translate>
      </Heading>
      <span>{siteCountPlural(filteredNotes.length)}</span>
    </div>
  );
}

function HeadingButtons() {
  return (
    <div className={styles.headingButtons} style={{ alignItems: "center" }}>
      <OperatorButton />
      <ClearAllButton />
    </div>
  );
}

function HeadingRow() {
  return (
    <div className={clsx("margin-bottom--sm", styles.headingRow)}>
      <HeadingText />
      <HeadingButtons />
    </div>
  );
}

export default function TagSearchFilters(): ReactNode {
  return (
    <section className="container margin-top--1 margin-bottom--lg">
      <HeadingRow />
      <TagSearchTagList />
    </section>
  );
}
