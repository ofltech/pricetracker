'use client'

import { FormEvent, useState } from 'react'

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    // Check if hostname contains amazon.com or domain and country code.
    if (
      hostname.includes('amazon.com') || 
      hostname.includes ('amazon.') || 
      hostname.endsWith('amazon')
    ) {
      // Valid link.
      return true;
    }
  } catch (error) {
    // Invalid link.
    return false;
  }

  // Invalid link.
  return false;
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevent the web app to not reload after a form submit.
    event.preventDefault();

    // Check if the entered URL is valid.
    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if(!isValidLink) return alert('Please provide a valid Amazon link')

    // Turn on loading.
    try {
      setIsLoading(true);

      // Scrape the product page.
      // const product = await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="flex flex-wrap gap-4 mt-12"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        value={searchPrompt}
        onChange={(evt) => setSearchPrompt(evt.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar
