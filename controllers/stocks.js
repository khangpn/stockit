var express = require('express');
var router = express.Router();
var partials = express.Router();

//------------------- Admin Section ----------------------
//Angular app
router.get('/', function(req, res, next) {
  return res.render("angular_index");
});
//--------------------------------------------------------

//----------------- Partials section --------------------
partials.get('/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/_' + name);
});

router.use('/partials', partials);
//--------------------------------------------------------

module.exports = router;
