export interface Currency {
    symbol: string;
    code: string;
    name: string;
}

export const CURRENCIES: Currency[] = [
    { symbol: "$", code: "USD", name: "US Dollar" },
    { symbol: "€", code: "EUR", name: "Euro" },
    { symbol: "£", code: "GBP", name: "British Pound" },
    { symbol: "¥", code: "JPY", name: "Japanese Yen" },
    { symbol: "¥", code: "CNY", name: "Chinese Yuan" },
    { symbol: "₹", code: "INR", name: "Indian Rupee" },
    { symbol: "₩", code: "KRW", name: "South Korean Won" },
    { symbol: "₣", code: "CHF", name: "Swiss Franc" },
    { symbol: "C$", code: "CAD", name: "Canadian Dollar" },
    { symbol: "A$", code: "AUD", name: "Australian Dollar" },
    { symbol: "R$", code: "BRL", name: "Brazilian Real" },
    { symbol: "₽", code: "RUB", name: "Russian Ruble" },
    { symbol: "kr", code: "SEK", name: "Swedish Krona" },
    { symbol: "kr", code: "NOK", name: "Norwegian Krone" },
    { symbol: "kr", code: "DKK", name: "Danish Krone" },
    { symbol: "zł", code: "PLN", name: "Polish Złoty" },
    { symbol: "Kč", code: "CZK", name: "Czech Koruna" },
    { symbol: "Ft", code: "HUF", name: "Hungarian Forint" },
    { symbol: "₺", code: "TRY", name: "Turkish Lira" },
    { symbol: "﷼", code: "SAR", name: "Saudi Riyal" },
    { symbol: "د.إ", code: "AED", name: "UAE Dirham" },
    { symbol: "₪", code: "ILS", name: "Israeli Shekel" },
    { symbol: "฿", code: "THB", name: "Thai Baht" },
    { symbol: "₫", code: "VND", name: "Vietnamese Dong" },
    { symbol: "Rp", code: "IDR", name: "Indonesian Rupiah" },
    { symbol: "RM", code: "MYR", name: "Malaysian Ringgit" },
    { symbol: "₦", code: "NGN", name: "Nigerian Naira" },
    { symbol: "R", code: "ZAR", name: "South African Rand" },
    { symbol: "MX$", code: "MXN", name: "Mexican Peso" },
    { symbol: "S$", code: "SGD", name: "Singapore Dollar" },
    { symbol: "HK$", code: "HKD", name: "Hong Kong Dollar" },
    { symbol: "NZ$", code: "NZD", name: "New Zealand Dollar" },
];