import React from "react";
import Link from "@docusaurus/Link";
import { SectionHeader } from "./SectionHeader";
import styles from "./Explore.module.scss";

const ITEMS = [
  {
    to: "/career",
    label: "Career",
    blurb: "Where I've worked and what I did there.",
  },
  {
    to: "/projects",
    label: "Projects",
    blurb: "Things I've built.",
  },
  {
    to: "/blog",
    label: "Blog",
    blurb: "Longer writing, reflections and updates.",
  },
  {
    to: "/docs/note",
    label: "Notes",
    blurb: "Working notes on robotics, math and software.",
  },
];

export function Explore(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className="home-container">
        <SectionHeader eyebrow="Explore" title="Around the site" />
        <div className={styles.grid}>
          {ITEMS.map((it, i) => (
            <Link key={it.to} to={it.to} className={styles.card}>
              <span className={styles.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.label}>{it.label}</span>
              <span className={styles.blurb}>{it.blurb}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
