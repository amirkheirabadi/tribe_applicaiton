const server = require('./server')
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({
  dev,
});
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(async () => {
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });