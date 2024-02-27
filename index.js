const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
 
require('dotenv').config();
 
const app = express();
 
app.use(cors());
app.use(bodyParser.json());
 
// Set view engine to EJS
app.set('view engine', 'ejs');
 
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
 
const emptyTestCases = ''; // Define an empty string for initial cases
 
// Load API key from environment variable
const apiKey = process.env.OPENAI_API_KEY;
//console.log(apikey);
 
// Create and authenticate OpenAI object once
const openai = new OpenAI(apiKey);
//console.log(openai);
 
app.post('/get-test-case', async (req, res) => {
  const { codeSnippet } = req.body;
 
  const sysPrompt = "You are a test case generation assistant.";
  const userPrompt = `Generate test cases for the following code:\n\n${codeSnippet}`;
 
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: sysPrompt },
        { role: "user", content: userPrompt }
      ]
    });
 
    const testCases = completion.choices[0].message.content;
    res.json({ testCases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
// Render the initial HTML form
app.get('/', (req, res) => {
    res.render('index', { testCases: emptyTestCases }); // Render with empty cases initially
  });
 
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});