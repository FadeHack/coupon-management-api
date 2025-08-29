# Coupon Management System API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/fadehack/workspace/coupon-management/collection/31394686-9b723929-00d8-40ad-9e92-6fb9b9418e42?action=share&creator=31394686)

## Objective

This project is a RESTful API designed to manage and apply various types of discount coupons for an e-commerce platform. It provides a robust and extensible system for creating, validating, and applying coupons to a shopping cart, with a focus on clean code, automated testing, and enterprise-ready practices.

## Features

-   **CRUD Operations:** Full Create, Read, Update, and Delete functionality for coupons.
-   **Multiple Coupon Types:** Built-in support for:
    -   `cart-wise`: Discounts on the entire cart total.
    -   `product-wise`: Discounts on specific products.
    -   `BxGy` (Buy X, Get Y): "Buy X items, Get Y items free" promotions.
-   **Time-Based Validity:** Coupons can have start and end dates, automatically controlling their active period.
-   **Extensible Logic:** A Strategy design pattern allows for the easy addition of new coupon types without modifying existing service logic.
-   **Coupon Applicability:** An endpoint to fetch all valid coupons that can be applied to a given cart.
-   **Coupon Application:** An endpoint to apply a specific coupon and see the final discounted price.
-   **Robust Validation:** Inbound request validation to ensure data integrity.
-   **Centralized Error Handling:** Consistent and predictable error responses.
-   **Automated Testing Suite:** Unit and integration tests using Jest to ensure reliability.

## Technology Stack

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose ODM
-   **Logging:** Winston
-   **HTTP Logging:** Morgan
-   **Validation:** Joi
-   **Environment Variables:** Dotenv
-   **Testing:** Jest, Supertest, MongoDB Memory Server

## Project Structure

The project follows a feature-driven, layered architecture to promote separation of concerns and maintainability.

```
src/
├── config/         # Environment variables, logger, etc.
├── controllers/    # Handles HTTP requests and responses.
├── services/       # Contains the core business logic.
├── routes/         # Defines API endpoints.
├── middleware/     # Custom middleware for validation and error handling.
├── models/         # Mongoose database schemas.
├── utils/          # Shared utility functions (e.g., AppError).
├── strategies/     # Logic for different coupon types.
├── validations/    # Joi schemas for request validation.
├── App.js          # The main Express application setup.
└── index.js        # The application entry point.
tests/
├── integration/    # Integration tests for API routes.
├── unit/           # Unit tests for services, strategies, etc.
└── setup.js        # Test environment setup (in-memory DB).
```

---

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fadehack/coupon-management-api
    cd coupon-management-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file by copying the example file provided:
    ```bash
    cp .env.example .env
    ```
    Then, update the `.env` file with your configuration, such as your MongoDB Atlas connection string.

    ```ini
    # Server port
    PORT=3000

    # MongoDB Atlas Connection URI
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yourDbName

    # Node Environment
    NODE_ENV=development
    ```

## Running the Application & Tests

-   **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:3000`).

-   **Run the automated tests:**
    ```bash
    npm test
    ```
    This will execute all unit and integration tests using Jest and an in-memory MongoDB server.

---

## API Endpoints

All endpoints are prefixed with `/v1`.

### Coupon Management

| Method   | Endpoint        | Description                 | Request Body Example                                                                                  |
| :------- | :-------------- | :-------------------------- | :---------------------------------------------------------------------------------------------------- |
| `POST`   | `/coupons`      | Create a new coupon.        | `{"code": "WINTER24", "type": "cart-wise", "details": {...}, "endDate": "2024-12-31T23:59:59Z"}`       |
| `GET`    | `/coupons`      | Retrieve all coupons.       | (None)                                                                                                |
| `GET`    | `/coupons/{id}` | Retrieve a specific coupon. | (None)                                                                                                |
| `PUT`    | `/coupons/{id}` | Update a coupon.            | `{"description": "A new description"}`                                                                |
| `DELETE` | `/coupons/{id}` | Delete a coupon.            | (None)                                                                                                |

### Coupon Logic

| Method | Endpoint                  | Description                                                  | Request Body Example       |
| :----- | :------------------------ | :----------------------------------------------------------- | :------------------------- |
| `POST` | `/coupons/applicable-coupons` | Fetch all applicable coupons for a given cart.             | `{"cart": {"items": [...]}}` |
| `POST` | `/coupons/apply-coupon/{id}` | Apply a specific coupon and return the updated cart details. | `{"cart": {"items": [...]}}` |

---

## Coupon Use Cases & Scenarios

### Implemented Cases

1.  **Cart-wise Coupon:**
    -   **Scenario:** 10% off on cart totals over $100.
    -   **Implementation:** The `cartWise.strategy.js` calculates the cart total. If it meets or exceeds `details.threshold`, the coupon is applicable. The discount is `details.discountPercentage` of the total.
    -   **Example `details`:** `{ "threshold": 100, "discountPercentage": 10 }`

2.  **Product-wise Coupon:**
    -   **Scenario:** 20% off on specific products (e.g., Product A and Product B).
    -   **Implementation:** The `productWise.strategy.js` checks if any product in the cart has a `product_id` that is in the `details.applicableProductIds` array. The discount is calculated only on those specific items.
    -   **Example `details`:** `{ "applicableProductIds": ["PROD_A", "PROD_B"], "discountPercentage": 20 }`

3.  **BxGy Coupon (Buy X, Get Y):**
    -   **Scenario:** Buy 2 of Product A, Get 1 of Product C for free, with a repetition limit of 3 times.
    -   **Implementation:** The `bxgy.strategy.js` calculates the total quantity of "buy" items and determines how many times the offer can be claimed based on the `repetition_limit`. The discount is the price of the "get" item(s).
    -   **Example `details`:** `{ "buy_products": [{"product_id": "PROD_A", "quantity": 2}], "get_products": [{"product_id": "PROD_C", "quantity": 1}], "repetition_limit": 3 }`

4.  **Time-Based Coupons:**
    -   **Scenario:** A "Flash Sale" coupon that is only valid for the next 48 hours.
    -   **Implementation:** The coupon model includes optional `startDate` and `endDate` fields. The `/applicable-coupons` logic automatically filters for coupons that are currently active. If `endDate` is `null`, the coupon never expires.
    -   **Example Fields:** `"startDate": "2024-10-01T00:00:00Z"`, `"endDate": "2024-10-02T23:59:59Z"`

### Unimplemented Cases (Future Considerations)

-   **Coupon Stacking Rules:** Logic to define if/how multiple coupons can be applied together (e.g., product discount + cart discount).
-   **Usage & Eligibility Constraints:**
    -   **Usage Limit Per User:** A coupon that can only be used once per customer account.
    -   **Total Usage Limit:** A coupon that is valid for the first 1000 uses only.
    -   **First-Time User Coupon:** A discount applicable only on a user's first order.
-   **Advanced BxGy & Deal Variations:**
    -   **Buy from a Collection, Get from another:** Buy 2 items from the "T-Shirts" category, get 1 item from the "Socks" category for free.
    -   **Buy one, get one at 50% off** (BOGO50).
-   **Other Coupon Types:**
    -   **Free Shipping:** A coupon that removes shipping costs, requiring integration with a shipping module.
    -   **Tiered Discounts:** Spend $100 get 10% off, spend $200 get 20% off.

---

## Assumptions

1.  **Product Data:** It is assumed that the cart payload contains accurate `product_id`, `quantity`, and `price`. The API does not validate product existence.
2.  **Currency:** All monetary values are assumed to be in the same, single currency.
3.  **Taxes & Shipping:** Cart totals are calculated pre-tax and pre-shipping.
4.  **Discount Application:** The `/apply-coupon` endpoint returns the total discount amount but does not distribute this discount across individual cart items.

## Limitations & Future Improvements

-   **No Authentication/Authorization:** The API is public. In a real-world application, endpoints should be protected by roles (e.g., admin-only for coupon creation).
-   **No Coupon Stacking Logic:** The API does not have a mechanism to apply multiple coupons together or handle conflicts between them.
-   **Limited BxGy Flexibility:** The BxGy strategy could be enhanced to support buying from a category of products to get a discount on another category.
-   **Expand Test Coverage:** While a testing foundation is in place, coverage should be expanded to include more edge cases for each strategy, performance tests, and security-related tests.