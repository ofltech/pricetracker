import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrape Amazon Product.
 * 
 * This asynchronous function is for scraping an Amazon product.
 * @param url The Amazon product URL string to scrape.
 */
export async function scrapeAmazonProduct(url: string) {
  if (!url) {
    return;
  }

  // BrightData proxy configuration.
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  // Get data from BrightData using the request options.
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: 'brd.superproxy.io',
    port,
    rejectUnauthorized: false,
  }

  try {
    // Fetch the product page.
    const response = await axios.get(url, options);

    console.log(response.data);
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}.`)
  }
}
