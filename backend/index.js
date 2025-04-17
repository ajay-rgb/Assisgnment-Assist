const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Import Mongoose models
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
const Question = require('./models/Question');

// Setup directories
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const PYTHON_SCRIPT = path.resolve(__dirname, 'python', 'check_plagiarism.py');
const PYTHON_QUESTIONS_SCRIPT = path.resolve(__dirname, 'python', 'generate_questions.py');
const PYTHON_EXECUTABLE = "python";

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Verify Python script exists
if (!fs.existsSync(PYTHON_SCRIPT)) {
    throw new Error('Required Python script not found: check_plagiarism.py');
}
if (!fs.existsSync(PYTHON_QUESTIONS_SCRIPT)) {
    throw new Error('Required Python script not found: generate_questions.py');
}

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept common text file types
        const allowedTypes = [
            '.txt', '.js', '.ts', '.py', '.java', '.cpp', '.c',
            '.html', '.css', '.md', '.json'
        ];

        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only text-based files are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'], // Allow DELETE method
    allowedHeaders: ['Content-Type', 'Accept'],
}));


app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: "Internal server error",
        details: err.message
    });
});

// Helper functions
/**
 * Runs the plagiarism check script using Python.
 * @param {object} inputData - The data to be sent to the Python script.
 * @returns {Promise<object>} The result of the plagiarism check.
 */
const runPlagiarismCheck = async (inputData) => {
    return new Promise((resolve, reject) => {
        const python = spawn(PYTHON_EXECUTABLE, [PYTHON_SCRIPT]);
        let result = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(errorOutput || 'Plagiarism check process failed'));
            } else {
                try {
                    resolve(JSON.parse(result));
                } catch (err) {
                    reject(new Error('Failed to parse plagiarism check results'));
                }
            }
        });

        python.on('error', (err) => {
            reject(new Error(`Failed to start plagiarism check: ${err.message}`));
        });

        python.stdin.write(JSON.stringify(inputData));
        python.stdin.end();
    });
};

/**
 * Runs the question generation script using Python.
 * @param {string} topic - The topic of the questions.
 * @param {string} difficulty - The difficulty level of the questions.
 * @param {string[]} types - The types of questions.
 * @param {number} count - The number of questions to generate.
 * @returns {Promise<string>} The generated questions.
 */
const runQuestionGeneration = async (topic, difficulty, types, count) => {
    return new Promise((resolve, reject) => {
        const python = spawn(PYTHON_EXECUTABLE, [
            PYTHON_QUESTIONS_SCRIPT,
            topic,
            difficulty,
            types.join(','),
            count.toString(),
        ]);
        let result = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(errorOutput || 'Question generation process failed'));
            } else {
                resolve(result.trim());
            }
        });

        python.on('error', (err) => {
            reject(new Error(`Failed to start question generation: ${err.message}`));
        });
    });
};


// Connect to MongoDB
/**
 * Connects to the MongoDB database.
 * @throws {Error} If there is an error connecting to the database.
 */
const connectToMongoDB = async () => {
    try {        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
};

// Routes
/**
 * Generates questions based on the given parameters.
 * @route POST /generate-questions
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.post('/generate-questions', async (req, res) => {
    const { topic, difficulty, types, count } = req.body;

    if (!topic || !difficulty || !types || !count) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const questions = await runQuestionGeneration(topic, difficulty, types, count);
        // Save questions to the database
        const questionDocs = [];
        const questionsArr = questions.split('\n\n');
        for (let questionStr of questionsArr) {
            if (questionStr.trim().length === 0) {
                continue; // Skip empty strings
            }
            const lines = questionStr.split('\n');
            const type = lines[0].replace('**Type**: ', '').trim();
            const question = lines[2].replace('**Question**: ', '').trim();
            const hint = lines[4].replace('**Hint**: ', '').trim();

            const newQuestion = new Question({
                question: question,
                hint: hint,
                type: type,
                topic: topic,
                difficulty: difficulty
            });
            questionDocs.push(newQuestion);
            await newQuestion.save();
        }

        res.json({ questions });
    } catch (err) {
        console.error('Error generating questions:', err);
        res.status(500).json({ error: 'Failed to generate questions', details: err.message });
    }
});

/**
 * Handles the file upload and plagiarism check for assignments.
 * @route POST /assignments
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.post("/assignments", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        let text;
        try {
            text = await fs.promises.readFile(file.path, "utf-8");
        } catch (readError) {
            console.error("File read error:", readError);
            return res.status(500).json({ error: "Failed to read uploaded file" });
        }

        const previousAssignments = await Assignment.find({});

        const inputPayload = {
            text,
            previous_assignments: previousAssignments.map((a) => a.text || ""),
        };

        try {
            const plagiarismResults = await runPlagiarismCheck(inputPayload);

            // Save the assignment after successful plagiarism check
            try {
                const newAssignment = new Assignment({
                    text: text,
                    id: Date.now().toString(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const savedAssignment = await newAssignment.save();
                console.log("Assignment saved:", savedAssignment.id);
            } catch (saveError) {
                console.error("Failed to save assignment:", saveError);
                // Continue since we still want to return plagiarism results
            }

            // Clean up uploaded file
            try {
                await fs.promises.unlink(file.path);
            } catch (unlinkError) {
                console.error("Failed to clean up file:", unlinkError);
                // Non-critical error, continue
            }

            return res.status(201).json(plagiarismResults);
        } catch (checkError) {
            console.error("Plagiarism check error:", checkError);
            return res.status(500).json({
                error: "Failed to process submission",
                details: checkError.message
            });
        }
    } catch (err) {
        console.error("Server error:", err);

        // Clean up file if it exists
        if (req.file && req.file.path) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (cleanupErr) {
                console.error("Failed to clean up file:", cleanupErr);
            }
        }

        return res.status(500).json({
            error: "Server error processing submission",
            details: err.message
        });
    }
});

/**
 * Retrieves all assignments.
 * @route GET /assignments
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get("/assignments", async (req, res) => {
    try {
        const assignments = await Assignment.find({});
        res.json(assignments);
    } catch (err) {
        console.error("Error fetching assignments:", err);
        res.status(500).json({
            error: "Failed to fetch assignments",
            details: err.message
        });
    }
});

/**
 * Deletes all assignments.
 * @route DELETE /assignments
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.delete("/assignments", async (req, res) => {
    try {
        await Assignment.deleteMany({});
        res.status(200).json({ message: "All assignments have been erased." });
    } catch (err) {
        console.error("Error clearing assignments:", err);
        res.status(500).json({ error: "Failed to clear assignments", details: err.message });
    }
});


// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Cleaning up...');
    // Clean up uploads directory
    try {
        const files = fs.readdirSync(UPLOADS_DIR);
        files.forEach(file => {
            fs.unlinkSync(path.join(UPLOADS_DIR, file));
        });
    } catch (err) {
        console.error('Error cleaning up uploads:', err);
    }
    process.exit(0);
});

// Start the server
/**
 * Starts the server and connects to the database.
 * @param {number} initialPort - The initial port number to try.
 */
const startServer = async (initialPort) => {
    await connectToMongoDB();
    const tryPort = (port) => {
        const server = app.listen(port)
            .on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${port} is busy, trying ${port + 1}...`);
                    tryPort(port + 1);
                } else {
                    console.error('Server error:', err);
                }
            })
            .on('listening', () => {
                console.log(`Server running at http://localhost:${port}`);
            });
    };

    tryPort(initialPort);
};

const port = process.env.PORT || 3001;
startServer(port);