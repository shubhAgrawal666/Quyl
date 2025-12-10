// src/data/dummyUsers.js

export default [
  {
    _id: "u1",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "user",
    registeredAt: "2024-01-10",
    enrolledCourses: [
      { courseId: "c1", progress: 40 },
      { courseId: "c2", progress: 90 }
    ]
  },
  {
    _id: "u2",
    name: "Aisha Verma",
    email: "aisha@gmail.com",
    role: "admin",
    registeredAt: "2024-02-15",
    enrolledCourses: [
      { courseId: "c2", progress: 100 },
      { courseId: "c3", progress: 50 }
    ]
  },
  {
    _id: "u3",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    registeredAt: "2024-03-12",
    enrolledCourses: []
  }
];
