const { doQuery } = require("./helpers/queriesHelper");

const register = (data, callback) => {
  /*
        For this, the operation has to be at least pending.
        
        A row is registered for the operation, indicating the modification event.

        Steps to be performed:

            Sum items prices
            Substract discount 
            Substract registered payment

        What happens if the value is less than the ammount already paid?

        A negative payment is loaded when a refund is made

        in case that a item (ventahasstock) is not used, the field 'used' in the row is set
        to 0
    */

  //first, get venta items
  const query_vi = `select * from venta_has_stock vhs where vhs.idventa  = ${data.idventa} ;`;
  //get payments...
  const query_c = `select * from cobro c where c.venta_idventa = ${data.idventa};`;

  const process = (items, pagos) => {
    /**
     * calculate new balance... if the balance is negative (refund) the new register of payment
     * is already registered in the db.
     */

    let total_items = 0;
    let total_collection = 0;
    let discount = 0;

    //TO DO

    const balance = total_items - discount - total_collection;

    if (balance < 0) {
      const insert_payment_query = `insert into cobro (...) values (...)`;
      connection.query(insert_payment_query, (err, resp) => {});
    }
  };

  connection.query(query_c, (err, resp1) => {
    connection.query(query_vi, (err, resp2) => {
      process(resp2, resp1);
      connection.end();
    });
  });
};

const getUpdatedValues = (data, callback) => {
  /*
    Receives  a new item with its price, a item to be removed (or not), calculates new
    price for the sale, and returns it to the client
    */
};

const obtenerConsumoSubgrupoMes = (
  { idsucursal, idsubgrupo, mes, anio },
  callback
) => {
  const query = `SELECT 
c.subgrupo_idsubgrupo, 
c.idcodigo, 
c.codigo, 
c.stock_ideal,
c.stock_critico,
if(con.fk_codigo IS NULL, 0 , con.qtty) AS 'cantidad',
CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'ESF[\+\-\.0-9]+'), 'ESF', '') AS DECIMAL(10,2)) AS 'esf_dec' ,
CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'CIL[\+\-\.0-9]+'), 'CIL', '') AS DECIMAL(10,2)) AS 'cil_dec' ,
REPLACE(  REGEXP_SUBSTR(c.codigo, 'ESF[\+\-\.0-9]+'), 'ESF', '')  AS 'esf',  
REPLACE(  REGEXP_SUBSTR(c.codigo, 'CIL[\+\-\.0-9]+'), 'CIL', '')  AS 'cil'
FROM 
codigo c LEFT JOIN 
(SELECT sa.fk_codigo, SUM(1) AS 'qtty' 
FROM sobre_adicionales sa 
WHERE MONTH(sa.fecha_alta)=${mes} AND YEAR(sa.fecha_alta)=${anio} GROUP BY sa.fk_codigo) con
ON con.fk_codigo = c.idcodigo
WHERE c.subgrupo_idsubgrupo = ${idsubgrupo};`;



  doQuery(query, (resp) => {
    
    callback(resp.data);
  });
};

module.exports = { register, getUpdatedValues, obtenerConsumoSubgrupoMes };
