import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import axios from 'axios';
import { AuthProvider } from '../Functions/AuthContext';
import '@testing-library/jest-dom';
import StockPage from '../StockDetails/StockDetail'
import getTrendingStocksMock from "../Functions/getTrendingStocks";
import getStockPriceMock from "../Functions/getStockPrice";
import getMarketNewsMock from '../Functions/getMarketNews';

const mockedGetTrendingStocks = getTrendingStocksMock as jest.Mock;
const mockedGetStockPrice = getStockPriceMock as jest.Mock;
const mockedGetMarketNews = getMarketNewsMock as jest.Mock;


jest.mock('axios'); // mocks axios functions to test with edge cases without backend

jest.mock("../Functions/AuthContext", () => {
  const actual = jest.requireActual("../Functions/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      user: {
        id: 1,
        username: "TestUser",
        investedAmount: 0,
        currentValue: 0,
        profitLoss: 0,
        portfolio: undefined
      }
    })
  };
});

jest.mock("focus-trap-react", () => {
  return ({ children }: any) => <div>{children}</div>;
});

jest.mock("../Functions/getMarketNews", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../Functions/getTrendingStocks", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("../Functions/getStockPrice", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('Home - GetStockTrendingList edge cases', () => {

    test('handles empty response', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {}});

        mockedGetTrendingStocks.mockResolvedValueOnce([]);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('No Stocks Current Trending')).toBeInTheDocument();
        })
    })

    test('handles normal response', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetStockPrice.mockResolvedValue(123);

        render(
            <MemoryRouter initialEntries={['/']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<StockPage />} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            const appleStocks = screen.getAllByText('Apple Inc.');
            expect(appleStocks.length).toBe(2);
            const msStocks = screen.getAllByText('Microsoft Corp.');
            expect(msStocks.length).toBe(2);
        })

        fireEvent.click(screen.getAllByText("Apple Inc.")[0]);

        await waitFor(() => {
            expect(screen.getByText('Buy Stock')).toBeInTheDocument();
        })
    })

    test("handles broken response", async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Bad Stock": { symbol: null, logo: null },
            "Another Bad": { symbol: "", logo: "" },
        }})

        mockedGetTrendingStocks.mockResolvedValueOnce(["Bad Stock", "Another Bad"]);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            const ErrorStock = screen.getAllByText("Error - No Stock Found")
            expect(ErrorStock.length).toBe(4)
        })
    })
    
    test("handles partially broken response", async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Bad Stock": { symbol: null, logo: null },
        }})

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "Bad Stock"]);
        mockedGetStockPrice.mockResolvedValue(123);

        render(
            <MemoryRouter initialEntries={['/']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stock/:symbol" element={<StockPage />} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            const appleStocks = screen.getAllByText('Apple Inc.');
            expect(appleStocks.length).toBe(2);
            const ErrorStock = screen.getAllByText("Error - No Stock Found")
            expect(ErrorStock.length).toBe(2)

        })

        fireEvent.click(screen.getAllByText("Error - No Stock Found")[0]);

        await waitFor(() => {
            const ErrorStock = screen.getAllByText("Error - No Stock Found")
            expect(ErrorStock.length).toBe(2)
        })

        fireEvent.click(screen.getAllByText("Apple Inc.")[0]);

        await waitFor(() => {
            expect(screen.getByText('Buy Stock')).toBeInTheDocument();
        })
    })

    test("handles Loading state", async () => {

        (axios.get as jest.Mock).mockReturnValue(
            new Promise(() => {})
        );

        mockedGetTrendingStocks.mockImplementation(
            () => new Promise(() => {})
        );

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        })

    })

})

describe("Home - getMarketNews edge cases", () => {
    
    test("handles empty response", async () => {

        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);

        mockedGetMarketNews.mockResolvedValueOnce([])

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('No News Found')).toBeInTheDocument()
        })
    })

    test("handles correct", async () => {

        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetMarketNews.mockResolvedValueOnce([{ category: "top news", datetime: 1770159420, headline: "TestHeadline1", id: 7573789, image: "ABC", related: "", source: "MarketWatch", summary: "Summary1", url: "https://aashiqdina.github.io/trading-sim/" }, { category: "top news", datetime: 1770159420, headline: "TestHeadline2", id: 7573789, image: "123", related: "", source: "MarketWatch", summary: "Summary2", url: "https://aashiqdina.github.io/ReactCvSiteProject/" }])
    
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(async () => {
            const headline1 = await screen.findByText("TestHeadline1");
            const headline2 = await screen.findByText("TestHeadline2");

            expect(headline1).toBeInTheDocument();
            expect(headline2).toBeInTheDocument();
            expect(screen.queryByText("Summary1")).toBeInTheDocument()
            expect(screen.queryByText("Summary2")).toBeInTheDocument()
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', 'https://aashiqdina.github.io/trading-sim/');
            expect(links[1]).toHaveAttribute('href', 'https://aashiqdina.github.io/ReactCvSiteProject/');

            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('src', 'ABC');
            expect(images[1]).toHaveAttribute('src', '123');
        })
    })

    test("handles broken response", async () => {
        
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetMarketNews.mockResolvedValueOnce([{ category: null, datetime: null, headline: null, id: null, image: null, related: null, source: null, summary: null, url: null }, { category: null, datetime: null, headline: null, id: null, image: null, related: null, source: null, summary: null, url: null }])
    
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor( () => {
            const headline1 = screen.getAllByText("brokenHeadline")[0];
            const headline2 = screen.getAllByText("brokenHeadline")[1];

            expect(headline1).toBeInTheDocument();
            expect(headline2).toBeInTheDocument();
            const summaries = screen.getAllByText("brokenSummary");
            expect(summaries.length).toBe(2);
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', 'brokenURL');
            expect(links[1]).toHaveAttribute('href', 'brokenURL');

            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('src', 'brokenSource');
            expect(images[1]).toHaveAttribute('src', 'brokenSource');
        })
    })

    test("handles partially broken response", async () => {
                
        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);
        mockedGetMarketNews.mockResolvedValueOnce([{ category: "top news", datetime: 1770159420, headline: "TestHeadline1", id: 7573789, image: "ABC", related: "", source: "MarketWatch", summary: "Summary1", url: "https://aashiqdina.github.io/trading-sim/" }, { category: null, datetime: null, headline: null, id: null, image: null, related: null, source: null, summary: null, url: null }])
    
        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor( () => {
            const headline1 = screen.getAllByText("TestHeadline1")[0];
            const headline2 = screen.getAllByText("brokenHeadline")[0];

            expect(headline1).toBeInTheDocument();
            expect(headline2).toBeInTheDocument();
            const summaries = screen.getAllByText("brokenSummary");
            expect(screen.queryByText("Summary1")).toBeInTheDocument()
            expect(summaries.length).toBe(1);
            const links = screen.getAllByRole('link');
            expect(links[0]).toHaveAttribute('href', 'https://aashiqdina.github.io/trading-sim/');
            expect(links[1]).toHaveAttribute('href', 'brokenURL');

            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('src', 'ABC');
            expect(images[1]).toHaveAttribute('src', 'brokenSource');
        })
    })

    test("handles Loading", async () => {

        (axios.get as jest.Mock).mockResolvedValueOnce({data: {
            "Apple Inc.": { symbol: "AAPL", logo: "logo" },
            "Microsoft Corp.": { symbol: "MSFT", logo: "logo" },
        }});

        mockedGetTrendingStocks.mockResolvedValueOnce( ["AAPL", "MSFT"]);

        mockedGetMarketNews.mockImplementation(
            () => new Promise(() => {})
        )

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Home/>
                </AuthProvider>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        })
    })
    
})







//if multiple axios calls are in the code

// (axios.get as jest.Mock).mockImplementation((url) => {
//     if(url === 'https://tradingsim-backend.onrender.com/api/stocks/GetStockList'){

//     }
//     // else if(url === 'In case of multiple axios calls the url can be specified'){

//     // }
//     return Promise.reject(new Error(`URL doesnt matches any cases above: ${url}`))
// })