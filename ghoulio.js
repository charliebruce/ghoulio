var url = phantom.args[0];
var script = phantom.args.slice(1).join(' ');

if (!url || !script) {
  console.log('Usage: ');
  console.log('  ghoulio URL SCRIPT');
  console.log('');
  console.log('Use "close()" with SCRIPT to end the session');
  phantom.exit(1);
}

var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
  if (msg === '*** CLOSE WINDOW ***') {
    phantom.exit(1);
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
      console.log('*** CLOSE WINDOW ***');
    }
    try {
      eval(script);
    } catch(e) {
      console.log(e.toString());
      close();
    }
  }, script);
});
