import React from "react";
import { projects } from "@site/src/data/projects";
import { BackgroundMedia } from "./BackgroundMedia";
import { SectionHeader } from "./SectionHeader";
import styles from "./Projects.module.scss";

export function Projects(): JSX.Element {
  return (
    <section id="projects" className={styles.section}>
      <div className="home-container">
        <SectionHeader as="h1" eyebrow="Projects" title="Things I've built" />
        {projects.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyDot} />
            Being rewritten. Check back soon.
          </div>
        ) : (
          <div className={styles.grid}>
            {projects.map((p) => (
              <article key={p.id} className={styles.card}>
                {p.media && (
                  <div className={styles.media}>
                    <BackgroundMedia
                      className={styles.mediaEl}
                      src={p.media.src}
                      poster={p.media.poster}
                    />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  {p.tags && (
                    <ul className={styles.tags}>
                      {p.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                  <div className={styles.links}>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        Visit →
                      </a>
                    )}
                    {p.repo && (
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source →
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
