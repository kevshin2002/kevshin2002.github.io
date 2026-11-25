import React from "react";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import Image from "@theme/IdealImage";
import { SectionHeader } from "./SectionHeader";
import styles from "./About.module.scss";

export interface SocialLink {
  name: string;
  url: string;
  svg: JSX.Element;
}

export function About({
  avatar,
  children,
  links,
}: {
  avatar: string;
  children: React.ReactNode;
  links: SocialLink[];
}): JSX.Element {
  useBrokenLinks().collectAnchor("about");
  return (
    <section id="about" className={styles.section}>
      <div className="home-container">
        <div className={styles.grid}>
          <div>
            <SectionHeader eyebrow="About" title="Hi, I'm Kevin." />
            <div className={styles.prose}>{children}</div>
            <ul className={styles.links}>
              {links.map((l) => (
                <li key={l.name}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer">
                    <span className={styles.icon}>{l.svg}</span>
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.avatar}>
            <Image img={avatar} />
          </div>
        </div>
      </div>
    </section>
  );
}
