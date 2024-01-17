'use server'

import { revalidatePath } from 'next/cache';
import Product from '../models/product.model';
import { connectToDB } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';
import { getAveragePrice, getHighestPrice, getLowestPrice } from '../utils';

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
        connectToDB();

        const scrapedProduct = await scrapeAmazonProduct(productUrl);

        if (!scrapedProduct) {
            return;
        }

        // Store a scraped product to the database.
        let product = scrapedProduct;

        const existingProduct = await Product.findOne({ url: scrapedProduct.url });

        if (existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/products/${newProduct._id}`);

    } catch (error: any) {
        throw new Error(
            `[scrapeAndStoreProduct]: Failed to create/update product: ${error.message}.`
        )
    }
}

export async function getProductById(productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return null;
        }

        return product;
    } catch (error) {
        console.log(error);
    }
}
