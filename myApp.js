const express = require('express');
const app = express();

const helmet = require('helmet');
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({action: 'deny'}));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());

const ninetyDaysInSeconds = 90*24*60*60;
app.use(helmet.hsts({maxAge: ninetyDaysInSeconds, force: true}));

/*To improve performance, most browsers prefetch DNS records for the links in a page. 
In that way the destination ip is already known when the user clicks on a link. 
This may lead to over-use of the DNS service, privacy issues, or page statistics alteration 
(some links may appear visited even if they are not). If you have high security needs you can 
disable DNS prefetching, at the cost of a performance penalty.*/
app.use(helmet.dnsPrefetchControl());

/*If you are releasing an update for your website, and you want the users to always download 
the newer version, you can (try to) disable caching on client’s browser. It can be useful in 
development too. Caching has performance benefits, which you will lose, so only use this option 
when there is a real need.*/
app.use(helmet.noCache());

app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'", "trusted-cdn.com"] }}));

/*app.use(helmet()) will automatically include all the middleware introduced above, except noCache(),
and contentSecurityPolicy(), but these can be enabled if necessary.*/
app.use(helmet());




module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
