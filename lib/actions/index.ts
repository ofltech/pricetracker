'use server'

import { scrapeAmazonProduct } from '../scraper';
// import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';

/**
 * Scrape and Store Product.
 * 
 * This asynchronous server function is for scraping the product and
 * storing the information in the database for price tracking.
 * @param productUrl The product URL string to scrape.
 */
export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) {
        return;
    }

    try {
        const scrapedProduct = await scrapeAmazonProduct(productUrl);

        if (!scrapedProduct) {
            return;
        }

        // Store scraped product to the database.

    } catch (error: any) {
        throw new Error(
            `[scrapeAndStoreProduct]: Failed to create/update product: ${error.message}.`
        )
    }
}
