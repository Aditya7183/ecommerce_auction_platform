# Ecommerce Auction Platform

An ecommerce application where users can sell products through an auction system. Sellers set a base price and a deadline, and the highest bidder by the deadline wins the product.

## Features

- **User Authentication**: Register, Login, Profile Management.
- **Product Management**: Create listings, upload images, set base price and deadlines.
- **Auction System**:
    - **Bidding**: Users can place bids on products.
    - **Stop Auction**: Sellers can manually stop an auction before the deadline.
    - **My Bids**: specific dashboard for users to track their bids.
    - **Won/Sold Items**: dedicated sections for won and sold products.
- **Swagger API Documentation**: Fully documented API endpoints.

## Tech Stack

### Client
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)

### Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite / PostgreSQL (configured via `config/database`)
- **Documentation**: Swagger UI (`swagger-ui-express`, `swagger-jsdoc`)
- **File Uploads**: Multer
- **Authentication**: JWT & Bcrypt

## detailed API Documentation

The API Documentation is available via Swagger UI.

1.  Start the backend server.
2.  Navigate to `http://localhost:3000/api-docs`.

## Getting Started

### Prerequisites

- Node.js installed
- Git installed

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Aditya7183/ecommerce_auction_platform.git
    cd ecommerce_auction_platform
    ```

2.  **Backend Setup**
    ```bash
    cd selling_in_auction
    npm install
    # Set up environment variables in .env (see .env.example)
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## Scripts

### Server `selling_in_auction/`
- `npm start`: Runs the server.
- `npm run migrate`: Runs database migrations.

### Client `client/`
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the frontend for production.

## Project Structure

- `client/`: React frontend application.
- `selling_in_auction/`: Node.js/Express backend application.
- `selling_in_auction/config/`: Database configuration.
- `selling_in_auction/controllers/`: Application logic.
- `selling_in_auction/routes/`: API route definitions.
- `selling_in_auction/utils/swagger.js`: Swagger configuration.
