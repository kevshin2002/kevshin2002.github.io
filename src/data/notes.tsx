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
  | "project"
  | "insight"
  | "research"
  | "proof-of-concept"
  | "analysis"
  | "Embedded"
  // topics
  | "algorithm"

  // languages
  | "C++"
  | "Python"
  | "Rust"
  | "C";

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
    website: "./Software/C++/eff_modern_cpp",
    tags: ["cpp", "computer-science"],
  },
  {
    title: "ROS2 Testing",
    description:
      "Learn how to test ROS2 with unit and integration testing via pytest/gtest",
    preview: require("./images/ros2_test.jpg"),
    website: "./Robotics/ROS2/testing-ros2",
    tags: ["cpp", "python", "robotics"],
  },
  {
    title: "URDF",
    description:
      "Learn how software communicate using a unified modeling format",
    preview: require("./images/urdf.png"),
    website: "./Robotics/ROS2/urdf",
    tags: ["cpp", "robotics"],
  },
  {
    title: "Zephyr",
    description: "Follow my learning journey for Zephyr, an open source RTOS",
    preview: require("./images/zephyr.jpeg"),
    website: "./Robotics/RTOS/zephyr",
    tags: ["cpp", "embedded"],
  },
  {
    title: "ROS2 Perception",
    description: "Understand how to use ROS2 and computer vision for robotics",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["cpp", "robotics", "machine_learning"],
  },
// Papers
  {
    title: "Attention Is All You Need",
    description: "The original transformer architecture that goes into self-attention, encoder-decoder structure, and positional encoding",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["pinned", "research", "machine_learning"],
  },
  {
    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (ViT)",
    description: "How transformers can be applied to images",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research", "machine_learning"],
  },
  {
    title: "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows",
    description: "An optional paper to understand how hierarchical vision transformers can improve efficiency and locality",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research","machine_learning"],
  },
  {
    title: "End-to-End Object Detection with Transformers (DETR)",
    description: "The paper that introduced DETR, going into set prediction, object queries, bipartite matching loss, and end to end detection",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research","machine_learning"],
  },
  {
    title: "Deformable DETR: Deformable Transformers for End-to-End Object Detection",
    description: "Optional paper on how DETR was improved by introducing sparse attention to improve convergence",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research","machine_learning"],
  },
  {
    title: "Conditional DETR for Fast Training Convergence",
    description: "Another optimization that heeps stability and convergence",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research","machine_learning"],
  },
  {
    title: "DETR3D: 3D Object Detection from Multi-view Images via 3D-to-2D Queries",
    description: "One of the core architecture that allows 3D bounding boxes using DETR. Goes into projecting 3D reference points into 2D image space to extract features and regress 3D bounding boxes (x, y, z, w, h, l, yaw)",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research","machine_learning"],
  },
  {
    title: "PETRv2: A Unified Framework for 3D Perception from Multi-Camera Images",
    description: "Alternative to DETR3D. Uses image-position fused queries to achieve multi-view 3D object detection",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research","machine_learning"],
  },
  {
    title: "DINOv2: Learning Robust Visual Features without Supervision",
    description: "This is the backbone of RF-DETR and is what Roboflow as the foundation",
    preview: require("./images/perception.png"),
    website: "./Robotics/ROS2/perception",
    tags: ["research", "machine_learning"],
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
  embedded: {
    label: translate({ message: "Embedded" }),
    description: translate({
      message: "Anything embedded goes here",
      id: "tagsearch.tag.embedded.description",
    }),
    color: "#0598ce",
  },
  misc: {
    label: translate({ message: "Misc" }),
    description: translate({
      message: "Other categories that don't fit",
      id: "tagsearch.tag.misc.description",
    }),
    color: "#C084FC",
  },

  project: {
    label: translate({ message: "Project" }),
    description: translate({
      message: "We only know what we make.",
      id: "tagsearch.tag.project.description",
    }),
    color: "#4F46E5",
  },

  research: {
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
