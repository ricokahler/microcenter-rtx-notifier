require('dotenv/config');
const scraper = require('./scraper');

it('works', async () => {
  const result = await scraper();

  console.log(result);
});
