const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the view engine (assuming you are using Mustache as the templating engine)
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mount the routes
const consultantsRoute = require('./routes/consultantsRoute');
const startupsRoute = require('./routes/startupsRoute');

app.use('/consultants', consultantsRoute);
app.use('/startups', startupsRoute);


// Route for the landing page
app.get('/', (req, res) => {
  res.render('index');
});

// Mount the startSmartRoute
const startSmartRoute = require('./routes/startSmartRoute');
app.use('/', startSmartRoute);




// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send('404 Page Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 Internal Server Error');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
