import React from "react";
import Layout from "@theme/Layout";
import { Projects } from "../components/home/Projects";

export default function ProjectsPage(): JSX.Element {
  return (
    <Layout title="Projects" description="Things Kevin Shin has built.">
      <main className="home page-top">
        <Projects />
      </main>
    </Layout>
  );
}
