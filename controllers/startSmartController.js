// controllers/startSmartController.js
const showIndexPage = (req, res) => {
  res.render('index');
};

const showFundingPage = (req, res) => {
  res.render('funding');
};

const showAboutPage = (req, res) => {
  res.render('about');
};

module.exports = {
  showIndexPage,
  showFundingPage,
  showAboutPage,
};