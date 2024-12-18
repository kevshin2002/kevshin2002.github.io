import React, { FunctionComponent } from "react";
import Heading from "@theme/Heading";

import TagSearchBar from "@site/src/components/tagsearch/TagSearchBar/index";
import TagSearchCards from "@site/src/components/tagsearch/TagSearchCards/index";
import TagSearchFilters from "@site/src/components/tagsearch/TagSearchFilters/index";
import styles from "./styles.module.css";

export interface TagSearchNotesProps {
  title: string;
  description: string;
}

export const TagSearchNotes: FunctionComponent<TagSearchNotesProps> = ({
  title,
  description,
}) => {
  return (
    <>
      <Heading as="h1" className={styles.index_page_title}>
        {title}
      </Heading>
      <p className={styles.index_page_description}>{description}</p>
      <br />
      <TagSearchFilters />
      <div
        style={{ display: "flex", marginLeft: "auto" }}
        className="container"
      >
        <TagSearchBar />
      </div>
      <TagSearchCards />
    </>
  );
};

export default TagSearchNotes;
