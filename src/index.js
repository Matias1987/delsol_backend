const config = require("./lib/global");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')
//const session = require("express-session");
//const cookieParser = require("cookie-parser");
///const session = require('express-session');

const app = express();
const port = process.env.port || config.server_port;//release
//const port = process.env.port || 3002;//for testing

app.use(cors(/*{origin: ['http://54.174.39.15:3000','http://77.37.68.128:3000/','http://localhost:3000']}*/));//RELEASE
//app.use(bodyParser.json());
//FROM https://stackoverflow.com/questions/24543847/req-body-empty-on-posts
app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use('/static',express.static('uploads'));

//app.use(express.urlencoded({ extended: true }));  


//const oneDay = 1000 * 60 * 60 * 24;
/*app.use(session({
  secret: 'keyboard_cat',
  resave: false,
  saveUninitialized: true,
  logedIn: false,
  cookie: { secure: true,  maxAge: oneDay }
}))*/
app.use(express.json());
//app.use(cookieParser());
/*
routes 
*/

/*
ALSO FROM: https://stackoverflow.com/questions/31875621/how-to-properly-return-a-result-from-mysql-with-node
*/


const cajaRouter = require("./v1/routes/CajaRoutes");
app.use("/api/v1/caja",cajaRouter);

const familiaRouter = require("./v1/routes/FamiliaRoutes");
app.use("/api/v1/familia",familiaRouter);


const clienteRouter = require("./v1/routes/ClienteRoutes");
app.use("/api/v1/clientes", clienteRouter);

const ventasRouter =  require("./v1/routes/VentaRoutes");
app.use("/api/v1/ventas", ventasRouter);

const cobroRouter = require("./v1/routes/CobroRoutes");
app.use("/api/v1/cobros",cobroRouter);


const subFamiliaRouter = require("./v1/routes/SubFamiliaRoutes");
app.use("/api/v1/subfamilia",subFamiliaRouter)

const grupoRouter = require("./v1/routes/GrupoRoutes");
app.use("/api/v1/grupos",grupoRouter)

const codigosRoutes = require("./v1/routes/CodigoRoutes");
app.use("/api/v1/codigos", codigosRoutes);

const subGruposRoutes = require("./v1/routes/SubGrupoRoutes");
app.use("/api/v1/subgrupos", subGruposRoutes);
 
const stockRoutes = require("./v1/routes/StockRoutes");
app.use("/api/v1/stock", stockRoutes);

const sucursalesRoutes = require("./v1/routes/SucursalRoutes");
app.use("/api/v1/sucursales", sucursalesRoutes);

const usuariosRoutes = require("./v1/routes/UsuarioRoutes");
app.use("/api/v1/usuarios", usuariosRoutes);

const bancoRoutes = require("./v1/routes/BancoRoutes");
app.use("/api/v1/bancos", bancoRoutes);

const medicosRoutes = require("./v1/routes/MedicoRoutes");
app.use("/api/v1/medicos", medicosRoutes);

const mutualRoutes = require("./v1/routes/MutualRoutes");
app.use("/api/v1/mutuales", mutualRoutes);

const conceptoGastoRoutes = require("./v1/routes/ConceptoGastoRoutes");
app.use("/api/v1/conceptogastos",conceptoGastoRoutes);

const cargaManualRoutes = require("./v1/routes/CargaManualRoutes");
app.use("/api/v1/cargamanual",cargaManualRoutes);

const tarjetaRoutes = require("./v1/routes/TarjetaRoutes");
app.use("/api/v1/tarjetas",tarjetaRoutes);

const facturaRoutes = require("./v1/routes/FacturaRoutes");
app.use("/api/v1/facturas",facturaRoutes);

const proveedorRoutes = require("./v1/routes/ProveedorRoutes");
app.use("/api/v1/proveedores",proveedorRoutes);

const envioRoutes = require("./v1/routes/EnvioRoutes");
app.use("/api/v1/envio",envioRoutes);

const envioStockRoutes = require("./v1/routes/EnvioHasStockRoutes");
app.use("/api/v1/enviostock",envioStockRoutes);


const bajaDesperfectoRoutes = require("./v1/routes/BajaDesperfectoRoutes");
app.use("/api/v1/bajadesperfecto",bajaDesperfectoRoutes);

const gastosRoutes = require("./v1/routes/GastoRoutes");
app.use("/api/v1/gastos",gastosRoutes);

const transferenciaRoutes = require("./v1/routes/TransferenciaRoutes");
app.use("/api/v1/transferencias",transferenciaRoutes);

const adminRoutes = require("./v1/routes/AdminRoutes");
app.use("/api/v1/admin",adminRoutes);

const mensajeRoutes = require("./v1/routes/MensajeRoutes");
app.use("/api/v1/mensajes",mensajeRoutes)

const pagareRoutes = require("./v1/routes/PagareRoutes");
app.use("/api/v1/pagares",pagareRoutes)

const intcuotaRoutes = require("./v1/routes/InteresCuotaRoutes");
app.use("/api/v1/ic",intcuotaRoutes)

const localidadRoutes = require("./v1/routes/LocalidadRoutes");
app.use("/api/v1/localidad",localidadRoutes)

const llamadaRoutes = require("./v1/routes/LlamadaClienteRoutes")
app.use("/api/v1/llamadas",llamadaRoutes)

const eventoRoutes = require("./v1/routes/EventoRoutes")
app.use("/api/v1/evt",eventoRoutes)

const adicRoutes = require("./v1/routes/ItemAdicionalesRoutes")
app.use("/api/v1/adic",adicRoutes)

const ctrlStock = require("./v1/routes/ControlStockRoutes")
app.use("/api/v1/cs",ctrlStock)

const taller = require("./v1/routes/VentaTallerRoutes")
app.use("/api/v1/tl",taller)

const anotacionRoutes = require("./v1/routes/AnotacionRoutes")
app.use("/api/v1/anot",anotacionRoutes)

const tagRoutes = require("./v1/routes/TagRoutes")
app.use("/api/v1/tag",tagRoutes)

const opticaRoutes = require("./v1/routes/OpticaRoutes")
app.use("/api/v1/op",opticaRoutes)

const tareaRoutes = require("./v1/routes/TareaRoutes")
app.use("/api/v1/t",tareaRoutes)

const cambioRoutes = require("./v1/routes/CambioVentaRoutes")
app.use("/api/v1/cb",cambioRoutes)

const sorteoRoutes = require("./v1/routes/SorteoRoutes");
app.use("/api/v1/srt",sorteoRoutes)

const imgRouter = require("./v1/routes/ImageRoutes")
app.use("/api/v1/img", imgRouter)

const objetivoSucursalRouter = require("./v1/routes/ObjetivoSucursalRoutes")
app.use("/api/v1/objs", objetivoSucursalRouter)

const settingsRouter = require("./v1/routes/SettingsRoutes")
app.use("/api/v1/stt", settingsRouter)

const importerRouter = require("./v1/routes/ImporterRoutes")
app.use("/api/v1/importer", importerRouter);


/*
const ingresoRouter = require("./v1/routes/IngresoRoutes");
app.use("/api/v1/ingresos", ingresoRouter);

const egresoRouter = require("./v1/routes/EgresoRoutes");
app.use("/api/v1/egresos", egresoRouter);
*/
app.listen(port, () => {
    console.log('api is listening on port ' + port)
 })


