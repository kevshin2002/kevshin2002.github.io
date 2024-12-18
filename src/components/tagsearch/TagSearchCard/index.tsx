/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import Image from "@theme/IdealImage";
import {
  ScienceTags,
  TagList,
  type TagType,
  type Note,
} from "../../../data/notes";
import { sortBy } from "../../../utils/jsUtils";
import Heading from "@theme/Heading";
import FavoriteIcon from "../FavoriteIcon";
import styles from "./styles.module.css";

function TagItem({
  label,
  description,
  color,
}: {
  label: string;
  description: string;
  color: string;
}) {
  return (
    <li className={styles.tag} title={description}>
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
      <span className={styles.colorLabel} style={{ backgroundColor: color }} />
    </li>
  );
}

function TagSearchCardTag({ tags }: { tags: TagType[] }) {
  const tagObjects = tags.map((tag) => ({ tag, ...ComputerScienceTags[tag] }));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag),
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        return <TagItem key={index} {...tagObject} />;
      })}
    </>
  );
}

function getCardImage(note: Note): string {
  return (
    note.preview ??
    // TODO make it configurable
    `https://slorber-api-screenshot.netlify.app/${encodeURIComponent(
      note.website,
    )}/note`
  );
}

function TagSearchCard({ note }: { note: Note }) {
  const image = getCardImage(note);
  return (
    <li key={note.title} className="card shadow--md">
      <div className={clsx("card__image", styles.tagsearchCardImage)}>
        <Image img={image} alt={note.title} />
      </div>
      <div className="card__body">
        <div className={clsx(styles.tagsearchCardHeader)}>
          <Heading as="h4" className={styles.tagsearchCardTitle}>
            <Link href={note.website} className={styles.tagsearchCardLink}>
              {note.title}
            </Link>
          </Heading>
          {note.tags.includes("pinned") && (
            <FavoriteIcon size="medium" style={{ marginRight: "0.25rem" }} />
          )}
          {note.source && (
            <Link
              href={note.source}
              className={clsx(
                "button button--secondary button--sm",
                styles.tagsearchCardSrcBtn,
              )}
            >
              <Translate id="tagsearch.card.sourceLink">source</Translate>
            </Link>
          )}
        </div>
        <p className={styles.showcaseCardBody}>{note.description}</p>
      </div>
      <ul className={clsx("card__footer", styles.cardFooter)}>
        <TagSearchCardTag tags={note.tags} />
      </ul>
    </li>
  );
}

export default React.memo(TagSearchCard);
