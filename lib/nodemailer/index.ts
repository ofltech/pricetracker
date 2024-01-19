'use server'

import { EmailContent, EmailProductInfo, NotificationType } from '@/types';
import nodemailer from 'nodemailer';

/**
 * The {@link Notification} `constant variable` holds the notification types
 * for emails that can be sent.
 * 
 * Properties available:
 * @property WELCOME: string
 * @property CHANGE_OF_STOCK: string
 * @property LOWEST_PRICE: string
 * @property THRESHOLD_MET: string
 */
const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
}

/**
 * The generateEmailBody function
 */
export async function generateEmailBody(
    product: EmailProductInfo,
    type: NotificationType
) {
    /**
     * The {@link THRESHOLD_PERCENTAGE} `constant variable` holds the 
     * percentage threshold value.
     */
    const THRESHOLD_PERCENTAGE = 40;

    // Shorten the product title
    const shortenedTitle = product.title.length > 20
        ? `${product.title.substring(0, 20)}...`
        : product.title;

    let subject = '';
    let body = '';

    switch (type) {
        // Notification type: WELCOME.
        case Notification.WELCOME:
            subject = `Welcome to Price Tracking for ${shortenedTitle}`;
            body = `
                <div>
                    <h2>Welcome to PriceTracker 🚀</h2>
                    <p>You are now tracking ${product.title}.</p>
                    <p>Here's an example of how you'll receive updates:</p>
                    <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
                        <h3>${product.title} is back in stock!</h3>
                        <p>We're excited to let you know that ${product.title} is now back in stock.</p>
                        <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
                        <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
                    </div>
                    <p>Stay tuned for more updates on ${product.title} and other products you're tracking.</p>
                </div>
                `;
            break;

        // Notification type: CHANGE_OF_STOCK.
        case Notification.CHANGE_OF_STOCK:
            subject = `${shortenedTitle} is now back in stock!`;
            body = `
                <div>
                    <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
                    <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
                </div>
                `;
            break;

        // Notification type: LOWEST_PRICE.
        case Notification.LOWEST_PRICE:
            subject = `Lowest Price Alert for ${shortenedTitle}`;
            body = `
                <div>
                    <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
                    <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
                </div>
                `;
            break;

        // Notification type: LOWEST_PRICE.
        case Notification.THRESHOLD_MET:
            subject = `Discount Alert for ${shortenedTitle}`;
            body = `
                <div>
                    <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
                    <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
                </div>
                `;
            break;

        // Default case: Throw invalid notification type.
        default:
            throw new Error("Invalid notification type.");
    }

    return { subject, body };
}

const transporter = nodemailer.createTransport({
    pool: true,
    service: 'hotmail',
    port: 2525,
    auth: {
        user: 'oflenake@outlook.com',
        pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 1
})

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
    const mailOptions = {
        from: 'oflenake@outlook.com',
        to: sendTo,
        html: emailContent.body,
        subject: emailContent.subject,
    }

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return console.log(error);
        }

        console.log('Email sent: ', info);
    })
}
