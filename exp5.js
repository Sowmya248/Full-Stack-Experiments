const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Custom middleware for request logging
app.use((req, res, next) => {
    console.log(
        `${new Date().toLocaleString()} - ${req.method} ${req.url}`
    );
    next();
});

// Sample student data
let students = [
    {
        id: 101,
        name: "Sowmya",
        department: "ECE",
        year: 2,
        email: "sowmya@gmail.com"
    },
    {
        id: 102,
        name: "Ruchita",
        department: "ECE",
        year: 2,
        email: "ruchita@gmail.com"
    }
];

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running"
    });
});

// GET - Retrieve all students
app.get("/students", (req, res) => {
    res.status(200).json(students);
});

// GET - Retrieve student by ID
app.get("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// POST - Add a new student
app.post("/students", (req, res) => {
    const { id, name, department, year, email } = req.body;

    if (!id || !name || !department || !year || !email) {
        return res.status(400).json({
            message: "All student details are required"
        });
    }

    const newStudent = {
        id,
        name,
        department,
        year,
        email
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// PUT - Update student
app.put("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const studentIndex = students.findIndex(s => s.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, department, year, email } = req.body;

    students[studentIndex] = {
        id: id,
        name: name || students[studentIndex].name,
        department: department || students[studentIndex].department,
        year: year || students[studentIndex].year,
        email: email || students[studentIndex].email
    };

    res.status(200).json({
        message: "Student updated successfully",
        student: students[studentIndex]
    });
});

// DELETE - Delete student
app.delete("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const studentIndex = students.findIndex(s => s.id === id);

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(studentIndex, 1);

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent[0]
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});