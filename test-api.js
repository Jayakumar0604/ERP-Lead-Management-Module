const http = require('http');

http.get('http://localhost:5000/leads?_page=1&_per_page=1000', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Keys:', Object.keys(parsed));
      if (Array.isArray(parsed)) {
        console.log('Is Array, length:', parsed.length);
        if (parsed.length > 0) {
          console.log('First item status:', parsed[0].status);
        }
      } else {
        console.log('Is Object, data length:', parsed.data ? parsed.data.length : 'undefined');
        if (parsed.data && parsed.data.length > 0) {
          console.log('First item status:', parsed.data[0].status);
        }
      }
    } catch (e) {
      console.error('Parse error', e);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
