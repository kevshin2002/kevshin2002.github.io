/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import { translate } from "@docusaurus/Translate";
import { sortBy } from "@site/src/utils/jsUtils";

/*
 * ADD YOUR SITE TO THE DOCUSAURUS SHOWCASE
 *
 * Please don't submit a PR yourself: use the Github Discussion instead:
 * https://github.com/facebook/docusaurus/discussions/7826
 *
 * Instructions for maintainers:
 * - Add the site in the json array below
 * - `title` is the project's name (no need for the "Docs" suffix)
 * - A short (≤120 characters) description of the project
 * - Use relevant tags to categorize the site (read the tag descriptions on the
 *   https://docusaurus.io/showcase page and some further clarifications below)
 * - Add a local image preview (decent screenshot of the Docusaurus site)
 * - The image MUST be added to the GitHub repository, and use `require("img")`
 * - The image has to have minimum width 640 and an aspect of no wider than 2:1
 * - If a website is open-source, add a source link. The link should open
 *   to a directory containing the `docusaurus.config.js` file
 * - Resize images: node admin/scripts/resizeImage.js
 * - Run optimizt manually (see resize image script comment)
 * - Open a PR and check for reported CI errors
 *
 * Example PR: https://github.com/facebook/docusaurus/pull/7620
 */

export type TagType =
  // Note types
  | "pinned"
  | "computer science"
  | "machine learning"
  | "robotics"
  | "mathematics"
  | "science"
  | "misc"
  | "implementation"
  | "insight"
  | "paper-reading"
  | "proof-of-concept"
  | "analysis"

  // topics
  | "algorithm"

  // languages
  | "C++"
  | "Python"
  | "Rust"
  | "C"
  | "MATLAB";

const Notes: Note[] = [
  {
    title: "ROS2",
    description: "Understand how ROS2 works in C++, Python, and Rust",
    preview: require("./images/ros2.png"),
    website: "./Robotics/ROS2",
    tags: ["cpp", "python", "rust", "robotics"],
  },
  {
    title: "ROS2 Nav2",
    description: "Understand how the ROS2 navigation framework (Nav2) works",
    preview: require("./images/nav2.png"),
    website: "./Robotics/ROS2/nav2",
    tags: ["cpp", "python", "robotics"],
  },
  {
    title: "Effective Modern C++",
    description: "Wisdom from Scott Meyers for C+11 and C++14",
    preview: require("./images/eff_modern.jpg"),
    website: "./Software/C++/Books/eff_modern_cpp",
    tags: ["cpp", "computer-science"],
  },
];

export type Note = {
  title: string;
  description: string;
  preview: string | null; // null = use our serverless screenshot service
  website: string;
  source: string | null;
  tags: TagType[];
};

export type Tag = {
  label: string;
  description: string;
  color: string;
};

export const Tags: { [type in TagType]: Tag } = {
  pinned: {
    label: translate({ message: "Pinned" }),
    description: translate({
      message: "Notes that are impressive and noteworthy.",
      id: "tagsearch.tag.pinned.description",
    }),
    color: "#FFEA00",
  },

  machine_learning: {
    label: translate({ message: "Machine Learning" }),
    description: translate({
      message: "Statistical Methods and Deep Learning",
      id: "tagsearch.tag.machine-learning.description",
    }),
    color: "#A3E635",
  },

  robotics: {
    label: translate({ message: "Robotics" }),
    description: translate({
      message: "RTOS/ROS2, Simulations, Control Theory, and Optimizations.",
      id: "tagsearch.tag.robotics.description",
    }),
    color: "#38BDF8",
  },

  mathematics: {
    label: translate({ message: "Mathematics" }),
    description: translate({
      message: "Rigorous proofs and interesting mathematics",
      id: "tagsearch.tag.mathematics.description",
    }),
    color: "#FACC15",
  },

  science: {
    label: translate({ message: "Science" }),
    description: translate({
      message: "Fascinating scientific notes and findings",
      id: "tagsearch.tag.science.description",
    }),
    color: "#2DD48F",
  },

  misc: {
    label: translate({ message: "Misc" }),
    description: translate({
      message: "Other categories that don't fit",
      id: "tagsearch.tag.misc.description",
    }),
    color: "#C084FC",
  },

  implementation: {
    label: translate({ message: "Implementation" }),
    description: translate({
      message: "We only know what we make.",
      id: "tagsearch.tag.implementation.description",
    }),
    color: "#4F46E5",
  },

  Research: {
    label: translate({ message: "Research Papers" }),
    description: translate({
      message: "Notes from reading academic research papers",
      id: "tagsearch.tag.research.description",
    }),
    color: "#FBBF24",
  },

  "computer-science": {
    label: translate({ message: "Computer Science" }),
    description: translate({
      message: "Computer science related notes",
      id: "tagsearch.tag.computer-science.description",
    }),
    color: "#0D9488",
  },

  cpp: {
    label: translate({ message: "C++" }),
    description: translate({
      message: "C++ is not a superset of C",
      id: "tagsearch.tag.cpp.description",
    }),
    color: "#00599C",
  },

  c: {
    label: translate({ message: "C" }),
    description: translate({
      message: "The successor of B and chosen language for firmware.",
      id: "tagsearch.tag.c.description",
    }),
    color: "#A8B9CC",
  },

  rust: {
    label: translate({ message: "Rust" }),
    description: translate({
      message: "Not much to say here",
      id: "tagsearch.tag.rust.description",
    }),
    color: "#DEA584",
  },

  python: {
    label: translate({ message: "Python" }),
    description: translate({
      message: "𓆙",
      id: "tagsearch.tag.machine-learning.description",
    }),
    color: "#3776AB",
  },

  matlab: {
    label: translate({ message: "MATLAB" }),
    description: translate({
      message: "Language for all non software-engineers",
      id: "tagsearch.tag.matlab.description",
    }),
    color: "#E55300",
  },
};

export const TagList = Object.keys(Tags) as TagType[];
function sortNotes() {
  let result = Notes;
  // Sort by site name
  result = sortBy(result, (note) => note.title.toLowerCase());
  // Sort by implementation tag, implementations first
  result = sortBy(result, (note) => !note.tags.includes("pinned"));
  return result;
}

export const sortedNotes = sortNotes();
