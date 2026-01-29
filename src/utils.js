export const slugify = (text) => {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
};

export const formatPrice = (price, type = 'bikes') => {
    // Normalize price: handle arrays (common in DB samples) or strings
    const val = Array.isArray(price) ? price[0] : price;
    const num = parseFloat(val);

    if (isNaN(num)) return type === 'bikes' ? 'USD $0.00' : 'RD$ 0.00';

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    if (type === 'bikes') {
        return `USD $${formatter.format(num)}`;
    } else {
        return `RD$ ${formatter.format(num)}`;
    }
};
