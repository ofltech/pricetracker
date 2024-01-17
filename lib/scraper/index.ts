'use server'

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

/**
 * Scrape Amazon Product.
 * 
 * This asynchronous function scrapes an Amazon product.
 * @param url The Amazon product URL string.
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
        // Fetch the product page using axios.
        const response = await axios.get(url, options);

        // Initialize cheerio.
        const $ = cheerio.load(response.data);

        // Extract product information using cheerio.
        const title = $('#productTitle').text().trim();

        // Extract discounted price utility function to get product information.
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
        );

        // Extract original price utility function to get product information.
        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );

        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const images =
            $('#imgBlkFront').attr('data-a-dynamic-image') ||
            $('#landingImage').attr('data-a-dynamic-image') ||
            '{}'

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

        const description = extractDescription($);

        // Construct data object with scraped information.
        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        }

        return data;
    } catch (error: any) {
        // throw new Error(
        //     `[scrapeAmazonProduct]: Failed to scrape product: ${error.message}.`
        // )
        console.log(error);
    }
}
