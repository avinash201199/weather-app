// Input sanitization utilities
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>\"'&]/g, (match) => {
      const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return map[match];
    })
    .trim()
    .slice(0, 100); // Limit length
};

export const validateCityName = (city) => {
  const cityRegex = /^[a-zA-Z\s\-']{1,50}$/;
  return cityRegex.test(city);
};

export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};