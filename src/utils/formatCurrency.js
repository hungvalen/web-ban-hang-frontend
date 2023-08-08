// Create our number formatter.
export const formatPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'vnd',
});
