'use strict';
const http = require('http');
const pug = require('pug');
const favorite = require('./favorite.json');
const server = http
  .createServer((req, res) => {
    console.info(`Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    switch (req.method) {
      case 'GET':
        switch (req.url) {
          case '/':
            res.write(pug.renderFile('./index.pug'));
            break;
          case '/enquetes':
            res.write(pug.renderFile('./list.pug', favorite));
            break;
          case '/enquetes/yaki-shabu':
            res.write(pug.renderFile('./form.pug', favorite.yakiOrShabu));
            break;
          case '/enquetes/rice-bread':
            res.write(pug.renderFile('./form.pug', favorite.riceOrBread));
            break;
          case '/enquetes/sushi-pizza':
            res.write(pug.renderFile('./form.pug', favorite.sushiOrPizza));
            break;
        }

        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
            console.info(`${body}`);
            res.write(`<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`);
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`Client Error`, e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`Listening on ${port}`);
});
