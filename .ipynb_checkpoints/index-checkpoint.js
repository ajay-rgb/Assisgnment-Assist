const express = require("express");
const { PrismaClient } = require("@prisma/client");
const SimHash = require("simhash-js").SimHash;

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

function getSimHash(text) {
  return new SimHash().hash(text);
}

app.post("/submit-assignment", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No assignment text provided" });

  const newSimHash = BigInt(getSimHash(text));

  // Retrieve previous assignments
  const assignments = await prisma.assignment.findMany();

  // Check similarity using Hamming distance
  let plagiarismDetected = false;
  let similarAssignments = [];

  for (const assignment of assignments) {
    const storedSimHash = BigInt(assignment.simhash);
    const hammingDistance = (newSimHash ^ storedSimHash).toString(2).split("1").length - 1;
    const similarity = 1 - hammingDistance / 64; // Normalize to [0,1]

    if (similarity > 0.75) {
      plagiarismDetected = true;
      similarAssignments.push({ id: assignment.id, similarity: similarity.toFixed(4) });
    }
  }

  // Store new assignment in database
  await prisma.assignment.create({
    data: { text, simhash: newSimHash },
  });

  return res.json({ plagiarismDetected, similarAssignments });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
