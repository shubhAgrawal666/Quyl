// src/data/dummyCourses.js
const dummyCourses = [
  {
    _id: "course1",
    title: "React Mastery Bootcamp",
    description: "Learn React from scratch, hooks, routing, and real projects.",
    thumbnail: "https://cdn.pixabay.com/photo/2014/04/03/10/32/code-309092_1280.png",
    category: "Frontend",
    lessons: [
      { id: "v1", title: "Intro to React", url: "https://youtu.be/react1", thumbnail: "https://img.youtube.com/vi/react1/0.jpg", creator: "Jane Doe", duration: "10:12" },
      { id: "v2", title: "JSX & Components", url: "https://youtu.be/react2", thumbnail: "https://img.youtube.com/vi/react2/0.jpg", creator: "John Smith", duration: "18:30" },
    ],
    students: 1540,
    rating: 4.8
  },
  {
    _id: "course2",
    title: "Node & Express API Development",
    description: "Build REST APIs, JWT auth, CRUD, and backend logic.",
    thumbnail: "https://cdn.pixabay.com/photo/2017/01/31/17/44/server-clipart-2029100_1280.png",
    category: "Backend",
    lessons: [
      { id: "v1", title: "Node Basics", url: "https://youtu.be/node1", thumbnail: "https://img.youtube.com/vi/node1/0.jpg", creator: "Alice Dev", duration: "14:05" },
    ],
    students: 980,
    rating: 4.6
  },
  {
    _id: "course3",
    title: "Full MERN Stack Project",
    description: "End-to-end MERN project building and deployment.",
    thumbnail: "https://cdn.pixabay.com/photo/2016/11/29/05/08/business-1868813_1280.jpg",
    category: "Fullstack",
    lessons: [
      { id: "v1", title: "Project Setup", url: "https://youtu.be/mern1", thumbnail: "https://img.youtube.com/vi/mern1/0.jpg", creator: "Dev Guru", duration: "22:10" },
    ],
    students: 540,
    rating: 4.9
  }
];

export default dummyCourses;
