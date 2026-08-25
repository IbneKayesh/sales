/**
 * Generate SEO-friendly slug from text
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove non-alphanumeric characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate product slug with ID for uniqueness
 * @param {string} name - Product name
 * @param {string} id - Product ID
 * @returns {string} SEO-friendly slug with ID
 */
export const productSlug = (name, id) => {
  const slug = slugify(name);
  return id ? `${slug}--${id}` : slug;
};

/**
 * Extract product ID from slug
 * @param {string} slug - Product slug
 * @returns {string} Product ID
 */
export const extractProductId = (slug) => {
  if (!slug) return null;
  const parts = slug.split('--');
  return parts.length > 1 ? parts[parts.length - 1] : slug;
};

export default slugify;
