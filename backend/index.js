const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Setup directories
const STORAGE_FILE = path.join(__dirname, 'assignments.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PYTHON_SCRIPT = path.join(__dirname, 'python', 'check_plagiarism.py');
const PYTHON_EXECUTABLE = "python"; // Update this to the correct Python executable if needed

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(STORAGE_FILE)) {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify([]));
}

// Verify Python script exists
if (!fs.existsSync(PYTHON_SCRIPT)) {
  throw new Error('Required Python script not found: check_plagiarism.py');
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

// Configure CORS
app.use(cors({
  origin: 'http://localhost:8080',
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

// Helper functions for file operations
const readAssignments = () => {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      return [];
    }
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading assignments:', err);
    return [];
  }
};

const saveAssignment = (assignment) => {
  try {
    const assignments = readAssignments();
    assignment.id = Date.now().toString();
    assignment.createdAt = new Date().toISOString();
    assignment.updatedAt = new Date().toISOString();
    assignments.unshift(assignment);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(assignments, null, 2));
    return assignment;
  } catch (err) {
    console.error('Error saving assignment:', err);
    throw err;
  }
};

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

    const previousAssignments = readAssignments();

    const inputPayload = {
      text,
      previous_assignments: previousAssignments.map((a) => a.text || ""),
    };

    try {
      const plagiarismResults = await runPlagiarismCheck(inputPayload);
      
      // Save the assignment after successful plagiarism check
      try {
        const savedAssignment = saveAssignment({ text });
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

app.get("/assignments", async (req, res) => {
  try {
    const assignments = readAssignments();
    res.json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ 
      error: "Failed to fetch assignments",
      details: err.message 
    });
  }
});

app.delete("/assignments", async (req, res) => {
  try {
    // Clear the assignments.json file
    fs.writeFileSync(STORAGE_FILE, JSON.stringify([]));
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

const startServer = (initialPort) => {
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
