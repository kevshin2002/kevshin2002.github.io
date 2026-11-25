import React, { useEffect } from "react";
import Link from "@docusaurus/Link";
import { BackgroundMedia } from "./BackgroundMedia";
import styles from "./Hero.module.scss";

/**
 * Make the navbar transparent while it sits over the hero. Uses a data
 * attribute rather than a class: react-helmet owns <html class> and resets it
 * after hydration.
 */
function useHeroNavbar() {
  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      root.dataset.homeHero = window.scrollY > 40 ? "scrolled" : "top";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      delete root.dataset.homeHero;
    };
  }, []);
}

export function Hero(): JSX.Element {
  useHeroNavbar();

  return (
    <header className={styles.hero}>
      <BackgroundMedia
        className={styles.bg}
        src="/video/hero-lap-720.mp4"
        srcSmall="/video/hero-lap-640.mp4"
        poster="/video/hero-lap.jpg"
        preload="auto"
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.eyebrow}>Autonomy · localization · perception</p>
        <h1 className={styles.title}>Kevin Shin</h1>
        <p className={styles.lede}>
          I work on where a robot is and what is around it: state estimation,
          LiDAR map matching and sensor fusion for autonomous systems.
        </p>
        <div className={styles.ctas}>
          <Link className={styles.ctaPrimary} to="/career">
            Career
          </Link>
          <Link className={styles.cta} to="/projects">
            Projects
          </Link>
          <Link className={styles.cta} to="/blog">
            Blog
          </Link>
          <Link className={styles.cta} to="/docs/note">
            Notes
          </Link>
        </div>
      </div>

      <a className={styles.scrollCue} href="#about" aria-label="Scroll down">
        <span />
      </a>
    </header>
  );
}
