import React from "react";
import Layout from "@theme/Layout";
import { Career } from "../components/home/Career";

export default function CareerPage(): JSX.Element {
  return (
    <Layout title="Career" description="Where Kevin Shin has worked.">
      <main className="home page-top">
        <Career />
      </main>
    </Layout>
  );
}
