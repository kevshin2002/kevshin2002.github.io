/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useCallback, useMemo } from "react";
import { translate } from "@docusaurus/Translate";
import {
  usePluralForm,
  useQueryString,
  useQueryStringList,
} from "@docusaurus/theme-common";
import type { TagType, Note } from "@site/src/data/notes";
import { sortedNotes } from "@site/src/data/notes";

export function useSearchName() {
  return useQueryString("name");
}

export function useTags() {
  return useQueryStringList("tags");
}

type Operator = "OR" | "AND";

export function useOperator() {
  const [searchOperator, setSearchOperator] = useQueryString("operator");
  const operator: Operator = searchOperator === "AND" ? "AND" : "OR";
  const toggleOperator = useCallback(() => {
    const newOperator = operator === "OR" ? "AND" : null;
    setSearchOperator(newOperator);
  }, [operator, setSearchOperator]);
  return [operator, toggleOperator] as const;
}

function filterNotes({
  notes,
  tags,
  operator,
  searchName,
}: {
  notes: Note[];
  tags: TagType[];
  operator: Operator;
  searchName: string | null;
}) {
  if (searchName) {
    // eslint-disable-next-line no-param-reassign
    notes = notes.filter((note) =>
      note.title.toLowerCase().includes(searchName.toLowerCase()),
    );
  }
  if (tags.length === 0) {
    return notes;
  }
  return notes.filter((note) => {
    if (note.tags.length === 0) {
      return false;
    }
    if (operator === "AND") {
      return tags.every((tag) => note.tags.includes(tag));
    }
    return tags.some((tag) => note.tags.includes(tag));
  });
}

export function useFilteredNotes() {
  const [tags] = useTags();
  const [searchName] = useSearchName();
  const [operator] = useOperator();
  return useMemo(
    () =>
      filterNotes({
        notes: sortedNotes,
        tags: tags as TagType[],
        operator,
        searchName,
      }),
    [tags, operator, searchName],
  );
}

export function useSiteCountPlural() {
  const { selectMessage } = usePluralForm();
  return (sitesCount: number) =>
    selectMessage(
      sitesCount,
      translate(
        {
          id: "tagsearch.filters.resultCount",
          description:
            'Pluralized label for the number of sites found on the showcase. Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "1 note|{sitesCount} notes",
        },
        { sitesCount },
      ),
    );
}
