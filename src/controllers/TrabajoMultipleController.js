const service = require('../services/TrabajoMultipleService');
const procesarTrabajoMultiple = (req, res) => {
    const data = req.body;
    service.procesarTrabajoMultiple(data, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        return res.json(result);
    });
}   

module.exports = { 
    procesarTrabajoMultiple
}
