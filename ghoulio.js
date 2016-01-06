var url = phantom.args[0];
var callback_url = phantom.args[1];
var script = phantom.args[2];

if (!url || !script) {
  console.log('ghoulio v2.1');
  console.log('');
  console.log('Usage: ');
  console.log('  ghoulio URL CALLBACK_URL SCRIPT');
  console.log('');
  console.log('Use "resolve()" with SCRIPT to end the session');
  phantom.exit(1);
}

var webpage = require('webpage');
var page = webpage.create();

function callback(message, _callback) {
  if (!callback_url) {
    console.warn('No callback URL specified');
    if (_callback) _callback(null);
    return;
  }
  var message_with_url = { url: url };
  var callback_page = webpage.create();
  callback_page.open(callback_url + '?response=' + encodeURIComponent(JSON.stringify(message)), function(status) {
    if (status !== 'success') console.error(status);
    if (_callback) _callback(status);
  });
}

function handle_success(data) {
  console.log(JSON.stringify(data));
  callback({success: true, data: data, url: page.url}, function() {
    phantom.exit(0);
  });
}

function handle_error(message, info) {
  console.error(message);
  if (info) console.error(info);
  callback({success: false, url: url, error: {message: message, info: info}}, function() {
    phantom.exit(1);
  });
}

function handle_message(message) {
  console.info(JSON.stringify(message));
  callback({message: message, url: page.url});
}

phantom.onError = function(msg, trace) {
  handle_error('SlimerJS error: ' + msg, trace);
};

page.onConsoleMessage = function(msg) {
  if (msg.startsWith('*** EXIT SUCCESS ***')) {
    var data = JSON.parse(msg.substring(20));
    handle_success(data);
  } else if (msg.startsWith('*** EXIT FAILURE ***')) {
    var error = JSON.parse(msg.substring(20));
    handle_error(error.message, error.stack);
  } else if (msg.startsWith('*** MESSAGE ***')) {
    var message = JSON.parse(msg.substring(15));
    handle_message(message);
  } else {
    console.log(msg);
  }
};

page.onResourceReceived = function(res) {
  if (res.stage === 'end' && res.status >= 400) {
    handle_error('HTTP Error ' + res.status, res.statusText);
  }
};

page
.open(url)
.then(function(status) {
  if (status !== 'success') {
    handle_error('SlimerJS status: ' + status);
    return;
  }
  page.viewportSize = { width: 680, height: 680 };
  page.evaluate(function(script) {
    function callback(data) {
      return $.post(callback_url, {data: JSON.stringify(data)});
    }
    function resolve(data) {
      console.log('*** EXIT SUCCESS ***' + JSON.stringify(data || null));
    }
    function reject(e) {
      if (typeof(e) !== 'object') {
        e = new Error(e);
      }
      console.log('*** EXIT FAILURE ***' + JSON.stringify(e || {}, ['message', 'stack']));
    }
    function callback(message) {
      console.log('*** MESSAGE ***' + JSON.stringify(message || null));
    }
    try {
      eval(script);
    } catch(e) {
      reject(e);
    }
  }, script);
});
