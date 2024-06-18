const register = (data, callback)=> {
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
        const query_vi = `select * from venta_has_stock vhs where vhs.idventa  = ${data.idventa} ;`
        //get payments...
        const query_c = `select * from cobro c where c.venta_idventa = ${data.idventa};`


        const process = (items, pagos) =>{
            /**
             * calculate new balance... if the balance is negative (refund) the new register of payment 
             * is already registered in the db.
             */

            let total_items = 0;
            let total_collection = 0;
            let discount = 0;

            //TO DO
            
            const balance = total_items - discount - total_collection;
            
            if(balance<0)
            {
                const insert_payment_query = `insert into cobro (...) values (...)`
                connection.query(insert_payment_query,(err,resp)=>{
                    
                })

            }
        }


        connection.query(query_c,(err,resp1)=>{
            connection.query(query_vi,(err,resp2)=>{
                process(resp2,resp1)
                connection.end()
            })
        })

        






}

const getUpdatedValues = (data, callback) => {
    /*
    Receives  a new item with its price, a item to be removed (or not), calculates new
    price for the sale, and returns it to the client
    */
}

module.exports = {register, getUpdatedValues}