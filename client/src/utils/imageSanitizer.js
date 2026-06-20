/**
 * Sanitizes and extracts direct image URLs from common web addresses,
 * such as Google Image Search redirect links.
 * 
 * @param {string} url - The raw URL input from user
 * @returns {string} The direct image URL if extractable, or original trimmed URL
 */
export const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let cleaned = url.trim();

  // If user pasted a Google Search Image redirect link (e.g. copied from Google search results)
  if (cleaned.includes('google.') && (cleaned.includes('imgurl=') || cleaned.includes('imgrefurl='))) {
    try {
      const urlObj = new URL(cleaned);
      const imgUrlParam = urlObj.searchParams.get('imgurl');
      if (imgUrlParam) {
        return decodeURIComponent(imgUrlParam);
      }
    } catch (e) {
      console.error("Failed to parse Google image URL query parameters:", e);
    }
  }

  return cleaned;
};
