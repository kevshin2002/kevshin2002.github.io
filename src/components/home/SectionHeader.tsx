import React from "react";
import styles from "./SectionHeader.module.scss";

export function SectionHeader({
  eyebrow,
  title,
  lede,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  as?: "h1" | "h2";
}): JSX.Element {
  return (
    <div className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <Tag className={styles.title}>{title}</Tag>
      {lede && <p className={styles.lede}>{lede}</p>}
    </div>
  );
}
