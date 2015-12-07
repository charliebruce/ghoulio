var url = phantom.args[0];
var script = phantom.args.slice(1).join(' ');

if (!url || !script) {
  console.log('ghoulio v1.0');
  console.log('');
  console.log('Usage: ');
  console.log('  ghoulio URL SCRIPT');
  console.log('');
  console.log('Use "close()" with SCRIPT to end the session');
  phantom.exit(1);
}

var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
  if (msg === '*** EXIT SUCCESS ***') {
    phantom.exit(0);
  } else if (msg === '*** EXIT FAILURE ***') {
    phantom.exit(1)
  } else {
    console.log(msg);
  }
};

page
.open(url)
.then(function() {
  page.viewportSize = { width: 680, height: 680 };
  page.evaluate(function(script, close) {
    function close() {
      console.log('*** EXIT SUCCESS ***');
    }
    function fail(e) {
      console.log(e.toString());
      console.log('*** EXIT FAILURE ***');
    }
    try {
      eval(script);
    } catch(e) {
      fail(e);
    }
  }, script);
});
