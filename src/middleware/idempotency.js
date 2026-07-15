// middleware/idempotency.js
const { doQueryV2 } = require('../database/helpers/queriesHelper');
//const db = require('../db'); // Your MySQL connection reference

async function idempotencyCheck(req, res, next) {
    // 1. Only enforce on data-mutating requests
    if (['POST', 'PUT', 'PATCH'].indexOf(req.method) === -1) {
        return next();
    }

    // 2. Extract the key from custom headers
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        //return res.status(400).json({ error: "Missing required Idempotency-Key header." });
        console.log("No idempotency key provided....")
        //for now, lets just continue...
        return next();
    }

    try {
        // 3. Query your MySQL 'idempotency_keys' lookup table
        const [rows] = await doQueryV2(
            'SELECT response_status, response_body FROM idempotency_keys WHERE id_key = ?', 
            [idempotencyKey]
        );

        if (rows.length > 0) {
            // Key found! Send the exact previous response back to the client immediately
            console.log("###########[Idempotency key found]#############");
            console.log("--> returning previous response back...")
            const cached = rows[0];
            console.log(JSON.parse(cached.response_body));
            return res.status(cached.response_status).json(JSON.parse(cached.response_body));
        }

        // 4. Key is new. Insert it into the database to lock it against simultaneous requests
        await doQueryV2('INSERT INTO idempotency_keys (id_key, status) VALUES (?, ?)', [idempotencyKey, 'started']);

        // 5. Intercept res.send to automatically save the final output before sending it to the client
        const originalSend = res.send;
        res.send = function (body) {
            // Save the final response data back into MySQL for subsequent requests
            doQueryV2(
                'UPDATE idempotency_keys SET status = ?, response_status = ?, response_body = ? WHERE id_key = ?',
                ['completed', res.statusCode, body, idempotencyKey]
            )

            // Execute original Express send method
            return originalSend.apply(res, arguments);
        };

        next();
    } catch (error) {
        console.error("Idempotency system error:", error);
        return res.status(500).json({ error: "Internal server validation failure." });
    }
}

module.exports = idempotencyCheck;
