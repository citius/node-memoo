'use strict';

const allowTypes = [
  'success',
  'info',
  'warning',
  'danger',
  'error'
];

const alertAliases = {
  error: 'warning'
};

module.exports = function () {
  return function (req, res, next) {
    let body = {};

    if ((req.header('content-type') == 'application/x-www-form-urlencoded'
      || req.header('content-type') == 'multipart/form-data')
      && req.body) {
      body = req.body;
    }
    
    res.locals.messages = function () {
      var html = '';

      allowTypes.forEach((type) => {
        let messages = req.flash(type);
        if (messages.length) {
          html += new BootstrapFlashMessage(type, messages).toHtml();
        }
      });

      return html;
    };
    
    res.locals.isGuest = req.user ? true : false;
    res.locals.user = req.user;

    return next();
  };
};

class BootstrapFlashMessage {
  constructor(type, messages) {
    this.type = alertAliases[type] ? alertAliases[type]: type;
    this.messages = typeof messages == 'string' ? [messages] : messages;  
  }

  toHtml() {
    let html = '';

    if (this.messages.length) {
      html = this.messages.map((message) => {
        return this.message(message);
      }).join('');
    }

    return html;
  }

  message(message) {
    let html = '';
    
    html += '<div class="alert alert-' + this.type + ' alert-dismissible custom-alert" role="alert">';
    html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    html += message;
    html += '</div>';
    
    return html;
  }
}
