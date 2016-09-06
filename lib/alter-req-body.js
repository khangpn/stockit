/**
 * Set empty request param to null
 * put this mw after loading models
 */

module.exports = function (req, res, next) {
  if (req.body) {
    var data = req.body;
    for (var property in data) {
      if (data.hasOwnProperty(property)) {
        if (data[property] === "") data[property] = null;
      }
    }
  }
  return next();
};
