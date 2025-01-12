import React from "react";
import Layout from "@theme/Layout";

import { Course, CourseData } from "../components/courses/Course";

const courses: CourseData[] = [
  {
    title: "Linear Systems Fundamentals",
    description:
      "Complex variables, singularities, and residues applied to signal and system analysis in continuous and discrete time; includes Fourier, Laplace, and z-transforms, LTI systems, impulse and frequency response, transfer functions, poles and zeros, stability, convolution, sampling, and aliasing",
    term: "2022",
  },
  {
    title: "Linear Control System Theory I",
    description:
      "Stability of continuous- and discrete-time SISO LTI control systems using frequency domain methods; includes transient and steady-state behavior, root locus, Bode, Nyquist, Nichols plots, and compensator design",
    term: "2022",
  },
  {
    title: "Introduction to Linear and Nonlinear Optimizations",
    description:
      "Linear least squares problems, constrained and unconstrained quadratic optimization, and geometry of linear transformations; introduces nonlinear optimization with applications in signal processing, system identification, robotics, and circuit design",
    term: "2022",
  },
  {
    title: "Software Foundations I",
    description:
      "Software analysis, design, and development using C++, focusing on data structures, algorithms, object-oriented methods, and design patterns. Includes real-world challenges in building, testing, and debugging software to develop a strong foundation in modern software design and architecture",
    term: "2023",
  },
  {
    title: "Software Foundations II",
    description:
      "Builds upon the C++ foundation of ECE 141A to design and implement a database management solution. Covers STL, design patterns, parsing, searching, sorting, algorithmic thinking, design partitioning, and best practices in debugging and testing",
    term: "2023",
  },
  {
    title: "The Art of Product Engineering I",
    description:
      "Builds on electrical and computer engineering fundamentals to develop skills in software, full-stack engineering, and commercial product development. Focuses on researching, designing, and creating an IoT device for an emerging market. Emphasis on fullstack development and entrepreneurship",
    term: "2023",
  },
  {
    title: "The Art of Product Engineering II",
    description:
      "Second course for The Art of Product Engineering I with an emphasis on IoT development and continuation of entrepreneurship and market fit. Topics include MQTT and embedded development with ESP32",
    term: "2023",
  },
  {
    title: "Linear Electronic Systems",
    description:
      "Linear active circuit and system design covering frequency response, Laplace transforms, and filter design with operational amplifiers. Combines lecture and lab for analysis, design, simulation, and testing of circuits and systems",
    term: "2023",
  },
  {
    title: "Linear Control System Theory II",
    description:
      "Time-domain state-variable formulation for discrete-time and continuous-time linear systems, including state-space realizations from transfer functions. Covers stability, controllability, observability, minimal realizations, and pole placement via full-state feedback",
    term: "2023",
  },
  {
    title: "Robotics Sensing and Estimation",
    description:
      "Covers mathematical fundamentals of Bayesian filtering applied to sensing and estimation in mobile robotics. Topics include MLE, EM, Gaussian and particle filters, SLAM, visual features, optical flow, and HMMs",
    term: "2024",
  },
  {
    title: "Intelligent Systems",
    description:
      "Introduces fundamental concepts in machine perception, including edge detection, segmentation, texture analysis, image registration, and compression",
    term: "2024",
  },
  {
    title: "Intro to Autonomous Vehicles",
    description:
      'Introduces fundamentals of autonomous vehicles through robotics "cooperation", focusing on fast prototyping, project management, programming, computer vision, ROS, and deep learning. Students build scale cars in small teams using best engineering practices',
    term: "2024",
  },
  {
    title: "Machine Learning",
    description:
      "Introduction to pattern recognition and machine learning, covering decision functions, statistical classifiers, generative vs. discriminant methods, feature selection, regression, unsupervised learning, clustering, and applications",
    term: "2024",
  },
  {
    title: "Statistical Learning",
    description:
      "Covers Bayesian decision theory, parameter estimation, bias-variance trade-off, Bayesian estimation, predictive distribution, priors, dimensionality reduction, PCA, Fisher's LDA, density estimation, EM, and applications",
    term: "2024",
  },
  {
    title: "Probabilistical Graphical Models",
    description:
      "Explores Bayes’ rule for probabilistic reasoning, graphical models for knowledge encoding, conditional independence, D-Separation, Markov random fields, inference methods, MCMC sampling, sequential data analysis, and algorithms like Viterbi, BCJR, and Baum-Welch for parameter estimation",
    term: "2024",
  },
  {
    title: "Deep Learning and Applications",
    description:
      "Covers deep learning fundamentals, neural network architectures (ConvNet, RNN), optimization algorithms, and applications in computer vision, robotics, and NLP. Includes hands-on PyTorch implementation",
    term: "2024",
  },
  {
    title: "Stochastic Processes and Dynamic Systems",
    description:
      "Covers diffusion equations, estimation and detection (linear and nonlinear), random fields, stochastic dynamic system optimization, and applications of stochastic optimization",
    term: "2024",
  },
  {
    title: "Random Processes",
    description:
      "Explores random variables, probability distributions, stochastic processes, stationarity, power spectrum, and spectral density. Includes stochastic integrals, spectral representation of WSS processes, harmonizable processes, and moving average representations",
    term: "2024",
  },
  {
    title: "Probability and Random Processes",
    description:
      "Covers random processes, stationary processes (correlation, power spectral density), Gaussian processes and their linear transformations, point processes, and random noise in linear systems",
    term: "2024",
  },
  {
    title: "Stochastic Processes I",

    description:
      "Covers random vectors, multivariate densities, covariance matrix, multivariate normal distribution, random walk, and Poisson process",
    term: "2024",
  },
  {
    title: "Convex Optimizations and Applications",
    description:
      "Covers convex optimization theory and algorithms, focusing on problem formulation, duality, and applications in system design, pattern recognition, combinatorial optimization, and financial engineering",
    term: "2024",
  },
  {
    title: "Numerical Linear Analysis ",
    description:
      "Covers numerical methods for linear algebraic systems and least squares problems, including orthogonalization, ill-conditioned problems, and eigenvalue and singular value computations",
    term: "2024",
  },
  {
    title: "Linear Algebra and Applications",
    description:
      "Builds mathematical foundations of linear algebra for applications in signal processing, communication, and machine learning. Topics include vector and Hilbert spaces, orthogonal projection, sparsity, eigenanalysis, Hermitian and positive semidefinite matrices, SVD, and PCA",
    term: "2024",
  },
];

const groupCoursesByTerm = (
  courses: CourseData[],
): Record<string, CourseData[]> => {
  const sortedCourses = [...courses].sort(
    (a, b) => parseInt(b.term) - parseInt(a.term),
  );

  const grouped = sortedCourses.reduce(
    (acc, course) => {
      if (!acc[course.term]) {
        acc[course.term] = [];
      }
      acc[course.term].push(course);
      return acc;
    },
    {} as Record<string, CourseData[]>,
  );

  const sortedTerms = Object.keys(grouped).sort(
    (a, b) => parseInt(b) - parseInt(a),
  );

  const sortedGrouped = sortedTerms.reduce(
    (acc, term) => {
      acc[term] = grouped[term];
      return acc;
    },
    {} as Record<string, CourseData[]>,
  );

  return sortedGrouped;
};
const groupedCourses = groupCoursesByTerm(courses);

const title = "Courses";

export default function Courses(): JSX.Element {
  return (
    <Layout title={title}>
      <main className="container container--fluid margin-vert--lg">
        {/* Ensure we're rendering in sorted order by converting to array first */}
        {Object.entries(groupedCourses)
          .sort(([termA], [termB]) => parseInt(termB) - parseInt(termA))
          .map(([term, courses]) => (
            <div key={term} className="margin-bottom--lg">
              <h2>{term}</h2>
              <div className="row">
                {courses.map((course) => (
                  <Course key={`${course.title}-${term}`} {...course} />
                ))}
              </div>
            </div>
          ))}
      </main>
    </Layout>
  );
}
