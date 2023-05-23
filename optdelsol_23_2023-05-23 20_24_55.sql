-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.32 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.4.0.6659
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para optdelsol_23
CREATE DATABASE IF NOT EXISTS `optdelsol_23` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `optdelsol_23`;

-- Volcando estructura para tabla optdelsol_23.banco
CREATE TABLE IF NOT EXISTS `banco` (
  `idbanco` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idbanco`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.banco: ~7 rows (aproximadamente)
DELETE FROM `banco`;
INSERT INTO `banco` (`idbanco`, `nombre`) VALUES
	(1, 'BANCO DEL CHACO'),
	(2, 'BANCO SANTANDER'),
	(3, 'BANCO ISBC'),
	(4, 'BANCO HSBC'),
	(5, 'BANCO PATAGONIA'),
	(6, 'BANCO CREDICOOP'),
	(21, 'BANK OF TOKYO');

-- Volcando estructura para tabla optdelsol_23.caja
CREATE TABLE IF NOT EXISTS `caja` (
  `idcaja` int NOT NULL AUTO_INCREMENT,
  `sucursal_idsucursal` int NOT NULL,
  `fecha` varchar(45) DEFAULT NULL,
  `monto_inicial` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcaja`),
  KEY `fk_caja_sucursal1_idx` (`sucursal_idsucursal`),
  CONSTRAINT `fk_caja_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.caja: ~0 rows (aproximadamente)
DELETE FROM `caja`;

-- Volcando estructura para tabla optdelsol_23.carga_manual
CREATE TABLE IF NOT EXISTS `carga_manual` (
  `idcarga_manual` int NOT NULL AUTO_INCREMENT,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `cliente_idcliente` int NOT NULL,
  `sucursal_idsucursal` int NOT NULL,
  `monto` varchar(45) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `concepto` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idcarga_manual`),
  KEY `fk_carga_manual_caja1_idx` (`caja_idcaja`),
  KEY `fk_carga_manual_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_carga_manual_cliente1_idx` (`cliente_idcliente`),
  KEY `fk_carga_manual_sucursal1_idx` (`sucursal_idsucursal`),
  CONSTRAINT `fk_carga_manual_caja1` FOREIGN KEY (`caja_idcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_carga_manual_cliente1` FOREIGN KEY (`cliente_idcliente`) REFERENCES `cliente` (`idcliente`),
  CONSTRAINT `fk_carga_manual_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_carga_manual_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.carga_manual: ~0 rows (aproximadamente)
DELETE FROM `carga_manual`;

-- Volcando estructura para tabla optdelsol_23.cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `idcliente` int NOT NULL AUTO_INCREMENT,
  `localidad_idlocalidad` int NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `dni` varchar(45) DEFAULT NULL,
  `telefono1` varchar(45) DEFAULT NULL,
  `telefono2` varchar(45) DEFAULT NULL,
  `bloqueado` int DEFAULT '0',
  PRIMARY KEY (`idcliente`),
  KEY `fk_cliente_localidad1_idx` (`localidad_idlocalidad`),
  CONSTRAINT `fk_cliente_localidad1` FOREIGN KEY (`localidad_idlocalidad`) REFERENCES `localidad` (`idlocalidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.cliente: ~0 rows (aproximadamente)
DELETE FROM `cliente`;

-- Volcando estructura para tabla optdelsol_23.cobro
CREATE TABLE IF NOT EXISTS `cobro` (
  `idcobro` int NOT NULL AUTO_INCREMENT,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `cliente_idcliente` int NOT NULL,
  `venta_idventa` int DEFAULT NULL,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha` datetime DEFAULT NULL,
  `monto` varchar(45) DEFAULT NULL,
  `tipo` varchar(8) DEFAULT 'CIE_OP',
  PRIMARY KEY (`idcobro`),
  KEY `fk_cobro_caja1_idx` (`caja_idcaja`),
  KEY `fk_cobro_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_cobro_cliente1_idx` (`cliente_idcliente`),
  KEY `fk_cobro_venta1_idx` (`venta_idventa`),
  CONSTRAINT `fk_cobro_caja1` FOREIGN KEY (`caja_idcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_cobro_cliente1` FOREIGN KEY (`cliente_idcliente`) REFERENCES `cliente` (`idcliente`),
  CONSTRAINT `fk_cobro_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`),
  CONSTRAINT `fk_cobro_venta1` FOREIGN KEY (`venta_idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.cobro: ~0 rows (aproximadamente)
DELETE FROM `cobro`;

-- Volcando estructura para tabla optdelsol_23.cobro_has_modo_pago
CREATE TABLE IF NOT EXISTS `cobro_has_modo_pago` (
  `cobro_idcobro` int NOT NULL,
  `modo_pago_idmodo_pago` int NOT NULL,
  `banco_idbanco` int DEFAULT NULL,
  `mutual_idmutual` int DEFAULT NULL,
  `monto` varchar(45) DEFAULT NULL,
  `cant_cuotas` varchar(45) DEFAULT NULL,
  `monto_cuota` varchar(45) DEFAULT NULL,
  `total_int` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`cobro_idcobro`,`modo_pago_idmodo_pago`),
  KEY `fk_cobro_has_modo_pago_modo_pago1_idx` (`modo_pago_idmodo_pago`),
  KEY `fk_cobro_has_modo_pago_cobro1_idx` (`cobro_idcobro`),
  KEY `fk_cobro_has_modo_pago_banco1_idx` (`banco_idbanco`),
  KEY `fk_cobro_has_modo_pago_mutual1_idx` (`mutual_idmutual`),
  CONSTRAINT `fk_cobro_has_modo_pago_banco1` FOREIGN KEY (`banco_idbanco`) REFERENCES `banco` (`idbanco`),
  CONSTRAINT `fk_cobro_has_modo_pago_cobro1` FOREIGN KEY (`cobro_idcobro`) REFERENCES `cobro` (`idcobro`),
  CONSTRAINT `fk_cobro_has_modo_pago_modo_pago1` FOREIGN KEY (`modo_pago_idmodo_pago`) REFERENCES `modo_pago` (`idmodo_pago`),
  CONSTRAINT `fk_cobro_has_modo_pago_mutual1` FOREIGN KEY (`mutual_idmutual`) REFERENCES `mutual` (`idmutual`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.cobro_has_modo_pago: ~0 rows (aproximadamente)
DELETE FROM `cobro_has_modo_pago`;

-- Volcando estructura para tabla optdelsol_23.codigo
CREATE TABLE IF NOT EXISTS `codigo` (
  `idcodigo` int NOT NULL AUTO_INCREMENT,
  `subgrupo_idsubgrupo` int NOT NULL,
  `codigo_base` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `codigo` varchar(45) DEFAULT NULL,
  `descripcion` varchar(45) DEFAULT NULL,
  `costo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  `activo` int DEFAULT '1',
  PRIMARY KEY (`idcodigo`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_codigo_subgrupo1_idx` (`subgrupo_idsubgrupo`),
  CONSTRAINT `fk_codigo_subgrupo1` FOREIGN KEY (`subgrupo_idsubgrupo`) REFERENCES `subgrupo` (`idsubgrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.codigo: ~67 rows (aproximadamente)
DELETE FROM `codigo`;
INSERT INTO `codigo` (`idcodigo`, `subgrupo_idsubgrupo`, `codigo_base`, `codigo`, `descripcion`, `costo`, `activo`) VALUES
	(1, 1, NULL, 'COD01', 'CODIGO DE PRUEBA', '8251', 1),
	(2, 1, NULL, 'COD02', 'CODIGO DE PRUEBA', '995', 1),
	(3, 1, NULL, 'COD03', 'CODIGO DE PRUEBA', '1', 1),
	(4, 1, NULL, 'COD004', 'COD004', '0', 1),
	(5, 1, NULL, 'COD005', 'COD005', '0', 1),
	(6, 1, NULL, 'COD006', 'COD006', '0', 1),
	(35, 1, NULL, 'A', '', '0', 1),
	(36, 1, NULL, 'B', '', '0', 1),
	(37, 1, NULL, 'C', '', '0', 1),
	(38, 1, NULL, 'D', '', '0', 1),
	(39, 1, NULL, 'E', '', '0', 1),
	(40, 4, NULL, 'S1', '', '0', 1),
	(41, 4, NULL, 'S2', '', '0', 1),
	(42, 4, NULL, 'S3', '', '0', 1),
	(43, 4, NULL, 'S4', '', '0', 1),
	(44, 4, NULL, 'S5', '', '0', 1),
	(45, 1, NULL, 's6', '', '0', 1),
	(46, 1, NULL, 's7', '', '0', 1),
	(47, 1, NULL, 's8', '', '0', 1),
	(48, 1, NULL, 's9', '', '0', 1),
	(49, 1, NULL, 's10', '', '0', 1),
	(50, 4, NULL, 's11', '', '0', 1),
	(51, 4, NULL, 's12', '', '0', 1),
	(52, 4, NULL, 's13', '', '0', 1),
	(53, 4, NULL, 's14', '', '0', 1),
	(54, 1, NULL, 'R1', '', '0', 1),
	(55, 1, NULL, 'R2', '', '0', 1),
	(56, 1, NULL, 'R3', '', '0', 1),
	(57, 1, NULL, 'R4', '', '0', 1),
	(58, 1, NULL, 'R5', '', '0', 1),
	(59, 1, NULL, 'R6', '', '0', 1),
	(60, 1, NULL, 'R7', '', '0', 1),
	(61, 1, NULL, 'R8', '', '0', 1),
	(62, 1, NULL, 'R9', '', '0', 1),
	(63, 1, NULL, 'R10', '', '0', 1),
	(64, 1, NULL, 'R11', '', '0', 1),
	(65, 1, NULL, 'R12', '', '0', 1),
	(66, 5, NULL, 'SH20', '', '0', 1),
	(67, 5, NULL, 'SH21', '', '0', 1),
	(68, 5, NULL, 'SH22', '', '0', 1),
	(69, 5, NULL, 'SH23', '', '0', 1),
	(70, 5, NULL, 'SH24', '', '0', 1),
	(71, 5, NULL, 'SH25', '', '0', 1),
	(72, 2, NULL, 'COD012', 'COD012', '0', 1),
	(73, 2, NULL, 'jajajjaja', '', '0', 1),
	(74, 2, NULL, 'jajajjaja2', '', '0', 1),
	(75, 2, NULL, 'jajajjaja3', '', '0', 1),
	(76, 2, NULL, 'LALALAla22', '', '0', 1),
	(77, 2, NULL, 'LALALAla224', '', '0', 1),
	(78, 2, NULL, '323232', '', '0', 1),
	(79, 2, NULL, '65656565', '', '0', 1),
	(80, 2, NULL, 'LALALALALALALA', 'LALALALALALALALLALA', '0', 1),
	(81, 14, NULL, 'PRUEBA_0001', '', '0', 1),
	(82, 14, NULL, 'PRUEBA_0002', '', '0', 1),
	(83, 14, NULL, 'PRUEBA_0003', '', '0', 1),
	(84, 14, NULL, 'PRUEBA_0004', '', '0', 1),
	(85, 14, NULL, 'PRUEBA_0005', '', '0', 1),
	(86, 2, NULL, 'M1', 'some description', '0', 1),
	(87, 2, NULL, 'M2', 'some description', '0', 1),
	(88, 2, NULL, 'M3', 'some description', '0', 1),
	(89, 15, NULL, 'N1', 'SOME DESCRIPTION', '0', 1),
	(90, 2, NULL, 'o1', 'some description', '0', 1),
	(91, 15, NULL, '02', 'some description', '0', 1),
	(92, 2, NULL, 'n9', 'n9', '0', 1),
	(93, 15, NULL, 'p1', 'p1', '0', 1),
	(94, 15, NULL, 'p2', 'p2', '0', 1),
	(95, 15, NULL, 'p3', 'p3', '0', 1);

-- Volcando estructura para tabla optdelsol_23.codigo_factura
CREATE TABLE IF NOT EXISTS `codigo_factura` (
  `idstock_factura` int NOT NULL AUTO_INCREMENT,
  `stock_sucursal_idsucursal` int DEFAULT NULL,
  `stock_codigo_idcodigo` int NOT NULL,
  `factura_idfactura` int NOT NULL,
  `cantidad` int DEFAULT '0',
  `costo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idstock_factura`) USING BTREE,
  KEY `fk_stock_has_factura_factura1_idx` (`factura_idfactura`) USING BTREE,
  KEY `fk_stock_has_factura_stock1_idx` (`stock_sucursal_idsucursal`,`stock_codigo_idcodigo`) USING BTREE,
  CONSTRAINT `fk_stock_has_factura_factura1` FOREIGN KEY (`factura_idfactura`) REFERENCES `factura` (`idfactura`),
  CONSTRAINT `fk_stock_has_factura_stock1` FOREIGN KEY (`stock_sucursal_idsucursal`, `stock_codigo_idcodigo`) REFERENCES `stock` (`sucursal_idsucursal`, `codigo_idcodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.codigo_factura: ~4 rows (aproximadamente)
DELETE FROM `codigo_factura`;
INSERT INTO `codigo_factura` (`idstock_factura`, `stock_sucursal_idsucursal`, `stock_codigo_idcodigo`, `factura_idfactura`, `cantidad`, `costo`) VALUES
	(1, NULL, 92, 1, 29, '0'),
	(2, NULL, 93, 2, 1, '0'),
	(3, NULL, 94, 2, 1, '0'),
	(4, NULL, 95, 2, 1, '0');

-- Volcando estructura para tabla optdelsol_23.concepto_gasto
CREATE TABLE IF NOT EXISTS `concepto_gasto` (
  `idconcepto_gasto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idconcepto_gasto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.concepto_gasto: ~2 rows (aproximadamente)
DELETE FROM `concepto_gasto`;
INSERT INTO `concepto_gasto` (`idconcepto_gasto`, `nombre`) VALUES
	(1, 'test'),
	(2, 'test');

-- Volcando estructura para tabla optdelsol_23.envio
CREATE TABLE IF NOT EXISTS `envio` (
  `idenvio` int NOT NULL AUTO_INCREMENT,
  `sucursal_idsucursal` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `cantidad_total` int DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idenvio`),
  KEY `fk_envio_sucursal1_idx` (`sucursal_idsucursal`),
  KEY `fk_envio_usuario1_idx` (`usuario_idusuario`),
  CONSTRAINT `fk_envio_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_envio_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.envio: ~59 rows (aproximadamente)
DELETE FROM `envio`;
INSERT INTO `envio` (`idenvio`, `sucursal_idsucursal`, `usuario_idusuario`, `cantidad_total`, `fecha`) VALUES
	(1, 1, 1, 0, '2023-04-06 19:01:46'),
	(2, 1, 1, 10, '2023-04-10 17:23:27'),
	(3, 1, 1, 10, '2023-04-10 17:23:40'),
	(4, 1, 1, 10, '2023-04-10 17:23:52'),
	(5, 1, 1, 10, '2023-04-10 17:24:26'),
	(6, 1, 1, 10, '2023-04-10 17:25:40'),
	(7, 1, 1, 10, '2023-04-10 17:26:35'),
	(8, 1, 1, 10, '2023-04-10 17:28:58'),
	(9, 1, 1, 10, '2023-04-10 17:29:48'),
	(10, 1, 1, 10, '2023-04-10 17:32:25'),
	(11, 1, 1, 10, '2023-04-10 17:35:35'),
	(12, 1, 1, 10, '2023-04-10 17:35:59'),
	(13, 1, 1, 10, '2023-04-10 17:36:56'),
	(14, 1, 1, 10, '2023-04-10 17:39:17'),
	(15, 1, 1, 10, '2023-04-10 17:44:12'),
	(16, 1, 1, 10, '2023-04-10 17:44:53'),
	(17, 1, 1, 10, '2023-04-11 20:20:49'),
	(18, 1, 1, 10, '2023-04-12 18:48:24'),
	(19, 1, 1, 10, '2023-04-12 18:49:07'),
	(20, 1, 1, 10, '2023-04-12 18:49:32'),
	(21, 1, 1, 10, '2023-04-12 18:50:03'),
	(22, 1, 1, 10, '2023-04-12 18:54:57'),
	(23, 1, 1, 10, '2023-04-12 18:57:28'),
	(24, 1, 1, 10, '2023-04-12 20:12:37'),
	(25, 1, 1, 10, '2023-04-18 20:07:16'),
	(26, 1, 1, 10, '2023-04-18 20:11:13'),
	(27, 1, 1, 10, '2023-04-18 20:12:31'),
	(28, 1, 1, 10, '2023-04-18 20:12:52'),
	(29, 1, 1, 10, '2023-04-18 20:14:53'),
	(30, 1, 1, 10, '2023-04-18 20:15:38'),
	(31, 1, 1, 10, '2023-04-18 20:18:17'),
	(32, 1, 1, 10, '2023-04-18 20:18:47'),
	(33, 1, 1, 10, '2023-04-18 20:20:54'),
	(34, 1, 1, 10, '2023-04-18 20:22:21'),
	(35, 1, 1, 10, '2023-04-18 20:24:43'),
	(36, 1, 1, 10, '2023-04-19 19:39:42'),
	(37, 1, 1, 10, '2023-04-19 19:49:39'),
	(38, 1, 1, 1, '2023-04-19 19:54:33'),
	(39, 1, 1, 1, '2023-04-19 19:57:22'),
	(40, 1, 1, 1, '2023-04-19 19:58:52'),
	(41, 1, 1, 1, '2023-04-19 20:02:15'),
	(42, 1, 1, 1, '2023-04-19 20:03:54'),
	(43, 1, 1, 1, '2023-04-19 20:07:23'),
	(44, 1, 1, 0, '2023-04-19 20:15:13'),
	(45, 1, 1, 0, '2023-04-19 20:17:56'),
	(46, 2, 1, NULL, '2023-04-19 20:27:47'),
	(47, 1, 1, 0, '2023-04-20 17:25:27'),
	(48, 1, 1, 3, '2023-04-20 17:49:55'),
	(49, 1, 1, 1, '2023-04-20 17:56:53'),
	(50, 1, 1, 5, '2023-04-20 17:59:05'),
	(51, 1, 1, 8, '2023-04-20 18:07:37'),
	(52, 2, 1, 9, '2023-04-20 20:14:49'),
	(53, 2, 1, 11, '2023-04-21 17:30:46'),
	(54, 1, 1, 17, '2023-04-21 17:45:15'),
	(55, 2, 1, 5, '2023-04-26 19:00:11'),
	(56, 1, 1, 9, '2023-05-05 20:18:06'),
	(57, 2, 1, 9, '2023-05-08 18:22:28'),
	(58, 1, 1, 7, '2023-05-08 18:32:12'),
	(59, 2, 1, 8, '2023-05-16 19:59:33'),
	(60, 1, 1, 4, '2023-05-16 20:01:37'),
	(61, 1, 1, 14, '2023-05-17 17:46:07'),
	(62, 1, 1, 40, '2023-05-17 17:49:50'),
	(63, 1, 1, 500, '2023-05-17 17:52:17'),
	(64, 2, 1, 15, '2023-05-23 20:10:37');

-- Volcando estructura para tabla optdelsol_23.envio_has_stock
CREATE TABLE IF NOT EXISTS `envio_has_stock` (
  `idenvio_has_stock` int NOT NULL AUTO_INCREMENT,
  `envio_idenvio` int DEFAULT '0',
  `codigo_idcodigo` int DEFAULT '0',
  `cantidad` int DEFAULT '0',
  PRIMARY KEY (`idenvio_has_stock`),
  KEY `_fk_envio_` (`envio_idenvio`),
  KEY `_fk_codigo_` (`codigo_idcodigo`),
  CONSTRAINT `_fk_codigo_` FOREIGN KEY (`codigo_idcodigo`) REFERENCES `codigo` (`idcodigo`),
  CONSTRAINT `_fk_envio_` FOREIGN KEY (`envio_idenvio`) REFERENCES `envio` (`idenvio`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.envio_has_stock: ~110 rows (aproximadamente)
DELETE FROM `envio_has_stock`;
INSERT INTO `envio_has_stock` (`idenvio_has_stock`, `envio_idenvio`, `codigo_idcodigo`, `cantidad`) VALUES
	(5, 15, 1, 5),
	(6, 15, 2, 10),
	(7, 16, 1, 5),
	(8, 16, 2, 10),
	(9, 17, 1, 5),
	(10, 17, 2, 10),
	(11, 18, 1, 5),
	(12, 18, 2, 10),
	(13, 19, 1, 5),
	(14, 19, 2, 10),
	(15, 20, 1, 5),
	(16, 20, 2, 10),
	(17, 21, 1, 5),
	(18, 21, 2, 10),
	(19, 22, 1, 5),
	(20, 22, 2, 10),
	(21, 23, 1, 5),
	(22, 23, 2, 10),
	(23, 24, 1, 5),
	(24, 24, 2, 10),
	(25, 25, 1, 5),
	(26, 25, 2, 10),
	(27, 26, 1, 5),
	(28, 26, 2, 10),
	(29, 27, 1, 5),
	(30, 27, 2, 10),
	(31, 28, 1, 5),
	(32, 28, 2, 10),
	(33, 29, 1, 5),
	(34, 29, 2, 10),
	(35, 30, 1, 5),
	(36, 30, 2, 10),
	(37, 32, 1, 5),
	(38, 32, 2, 10),
	(39, 33, 1, 5),
	(40, 33, 2, 10),
	(41, 34, 1, 5),
	(42, 34, 2, 10),
	(43, 35, 1, 5),
	(44, 35, 2, 10),
	(45, 36, 1, 5),
	(46, 36, 2, 10),
	(47, 39, 1, 3),
	(48, 40, 1, 3),
	(49, 40, 2, 6),
	(50, 40, 3, 255),
	(51, 40, 4, 100),
	(52, 40, 5, 100),
	(53, 40, 6, 100),
	(54, 41, 1, 3),
	(55, 41, 2, 6),
	(56, 41, 3, 255),
	(57, 42, 1, 0),
	(58, 43, 4, 0),
	(59, 43, 5, 0),
	(60, 43, 6, 0),
	(61, 44, 1, 0),
	(62, 44, 2, 0),
	(63, 44, 3, 0),
	(64, 44, 4, 0),
	(65, 45, 1, 0),
	(66, 45, 2, 0),
	(67, 47, 1, 0),
	(68, 47, 2, 0),
	(69, 47, 3, 0),
	(70, 49, 1, 1),
	(71, 50, 1, 1),
	(72, 50, 2, 1),
	(73, 50, 3, 2),
	(74, 50, 4, 1),
	(75, 51, 1, 3),
	(76, 51, 2, 2),
	(77, 51, 3, 1),
	(78, 51, 4, 2),
	(79, 52, 1, 3),
	(80, 52, 2, 2),
	(81, 52, 3, 1),
	(82, 52, 4, 1),
	(83, 52, 5, 1),
	(84, 52, 6, 1),
	(85, 53, 1, 2),
	(86, 53, 2, 5),
	(87, 53, 3, 2),
	(88, 53, 4, 2),
	(89, 54, 1, 3),
	(90, 54, 2, 3),
	(91, 54, 3, 2),
	(92, 54, 4, 2),
	(93, 54, 5, 2),
	(94, 54, 6, 5),
	(95, 55, 1, 3),
	(96, 55, 2, 1),
	(97, 55, 3, 1),
	(98, 56, 1, 3),
	(99, 56, 2, 2),
	(100, 56, 3, 2),
	(101, 56, 4, 2),
	(102, 57, 1, 9),
	(103, 58, 1, 7),
	(104, 59, 1, 1),
	(105, 59, 2, 1),
	(106, 59, 3, 1),
	(107, 59, 4, 1),
	(108, 59, 54, 1),
	(109, 59, 55, 1),
	(110, 59, 56, 1),
	(111, 59, 57, 1),
	(112, 60, 1, 1),
	(113, 60, 2, 2),
	(114, 60, 4, 3),
	(115, 61, 1, 5),
	(116, 61, 2, 4),
	(117, 61, 3, 3),
	(118, 61, 4, 2),
	(119, 62, 1, 10),
	(120, 62, 2, 10),
	(121, 62, 3, 10),
	(122, 62, 4, 10),
	(123, 63, 1, 500),
	(124, 64, 1, 6),
	(125, 64, 2, 5),
	(126, 64, 3, 4);

-- Volcando estructura para tabla optdelsol_23.factura
CREATE TABLE IF NOT EXISTS `factura` (
  `idfactura` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `proveedor_idproveedor` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '0',
  `monto` varchar(50) NOT NULL DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idfactura`) USING BTREE,
  UNIQUE KEY `_prov_nro_factura` (`numero`,`proveedor_idproveedor`),
  KEY `fk_factura_proveedor1_idx` (`proveedor_idproveedor`) USING BTREE,
  CONSTRAINT `fk_factura_proveedor1` FOREIGN KEY (`proveedor_idproveedor`) REFERENCES `proveedor` (`idproveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.factura: ~8 rows (aproximadamente)
DELETE FROM `factura`;
INSERT INTO `factura` (`idfactura`, `numero`, `proveedor_idproveedor`, `cantidad`, `monto`, `fecha`) VALUES
	(1, '0-0000102', 1, 0, '0', '2023-05-11 19:20:28'),
	(2, '0-002', 1, 0, '0', '2023-05-11 19:20:30'),
	(3, '0-003', 1, 0, '0', '2023-05-11 19:20:31'),
	(4, '0-003', 2, 0, '0', '2023-05-11 19:20:32'),
	(5, '0-004', 3, 0, '0', '2023-05-11 19:20:34'),
	(7, '98001', 7, 50, '5000', '2023-05-11 19:20:35'),
	(8, 'lalalollallal', 1, 2000, '50000', '2023-05-11 20:24:09'),
	(9, 'a98988', 2, 20, '5000', '2023-05-15 19:37:38');

-- Volcando estructura para tabla optdelsol_23.familia
CREATE TABLE IF NOT EXISTS `familia` (
  `idfamilia` int NOT NULL AUTO_INCREMENT,
  `nombre_corto` varchar(45) DEFAULT NULL,
  `nombre_largo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idfamilia`),
  UNIQUE KEY `nombre_corto` (`nombre_corto`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.familia: ~6 rows (aproximadamente)
DELETE FROM `familia`;
INSERT INTO `familia` (`idfamilia`, `nombre_corto`, `nombre_largo`) VALUES
	(1, 'A', 'B'),
	(2, 'ARMAZONES', 'ARMAZONES'),
	(3, 'LC', 'LENTES DE CONTACTO'),
	(4, 'liquidos', 'liquidos'),
	(5, 'ARMAZONES2', 'ARMAZONES2'),
	(6, 'PRUEBA', 'PRUEBA');

-- Volcando estructura para tabla optdelsol_23.gasto
CREATE TABLE IF NOT EXISTS `gasto` (
  `idgasto` int NOT NULL AUTO_INCREMENT,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `concepto_gasto_idconcepto_gasto` int NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idgasto`),
  KEY `fk_gasto_caja1_idx` (`caja_idcaja`),
  KEY `fk_gasto_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_gasto_concepto_gasto1_idx` (`concepto_gasto_idconcepto_gasto`),
  CONSTRAINT `fk_gasto_caja1` FOREIGN KEY (`caja_idcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_gasto_concepto_gasto1` FOREIGN KEY (`concepto_gasto_idconcepto_gasto`) REFERENCES `concepto_gasto` (`idconcepto_gasto`),
  CONSTRAINT `fk_gasto_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.gasto: ~0 rows (aproximadamente)
DELETE FROM `gasto`;

-- Volcando estructura para tabla optdelsol_23.grupo
CREATE TABLE IF NOT EXISTS `grupo` (
  `idgrupo` int NOT NULL AUTO_INCREMENT,
  `subfamilia_idsubfamilia` int NOT NULL,
  `nombre_corto` varchar(45) DEFAULT NULL,
  `nombre_largo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idgrupo`),
  UNIQUE KEY `unique` (`subfamilia_idsubfamilia`,`nombre_corto`),
  KEY `fk_grupo_subfamilia1_idx` (`subfamilia_idsubfamilia`),
  CONSTRAINT `fk_grupo_subfamilia1` FOREIGN KEY (`subfamilia_idsubfamilia`) REFERENCES `subfamilia` (`idsubfamilia`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.grupo: ~7 rows (aproximadamente)
DELETE FROM `grupo`;
INSERT INTO `grupo` (`idgrupo`, `subfamilia_idsubfamilia`, `nombre_corto`, `nombre_largo`) VALUES
	(1, 1, 'LAROSA', 'LAROSA'),
	(2, 1, 'CADES', 'CADES'),
	(3, 2, 'SHITTO', 'SHITTO'),
	(4, 3, 'OASYS', 'OASYS'),
	(5, 1, 'LAROSA2', 'LAROSA2'),
	(6, 5, 'GRUPO_PRUEBA', 'GRUPO_PRUEBA'),
	(7, 6, 'GRUPO_PRUEBA', 'GRUPO_PRUEBA');

-- Volcando estructura para tabla optdelsol_23.localidad
CREATE TABLE IF NOT EXISTS `localidad` (
  `idlocalidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idlocalidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.localidad: ~0 rows (aproximadamente)
DELETE FROM `localidad`;

-- Volcando estructura para tabla optdelsol_23.medico
CREATE TABLE IF NOT EXISTS `medico` (
  `idmedico` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `matricula` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmedico`),
  UNIQUE KEY `_matricula` (`matricula`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.medico: ~18 rows (aproximadamente)
DELETE FROM `medico`;
INSERT INTO `medico` (`idmedico`, `nombre`, `matricula`) VALUES
	(1, 'test', '001'),
	(3, 'test', '002'),
	(4, 'test', '003'),
	(6, 'test', '004'),
	(8, 'test', NULL),
	(9, 'm1', 'm1'),
	(10, 'm2', 'm2'),
	(12, 'm3', 'm3'),
	(13, 'm4', 'm4'),
	(14, 'm6', 'm6'),
	(15, 'm7', 'm7'),
	(17, 'm8', 'm8'),
	(18, 'm9', 'm9'),
	(19, 'm10', 'm10'),
	(22, NULL, NULL),
	(23, 'test_10', 'test_10'),
	(24, 'test_11', 'test_11'),
	(25, 'test_14', 'test_14');

-- Volcando estructura para tabla optdelsol_23.modo_pago
CREATE TABLE IF NOT EXISTS `modo_pago` (
  `idmodo_pago` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmodo_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.modo_pago: ~0 rows (aproximadamente)
DELETE FROM `modo_pago`;

-- Volcando estructura para tabla optdelsol_23.mutual
CREATE TABLE IF NOT EXISTS `mutual` (
  `idmutual` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmutual`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.mutual: ~0 rows (aproximadamente)
DELETE FROM `mutual`;
INSERT INTO `mutual` (`idmutual`, `nombre`) VALUES
	(1, 'test');

-- Volcando estructura para tabla optdelsol_23.proveedor
CREATE TABLE IF NOT EXISTS `proveedor` (
  `idproveedor` int NOT NULL AUTO_INCREMENT,
  `cuit` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`idproveedor`) USING BTREE,
  UNIQUE KEY `uq_cuit` (`cuit`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.proveedor: ~17 rows (aproximadamente)
DELETE FROM `proveedor`;
INSERT INTO `proveedor` (`idproveedor`, `cuit`, `nombre`) VALUES
	(1, '001', 'provtest1'),
	(2, '002', 'provtest2'),
	(3, '003', 'provtest3'),
	(7, 'b', 'b'),
	(19, 'a', 'a'),
	(20, 'd', 'd'),
	(21, 'e', 'e'),
	(22, 'testprovcuit', 'testprov'),
	(23, '000010001', 'ThisIsATest'),
	(24, '01', 'kaaljkllj'),
	(25, '02', 'kaaljkllj45'),
	(26, '03', 'kaaljkllj456'),
	(27, '04', 'kaaljkllj4567'),
	(28, '16052023', '16052023'),
	(29, '16052023d', '16052023'),
	(30, '0012', 'asfasfsf'),
	(31, '0010', 'sfdf');

-- Volcando estructura para tabla optdelsol_23.session
CREATE TABLE IF NOT EXISTS `session` (
  `idsession` int NOT NULL AUTO_INCREMENT,
  `token` varchar(250) NOT NULL DEFAULT '0',
  `fkaccount` int NOT NULL DEFAULT '0',
  `active` int DEFAULT '0',
  PRIMARY KEY (`idsession`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.session: ~0 rows (aproximadamente)
DELETE FROM `session`;

-- Volcando estructura para tabla optdelsol_23.stock
CREATE TABLE IF NOT EXISTS `stock` (
  `sucursal_idsucursal` int NOT NULL,
  `codigo_idcodigo` int NOT NULL,
  `cantidad` int DEFAULT '0',
  PRIMARY KEY (`sucursal_idsucursal`,`codigo_idcodigo`),
  KEY `fk_sucursal_has_codigo_codigo1_idx` (`codigo_idcodigo`),
  KEY `fk_sucursal_has_codigo_sucursal1_idx` (`sucursal_idsucursal`),
  CONSTRAINT `fk_sucursal_has_codigo_codigo1` FOREIGN KEY (`codigo_idcodigo`) REFERENCES `codigo` (`idcodigo`),
  CONSTRAINT `fk_sucursal_has_codigo_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.stock: ~65 rows (aproximadamente)
DELETE FROM `stock`;
INSERT INTO `stock` (`sucursal_idsucursal`, `codigo_idcodigo`, `cantidad`) VALUES
	(1, 1, 1040),
	(1, 2, 991),
	(1, 3, 987),
	(1, 4, 988),
	(1, 35, 7),
	(1, 36, 1000),
	(1, 37, 1000),
	(1, 38, 1),
	(1, 39, 1000),
	(1, 40, 1000),
	(1, 41, 1000),
	(1, 42, 1000),
	(1, 43, 1000),
	(1, 44, 1000),
	(1, 45, 1000),
	(1, 46, 1000),
	(1, 47, 1000),
	(1, 48, 1000),
	(1, 49, 1000),
	(1, 50, 1000),
	(1, 51, 1000),
	(1, 52, 1000),
	(1, 53, 1000),
	(1, 54, 1000),
	(1, 55, 1000),
	(1, 56, 1000),
	(1, 57, 1000),
	(1, 58, 1000),
	(1, 59, 1000),
	(1, 60, 1000),
	(1, 61, 1000),
	(1, 62, 1000),
	(1, 63, 1000),
	(1, 64, 1000),
	(1, 65, 1000),
	(1, 66, 1000),
	(1, 67, 1000),
	(1, 68, 1000),
	(1, 69, 1000),
	(1, 70, 1000),
	(1, 71, 1000),
	(1, 73, 1500),
	(1, 74, 1000),
	(1, 75, 1000),
	(1, 76, 8000),
	(1, 77, 70000),
	(1, 78, 666666),
	(1, 79, 88888),
	(1, 80, 8000),
	(1, 81, 0),
	(1, 82, 0),
	(1, 83, 0),
	(1, 84, 0),
	(1, 85, 0),
	(1, 86, 5),
	(1, 87, 5),
	(1, 88, 5),
	(1, 89, 11),
	(1, 90, 1),
	(1, 91, 1),
	(1, 92, 29),
	(1, 93, 1),
	(1, 94, 1),
	(1, 95, 1),
	(2, 1, 994),
	(2, 5, 1000),
	(2, 6, 1000);

-- Volcando estructura para tabla optdelsol_23.subfamilia
CREATE TABLE IF NOT EXISTS `subfamilia` (
  `idsubfamilia` int NOT NULL AUTO_INCREMENT,
  `familia_idfamilia` int NOT NULL,
  `nombre_corto` varchar(45) DEFAULT NULL,
  `nombre_largo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idsubfamilia`),
  UNIQUE KEY `uqid` (`nombre_corto`,`familia_idfamilia`),
  KEY `fk_subfamilia_familia1_idx` (`familia_idfamilia`),
  CONSTRAINT `fk_subfamilia_familia1` FOREIGN KEY (`familia_idfamilia`) REFERENCES `familia` (`idfamilia`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.subfamilia: ~6 rows (aproximadamente)
DELETE FROM `subfamilia`;
INSERT INTO `subfamilia` (`idsubfamilia`, `familia_idfamilia`, `nombre_corto`, `nombre_largo`) VALUES
	(1, 2, 'RECETA', 'RECETA'),
	(2, 2, 'SOL', 'SOL'),
	(3, 3, 'lc', 'lc'),
	(4, 2, 'aa', 'aa'),
	(5, 6, 'FAMILIA_PRUEBA', 'FAMILIA_PRUEBA'),
	(6, 1, 'FAMILIA_PRUEBA', 'FAMILIA_PRUEBA');

-- Volcando estructura para tabla optdelsol_23.subgrupo
CREATE TABLE IF NOT EXISTS `subgrupo` (
  `idsubgrupo` int NOT NULL AUTO_INCREMENT,
  `grupo_idgrupo` int NOT NULL,
  `nombre_corto` varchar(45) DEFAULT NULL,
  `nombre_largo` varchar(45) DEFAULT NULL,
  `multiplicador` varchar(50) DEFAULT '1',
  PRIMARY KEY (`idsubgrupo`),
  UNIQUE KEY `unique` (`grupo_idgrupo`,`nombre_corto`),
  KEY `fk_subgrupo_grupo1_idx` (`grupo_idgrupo`),
  CONSTRAINT `fk_subgrupo_grupo1` FOREIGN KEY (`grupo_idgrupo`) REFERENCES `grupo` (`idgrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.subgrupo: ~15 rows (aproximadamente)
DELETE FROM `subgrupo`;
INSERT INTO `subgrupo` (`idsubgrupo`, `grupo_idgrupo`, `nombre_corto`, `nombre_largo`, `multiplicador`) VALUES
	(0, 2, 'CA002', 'CA002', '8'),
	(1, 1, 'LAROSA1', 'LAROSA1', '3'),
	(2, 2, 'CA001', 'CA001', '8'),
	(4, 3, 'SH01', 'SH01', '3'),
	(5, 3, 'SH02', 'SH02', '3'),
	(6, 3, 'SH03', 'SH03', '3'),
	(7, 4, 'OAS1', 'OAS1', '1.00'),
	(8, 4, 'OAS2', 'OAS2', '1.00'),
	(9, 4, 'OAS3', 'OAS3', '1.00'),
	(10, 4, 'OAS4', 'OAS4', '1.00'),
	(11, 4, 'OAS6', 'OAS6', '1.00'),
	(12, 4, 'OAS7', 'OAS7', '1.00'),
	(13, 1, 'LAROSA2', 'LAROSA2', '3'),
	(14, 6, 'SUBGRUPO_PRUEBA', 'SUBGRUPO_PRUEBA', '0.1'),
	(15, 7, 'SUBGRUPO_PRUEBA', 'SUBGRUPO_PRUEBA', '0.1');

-- Volcando estructura para tabla optdelsol_23.sucursal
CREATE TABLE IF NOT EXISTS `sucursal` (
  `idsucursal` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.sucursal: ~4 rows (aproximadamente)
DELETE FROM `sucursal`;
INSERT INTO `sucursal` (`idsucursal`, `nombre`) VALUES
	(1, 'test'),
	(2, 'test1'),
	(3, 'test2'),
	(4, 'test3'),
	(5, 'test4');

-- Volcando estructura para tabla optdelsol_23.tipo_permisos
CREATE TABLE IF NOT EXISTS `tipo_permisos` (
  `idtipo_permisos` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idtipo_permisos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.tipo_permisos: ~0 rows (aproximadamente)
DELETE FROM `tipo_permisos`;

-- Volcando estructura para tabla optdelsol_23.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `logged` tinyint DEFAULT '0',
  `token` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.usuario: ~2 rows (aproximadamente)
DELETE FROM `usuario`;
INSERT INTO `usuario` (`idusuario`, `nombre`, `password`, `logged`, `token`) VALUES
	(1, 'testuser', 'testuser', 0, NULL),
	(2, 'root', 'root', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpYXQiOjE2ODQ4NzM0NjIsImV4cCI6MTY4NDg3NzA2Mn0.MWRTz1Fx_t7bl_FGqgXQeqyFox2MUe6j-GZQE21vOpc');

-- Volcando estructura para tabla optdelsol_23.usuario_has_tipo_permisos
CREATE TABLE IF NOT EXISTS `usuario_has_tipo_permisos` (
  `usuario_idusuario` int NOT NULL,
  `tipo_permisos_idtipo_permisos` int NOT NULL,
  PRIMARY KEY (`usuario_idusuario`,`tipo_permisos_idtipo_permisos`),
  KEY `fk_usuario_has_tipo_permisos_tipo_permisos1_idx` (`tipo_permisos_idtipo_permisos`),
  KEY `fk_usuario_has_tipo_permisos_usuario1_idx` (`usuario_idusuario`),
  CONSTRAINT `fk_usuario_has_tipo_permisos_tipo_permisos1` FOREIGN KEY (`tipo_permisos_idtipo_permisos`) REFERENCES `tipo_permisos` (`idtipo_permisos`),
  CONSTRAINT `fk_usuario_has_tipo_permisos_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.usuario_has_tipo_permisos: ~0 rows (aproximadamente)
DELETE FROM `usuario_has_tipo_permisos`;

-- Volcando estructura para tabla optdelsol_23.venta
CREATE TABLE IF NOT EXISTS `venta` (
  `idventa` int NOT NULL AUTO_INCREMENT,
  `cliente_idcliente` int NOT NULL,
  `sucursal_idsucursal` int NOT NULL,
  `vendedor_idvendedor` int NOT NULL,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `medico_idmedico` int DEFAULT NULL,
  `monto_total` varchar(45) DEFAULT NULL,
  `descuento` varchar(45) DEFAULT NULL,
  `monto_inicial` varchar(45) DEFAULT NULL,
  `debe` varchar(45) DEFAULT NULL,
  `haber` varchar(45) DEFAULT NULL,
  `saldo` varchar(45) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idventa`),
  KEY `fk_venta_cliente_idx` (`cliente_idcliente`),
  KEY `fk_venta_sucursal1_idx` (`sucursal_idsucursal`),
  KEY `fk_venta_caja1_idx` (`caja_idcaja`),
  KEY `fk_venta_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_venta_medico1_idx` (`medico_idmedico`),
  CONSTRAINT `fk_venta_caja1` FOREIGN KEY (`caja_idcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_venta_cliente` FOREIGN KEY (`cliente_idcliente`) REFERENCES `cliente` (`idcliente`),
  CONSTRAINT `fk_venta_medico1` FOREIGN KEY (`medico_idmedico`) REFERENCES `medico` (`idmedico`),
  CONSTRAINT `fk_venta_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_venta_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.venta: ~0 rows (aproximadamente)
DELETE FROM `venta`;

-- Volcando estructura para tabla optdelsol_23.venta_has_modo_pago
CREATE TABLE IF NOT EXISTS `venta_has_modo_pago` (
  `venta_idventa` int NOT NULL,
  `modo_pago_idmodo_pago` int NOT NULL,
  `banco_idbanco` int DEFAULT NULL,
  `mutual_idmutual` int DEFAULT NULL,
  `monto` varchar(45) DEFAULT NULL,
  `monto_int` varchar(45) DEFAULT NULL,
  `cant_cuotas` varchar(45) DEFAULT NULL,
  `monto_cuota` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`venta_idventa`,`modo_pago_idmodo_pago`),
  KEY `fk_venta_has_modo_pago_modo_pago1_idx` (`modo_pago_idmodo_pago`),
  KEY `fk_venta_has_modo_pago_venta1_idx` (`venta_idventa`),
  KEY `fk_venta_has_modo_pago_banco1_idx` (`banco_idbanco`),
  KEY `fk_venta_has_modo_pago_mutual1_idx` (`mutual_idmutual`),
  CONSTRAINT `fk_venta_has_modo_pago_banco1` FOREIGN KEY (`banco_idbanco`) REFERENCES `banco` (`idbanco`),
  CONSTRAINT `fk_venta_has_modo_pago_modo_pago1` FOREIGN KEY (`modo_pago_idmodo_pago`) REFERENCES `modo_pago` (`idmodo_pago`),
  CONSTRAINT `fk_venta_has_modo_pago_mutual1` FOREIGN KEY (`mutual_idmutual`) REFERENCES `mutual` (`idmutual`),
  CONSTRAINT `fk_venta_has_modo_pago_venta1` FOREIGN KEY (`venta_idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.venta_has_modo_pago: ~0 rows (aproximadamente)
DELETE FROM `venta_has_modo_pago`;

-- Volcando estructura para tabla optdelsol_23.venta_has_stock
CREATE TABLE IF NOT EXISTS `venta_has_stock` (
  `venta_idventa` int NOT NULL,
  `stock_sucursal_idsucursal` int NOT NULL,
  `stock_codigo_idcodigo` int NOT NULL,
  `cantidad` int DEFAULT '0',
  PRIMARY KEY (`venta_idventa`,`stock_sucursal_idsucursal`,`stock_codigo_idcodigo`),
  KEY `fk_venta_has_stock_stock1_idx` (`stock_sucursal_idsucursal`,`stock_codigo_idcodigo`),
  KEY `fk_venta_has_stock_venta1_idx` (`venta_idventa`),
  CONSTRAINT `fk_venta_has_stock_stock1` FOREIGN KEY (`stock_sucursal_idsucursal`, `stock_codigo_idcodigo`) REFERENCES `stock` (`sucursal_idsucursal`, `codigo_idcodigo`),
  CONSTRAINT `fk_venta_has_stock_venta1` FOREIGN KEY (`venta_idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optdelsol_23.venta_has_stock: ~0 rows (aproximadamente)
DELETE FROM `venta_has_stock`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
