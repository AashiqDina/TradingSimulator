export interface FiftyTwoWeek {
    low: number;
    high: number;
    lowChange: number;  
    highChange: number; 
    lowChangePercent: number;  
    highChangePercent: number; 
    range: string;
  }
  
  export interface StockApiInfo {
    quoteData: any;
    symbol: string;
    name: string;
    exchange: string;
    micCode: string | null;
    currency: string;
    datetime: string;
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    previousClose: number;
    change: number;
    percentChange: number;  
    averageVolume: number;
    rolling1DChange: number;
    rolling7DChange: number;
    rollingPeriodChange: number;
    isMarketOpen: boolean;
    fiftyTwoWeek: FiftyTwoWeek;  
    extendedChange: number;
    extendedPercentChange: number;
    extendedPrice: number;
    extendedTimestamp: number;
  }
  
  export interface CompanyProfile {
    symbol: string;
    name: string;
    exchange: string;
    micCode: string;
    sector: string;
    industry: string;
    employees: number;
    website: string;
    description: string;
    type: string;
    ceo: string;
    address: string;
    address2: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    phone: string;
  }
  