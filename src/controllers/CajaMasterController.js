const service = require('../services/CajaMasterService');
const getBalance = (req,res) => {
    const { idsucursal } = req.params;
    service.getBalance(idsucursal, (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        res.json(results);
    });
};
