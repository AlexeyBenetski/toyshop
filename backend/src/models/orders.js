const pool = require("../db/pool");

module.exports = {
    async createOrder(userId, items) {
        let total = 0;
        items.forEach(i => total += i.price * i.quantity);

        const order = await pool.query(
            "INSERT INTO orders (user_id, total_price, status) VALUES ($1,$2,'pending') RETURNING *;",
            [userId, total]
        );

        for (const item of items) {
            await pool.query(
                `INSERT INTO order_items (order_id, product_id, price, quantity)
                 VALUES ($1,$2,$3,$4);`,
                [order.rows[0].id, item.product_id, item.price, item.quantity]
            );
        }

        return order.rows[0];
    },

    async getUserOrders(userId) {
        const result = await pool.query(
            `SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC;`,
            [userId]
        );
        return result.rows;
    }
};
