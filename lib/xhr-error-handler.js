/**
 * Handle internal error and response to XHR request
 */

module.exports = function (err, req, res, next) {
  //if (req.xhr) { // XMLHttpRequest header is removed from angular request so this is false
  if (req.path.split('/')[1] == 'api') { 
    console.log('=======lib/xhr-error-handler');
    console.log(err.stack);//TODO: log the error to log file
    return res.status(500).send({ msg: 'Internal error! Please contact sysadmin for this error!' });
  }
  return next(err);
};

