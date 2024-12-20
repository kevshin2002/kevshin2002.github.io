import React from "react";
import Layout from "@theme/Layout";

import { Project, ProjectData } from "../components/projects/Project";

const assetsDir = "./assets/projects";
const projects: ProjectData[] = [
  {
    title: "Jetson Nano RC Car",
    description:
      "Autonomous RC car built using a Jetson Nano, Flipsky VESC, and a Traxxas chassis",
    url: "https://ucsd-ecemae-148.github.io/fall-2024-final-project-team-2/",
    image: "https://i.gyazo.com/91f2f352d4704252230281c60c67eeb3.gif",
    role: "Team Member",
  },
  {
    title: "Software Tools",
    description:
      "Collection of software tools in C++ for scalability and reuseability, focusing on templatization and best pragma",
    url: "https://github.com/kevshin2002/Coding-Journey/tree/main/Tools",
    image: require(`${assetsDir}/factory.png`),
    role: "Author",
  },
  {
    title: "Relational Database",
    description:
      "Replication of relational databse in C++ with core MySQL functionality, leveraging design patterns like MVC and CoR for extensibility and optimizing data storage and retrieval through caching and indexing.",
    url: "https://github.com/kevshin2002/Software-Development/tree/main/Relational%20Database",
    image: require(`${assetsDir}/database.png`),
    role: "Developer",
  },
  {
    title: "Traffic Sign Classification",
    description:
      "CNN-based deep learning model using ResNeXt-32 in PyTorch for traffic sign classification, trained on the TinyLISA and LISA dataset",
    url: "https://github.com/kevshin2002/ML-AI/tree/main",
    image: require(`${assetsDir}/traffic_sign.png`),
    role: "Co-Developer",
  },
  {
    title: "Classifiers with MNIST",
    description:
      "Implementation of linear classifiers using Euclidean and Mahalanobis distance, incorporating Maximum Likelihood Estimation and Principal Component Analysis, with an introduction to unsupervised learning through clustering techniques",
    url: "https://github.com/kevshin2002/ML-AI/tree/main/Classifiers%20with%20MNIST",
    image: require(`${assetsDir}/mnist.jpg`),
    role: "Developer",
  },
  {
    title: "Variational Autoencoder",
    description:
      "CNN model in PyTorch for generating chest X-ray images, utilizing convolutional layers, reparameterization, and performance evaluation with FID and Inception Score.",
    url: "https://github.com/kevshin2002/ML-AI/blob/main/Variational%20Autoencoder/VAE.ipynb",
    image: require(`${assetsDir}/chest.png`),
    role: "Developer",
  },
  {
    title: "TritonHacks Web Development Kit",
    description:
      "Beginner-friendly starter kit for high school students to learn and build web applications using HTML, CSS, JavaScript, and FastAPI during a hackathon at UCSD",
    url: "https://tritonhacks.github.io/thwebdev-24/",
    image: require(`${assetsDir}/tritonhacks.png`),
    role: "Team Lead",
  },
];

const title = "Projects";

export default function Projects(): JSX.Element {
  return (
    <Layout title={title}>
      <main className="container container--fluid margin-vert--lg">
        <h1>{title}</h1>

        <div className="row">
          {projects.map((project) => (
            <Project key={project.title} {...project} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
