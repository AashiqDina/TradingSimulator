# Trading Simulator – Frontend (Old Version)



**Note:** This is the **older version** of the Trading Simulator project.  
For the latest frontend with full React, TypeScript, and deployed version, visit:  
- **Live Demo:** [https://aashiqdina.github.io/trading-sim/](https://aashiqdina.github.io/trading-sim/)  
- **Frontend GitHub Repo:** [https://github.com/AashiqDina/trading-sim](https://github.com/AashiqDina/trading-sim)
- **Backend GitHub Repo:** private

---

## Features

* Trending stocks dashboard
* Portfolio management with profit/loss tracking
* Stock details view
* Uses SQLite for backend storage
* API integration for live stock and news data

---

## Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* .NET SDK (6.0+ recommended)
* SQLite

### Installation & Running the App

#### 1. Start the Frontend

Navigate to the frontend folder and start the React app:

```bash
cd trading-simulator-frontend
npm install
npm start
```

#### 2. Start the Backend

Navigate to the backend folder and run the API:

```bash
cd trading-simulator-backend
dotnet run
```

By default, the frontend will try to communicate with the backend API running on its default port.

---

## API Keys Setup

To fetch live data, you need to provide API keys for the external services.

1. **TwelveData API Key**

   * Open `StockService` in the backend project
   * Place your TwelveData API key where indicated

2. **FinnHub API Key**

   * Open `NewsService` in the backend project
   * Place your FinnHub API key where indicated

Without these keys, the app will only work with mock or cached data.

---

##  Notes

* This version uses **SQLite** instead of a full database server.
* Due to legacy code, some aspects may be broken or may not work if the frontend and backend are not fully connected.
