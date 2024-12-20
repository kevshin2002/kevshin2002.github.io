import React from "react";
import Layout from "@theme/Layout";

import Talk, { TalkMetadata } from "../components/talks/Talk";

import DiscoveringIntentBasedChatbot from "./assets/talks/_discovering-intent-based-chatbot.md";

const talks: TalkMetadata[] = [
  {
    title: "Discovering Intent-based Chatbot: Powered by the Rasa Framework",
    description: <DiscoveringIntentBasedChatbot />,
    events: [
      {
        name: "Let's Shoalter Together !",
        location: "Taipei, Taiwan",
        date: new Date(2022, 9, 15),
      },
    ],
  },
  // {
  //   title: "GraphQL in Go",
  //   description: <GraphQLInGoDescription />,
  //   events: [
  //     {
  //       name: "Gophers Silesia",
  //       location: "Katowice, Poland",
  //       date: new Date(2018, 4, 10),
  //     },
  //   ],
  //   recordingURL: "https://www.youtube.com/watch?v=NjFXLbJvZmQ",
  //   slidesURL:
  //     "https://docs.google.com/presentation/d/1v6H21vHMd_rAZ9qjXcags2dMR2OYR-kQkarNVJZxbOs/edit",
  //   repoURL: "https://github.com/pkosiec/golang-graphql-samples",
  // },
];

const title = "Talks";
const description = "Featured talks I presented on various events.";

export default function Talks(): JSX.Element {
  return (
    <Layout title={title} description={description}>
      <main className="container container--fluid margin-vert--lg">
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="row">
          {talks.map((talkData) => (
            <Talk key={talkData.title} {...talkData} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
