FROM cmfatih/slimerjs
MAINTAINER chetbox

ADD ./ghoulio.js /app/ghoulio.js

ENTRYPOINT ["/usr/bin/slimerjs", "/app/ghoulio.js"]
CMD []
