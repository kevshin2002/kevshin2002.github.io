import React from "react";
import clsx from "clsx";
import {
  career,
  type CareerEntry,
  type CareerRole,
} from "@site/src/data/career";
import { BackgroundMedia } from "./BackgroundMedia";
import styles from "./Career.module.scss";

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function Role({ role }: { role: CareerRole }) {
  return (
    <section className={styles.role}>
      <div className={styles.roleHead}>
        <h3 className={styles.roleTitle}>{role.title}</h3>
        <span className={styles.rolePeriod}>{role.period}</span>
      </div>
      {paragraphs(role.description).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </section>
  );
}

function Note({ entry, index }: { entry: CareerEntry; index: number }) {
  const side = entry.media?.layout === "side";

  return (
    <article
      id={`career-${entry.id}`}
      className={clsx(
        styles.panel,
        entry.media && (side ? styles.withSide : styles.withMedia),
        entry.media && index % 2 === 1 && styles.flip,
      )}
    >
      {entry.media && (
        <div className={side ? styles.sideMedia : styles.media}>
          <BackgroundMedia
            className={styles.mediaEl}
            src={entry.media.src}
            poster={entry.media.poster}
          />
        </div>
      )}
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.body}>
        <p className={styles.year}>{entry.year}</p>
        <h2 className={styles.title}>
          {entry.orgUrl ? (
            <a href={entry.orgUrl} target="_blank" rel="noopener noreferrer">
              {entry.org}
            </a>
          ) : (
            entry.org
          )}
        </h2>
        {entry.tagline && <p className={styles.org}>{entry.tagline}</p>}
        <div className={styles.roles}>
          {entry.roles.map((r) => (
            <Role key={r.title} role={r} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function Career(): JSX.Element {
  return (
    <section id="career" className={styles.section}>
      {/* No visible heading: the page is self-explanatory. Kept for screen
          readers and search engines. */}
      <h1 className={styles.srOnly}>Career</h1>
      <div className={styles.list}>
        {career.map((entry, i) => (
          <Note key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}
