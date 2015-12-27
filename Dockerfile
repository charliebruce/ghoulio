FROM chetbox/slimerjs:1.2.0
MAINTAINER chetbox

ADD ./ghoulio.js /app/ghoulio.js

ENTRYPOINT ["/usr/bin/slimerjs", "/app/ghoulio.js"]
CMD []
