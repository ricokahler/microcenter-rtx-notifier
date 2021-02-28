// @ts-check
const fetch = require('node-fetch').default;
const { URLSearchParams } = require('url');
const { JSDOM } = require('jsdom');

async function scraper() {
  const searchParams = new URLSearchParams();
  searchParams.append('Ntk', 'all');
  searchParams.append('sorBy', 'match');
  searchParams.append('N', '4294966937');
  searchParams.append('storeid', process.env.STORE_ID);

  const response = await fetch(
    `https://www.microcenter.com/search/search_results.aspx?${searchParams}`,
  );

  const html = await response.text();

  const { document } = new JSDOM(html).window;

  const productNodes = Array.from(
    document.querySelectorAll('#productGrid ul li.product_wrapper'),
  );

  const products = productNodes
    .map((product) => {
      const description = product
        .querySelector('.pDescription')
        .textContent.replace(/\n/g, ' ')
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .trim()
        .substring(0, 30);

      const stock = product
        .querySelector('.stock')
        .textContent.replace(/\n/g, ' ')
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .trim();

      const price = product
        .querySelector('.price')
        .textContent.replace(/\n/g, ' ')
        .split(' ')
        .filter(Boolean)
        .join(' ')
        .trim();

      return { description, stock, price };
    })
    .filter((p) => p.description.includes('RTX'));

  /** @type {{[key: string]: typeof products[number] }} */
  const emptyAcc = {};

  const productsDeDupes = Object.values(
    products.reduce((acc, next) => {
      acc[next.description] = next;
      return acc;
    }, emptyAcc),
  );

  return productsDeDupes;
}

module.exports = scraper;
