/**
 * The `lib/utils` module provides utilities that help with data processing.
 * The module contains constants and exports functions that process data.
 */

import { PriceHistoryItem, Product } from '@/types';

// #region Constants
const Notification = {
    WELCOME: 'WELCOME',
    CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
    LOWEST_PRICE: 'LOWEST_PRICE',
    THRESHOLD_MET: 'THRESHOLD_MET',
}

const THRESHOLD_PERCENTAGE = 40;
// #endregion Constants

// #region Exported Functions
/**
 * Extracts the price from the given elements array. For each element's price
 * text if exists, a regular expression is used to remove non-digit characters
 * and return the price value, otherwise return an empty string.
 * @param elements The given elements array.
 */
export function extractPrice(...elements: any) {
    for (const element of elements) {
        const priceText = element.text().trim();

        if (priceText) {
            const cleanPrice = priceText.replace(/[^\d.]/g, '');
            let firstPrice;

            if (cleanPrice) {
                firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
            }

            return firstPrice || cleanPrice;
        }
    }

    return '';
}

/**
 * Extracts the currency symbol from a given element. If an element's currency
 * text exists, return a currency symbol, otherwise return an empty string.
 * @param element The given element.
 */
export function extractCurrency(element: any) {
    const currencyText = element.text().trim().slice(0, 1);
    return currencyText ? currencyText : '';
}

/**
 * Extracts the description from the Amazon selectors array using the CheerioAPI
 * selector method.
 * 
 * Use the CheerioAPI primary method to traverse and manipulate elements from
 * the Amazon selectors.
 * @param $ The CheerioAPI selector method.
 */
export function extractDescription($: any) {
    // These are possible elements holding description of the product.
    // Selectors from Amazon.
    const selectors = [
        '.a-unordered-list .a-list-item',
        '.a-expander-content p',
        // Add more selectors here if needed.
    ];

    for (const selector of selectors) {
        const elements = $(selector);

        if (elements.length > 0) {
            const textContent = elements
                .map((_: any, element: any) => $(element).text().trim())
                .get()
                .join('\n');
            return textContent;
        }
    }

    // If no matching elements were found, return an empty string.
    return '';
}

/**
 * Returns the highest price number from the given price list array.
 * @param priceList The given priceList.
 */
export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice.price) {
            highestPrice = priceList[i];
        }
    }

    return highestPrice.price;
}

/**
 * Returns the lowest price number from the given price list array.
 * @param priceList The given priceList.
 */
export function getLowestPrice(priceList: PriceHistoryItem[]) {
    let lowestPrice = priceList[0];

    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price < lowestPrice.price) {
            lowestPrice = priceList[i];
        }
    }

    return lowestPrice.price;
}

/**
 * Returns the avarage price number from the given price list array.
 * @param priceList The given priceList.
 */
export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;

    return averagePrice;
}

/**
 * Returns the email notification type by comparing the given
 * scraped product against the current product.
 * @param scrapedProduct The given scraped product.
 * @param currentProduct The current product.
 */
export const getEmailNotifType = (
    scrapedProduct: Product,
    currentProduct: Product
) => {
    const lowestPrice = getLowestPrice(currentProduct.priceHistory);

    if (scrapedProduct.currentPrice < lowestPrice) {
        return Notification.LOWEST_PRICE as keyof typeof Notification;
    }

    if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
        return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
    }

    if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
        return Notification.THRESHOLD_MET as keyof typeof Notification;
    }

    return null;
};

/**
 * Returns a number formatted string from the given integer num,
 * using the locale string.
 * @param num The given num.
 */
export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};
// #endregion Exported Functions
