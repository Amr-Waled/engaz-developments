const https = require('https');

const data = JSON.stringify({
  host: 'engazdevelopments.com',
  key: 'engazdevelopments2026indexnow',
  keyLocation: 'https://engazdevelopments.com/engazdevelopments2026indexnow.txt',
  urlList: [
    'https://engazdevelopments.com/',
    'https://engazdevelopments.com/llms.txt',
    'https://engazdevelopments.com/llms-full.txt',
    'https://engazdevelopments.com/projects.html',
    'https://engazdevelopments.com/about.html',
    'https://engazdevelopments.com/portfolio.html',
    'https://engazdevelopments.com/contact.html',
    'https://crm.engazdevelopments.com/'
  ]
});

const endpoints = [
  { host: 'api.indexnow.org', path: '/indexnow' },
  { host: 'www.bing.com', path: '/indexnow' },
  { host: 'yandex.com', path: '/indexnow' }
];

endpoints.forEach(endpoint => {
  const options = {
    hostname: endpoint.host,
    port: 443,
    path: endpoint.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    console.log([IndexNow]  - Status Code: );
  });

  req.on('error', (e) => {
    console.error([IndexNow] Error for :, e.message);
  });

  req.write(data);
  req.end();
});
