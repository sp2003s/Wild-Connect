const express = require('express');
const bodyParser = require('body-parser');
const { writeJob, writeUser } = require('./util');
const fs = require('fs').promises;
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  })
);

async function verifyLogin(username, password) {
  try {
    // Read the JSON file
    const usersData = await fs.readFile('users.json', 'utf8');

    // Parse the JSON data
    const users = JSON.parse(usersData);

    // Check if any user has the matching username and password
    const matchedUser = users.find(user => user.email === username && user.password2 === password);

    return !!matchedUser;
  } catch (error) {
    console.error(error);
    return false;
  }
}

app.use(express.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  const user = req.session.user;
  res.render('index.html', { user });
});


// Handle form submission
app.post('/postjob', async (req, res) => {
  const { jobTitle, location, jobDescription, qualifications, applicationDeadline } = req.body;

  // Create an object with the form data
  const job = {
    jobTitle,
    location,
    jobDescription,
    qualifications,
    applicationDeadline,
  };

  await writeJob(job);
  // redirect to another page, successful response or not
  res.redirect("success.html");
});

app.get('/apply', async (_, res) => {
  const jsData = await fs.readFile('data.json', 'utf-8');
  res.send(jsData);
});

app.post('/signedup', async (req, res) => {
  const { name, email, password2 } = req.body;

  const users = {
    name,
    email,
    password2
  };
  await writeUser(users);
  res.redirect(`/?user=${email}`);
});

app.get('/loginuser', async (req, res) => {
  const { username, password } = req.query;

  try {
    const isVerified = await verifyLogin(username, password);

    if (isVerified) {
      const userQuery = encodeURIComponent(username); // Encode the username for URL
    res.redirect(`/?user=${userQuery}`);
    } else {
      const alertStyle = `
        padding: 10px;
        background-color: #f44336;
        color: white;
        font-size: 16px;
        text-align: center;
        width:50%;
        margin-left: 25%;
        border-radius:3px;
      `;

      const alertHTML = `
        <html>
          <head>
            <style>
              .alert {
                ${alertStyle}
              }
            </style>
          </head>
          <body>
            <div class="alert">
              Invalid Login Credentials<br><br>
              <button onclick="window.location.href = 'login.html'" style="background-color:rgba(200,200,200, 0.950); padding:8px; width:62px; border-radius:18px; border:1px solid grey; cursor:pointer;">
              OK
              </button>
            </div>
          </body>
        </html>
      `;

      res.send(alertHTML);
    }
  } catch (error) {
    console.error(error.stack);
    res.status(500).send("Internal Server Error");
  }
});



const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Server has started: http://localhost:${PORT}`));
