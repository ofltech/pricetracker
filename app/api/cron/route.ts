import { NextResponse } from 'next/server';

import { 
    getAveragePrice, 
    getHighestPrice, 
    getLowestPrice, 
    getEmailNotifType 
} from '@/lib/utils';
import { connectToDB } from '@/lib/mongoose';
import Product from '@/lib/models/product.model';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { generateEmailBody, sendEmail } from '@/lib/nodemailer';

/**
 * The {@link GET} request `asynchronous function` is a CRON JOB API route
 * that runs periodically.
 */
export async function GET() {
    try {
        connectToDB();

        const products = await Product.find({});

        if (!products) {
            throw new Error("GET: No products found.");
        }

        // 1. SCRAPE LATEST PRODUCT DETAILS & UPDATE DB.
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

                if (!scrapedProduct) {
                    throw new Error("GET: No product found.");
                }

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    { price: scrapedProduct.currentPrice }
                ]
    
                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                }
    
                const updatedProduct = await Product.findOneAndUpdate(
                    { url: scrapedProduct.url },
                    product,
                );

                // 2. CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY.
                const emailNotifType = getEmailNotifType(
                    scrapedProduct,
                    currentProduct
                );

                if (emailNotifType && updatedProduct.length > 0) {
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url,
                    }

                    const emailContent = await generateEmailBody(productInfo, emailNotifType);

                    const userEmails = updatedProduct.users.map((user: any) => user.email);

                    await sendEmail(emailContent, userEmails);
                }

                return updatedProduct
            })
        )

        return NextResponse.json({
            message: 'Ok', 
            data: updatedProducts
        })
    } catch (error) {
        throw new Error(`Error in GET: ${error}`);
    }
}
