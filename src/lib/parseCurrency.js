export const getCurrencySymbol = (currencyCode) => {
    const currencySymbols = {
        'AUD': 'A$',
        'CNY': '¥',
        'HKD': 'HK$',
        'IDR': 'Rp',
        'INR': '₹',
        'JPY': '¥',
        'KRW': '₩',
        'KZT': '₸',
        'MYR': 'RM',
        'RUB': '₽',
        'SGD': 'S$',
        'THB': '฿',
        'TWD': 'NT$',
        'USD': '$',
        'VND': '₫'
    };
    return currencySymbols[currencyCode] 
}