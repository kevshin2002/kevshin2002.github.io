/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import { sortedNotes, type Note } from "../../../data/notes";
import Heading from "@theme/Heading";
import FavoriteIcon from "../FavoriteIcon";
import TagSearchCard from "../TagSearchCard";
import { useFilteredNotes } from "../_utils";

import styles from "./styles.module.css";

const favoriteNotes = sortedNotes.filter((note) =>
  note.tags.includes("pinned"),
);

const otherNotes = sortedNotes.filter((note) => !note.tags.includes("pinned"));

function HeadingNoResult() {
  return (
    <Heading as="h2">
      <Translate id="tagsearch.notesList.noResult">No result</Translate>
    </Heading>
  );
}

function HeadingFavorites() {
  return (
    <Heading as="h2" className={styles.headingFavorites}>
      <Translate id="tagsearch.favoritesList.title">Pinned Notes</Translate>
      <FavoriteIcon size="large" style={{ marginLeft: "1rem" }} />
    </Heading>
  );
}

function HeadingAllSites() {
  return (
    <Heading as="h2">
      <Translate id="tagsearch.notesList.allNotes">All Notes</Translate>
    </Heading>
  );
}

function CardList({ heading, items }: { heading?: ReactNode; items: Note[] }) {
  return (
    <div className="container">
      {heading}
      <ul className={clsx("clean-list", styles.cardList)}>
        {items.map((item) => (
          <TagSearchCard key={item.title} note={item} />
        ))}
      </ul>
    </div>
  );
}

function NoResultSection() {
  return (
    <section className="margin-top--lg margin-bottom--xl">
      <div className="container padding-vert--md text--center">
        <HeadingNoResult />
      </div>
    </section>
  );
}

export default function TagSearchCards() {
  const filteredNotes = useFilteredNotes();

  if (filteredNotes.length === 0) {
    return <NoResultSection />;
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredNotes.length === sortedNotes.length ? (
        <>
          <div className={styles.TagSearchFavorite}>
            <CardList heading={<HeadingFavorites />} items={favoriteNotes} />
          </div>
          <div className="margin-top--lg">
            <CardList heading={<HeadingAllSites />} items={otherNotes} />
          </div>
        </>
      ) : (
        <CardList items={filteredNotes} />
      )}
    </section>
  );
}
