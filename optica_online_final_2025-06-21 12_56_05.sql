/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `optica_online_final` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `optica_online_final`;

CREATE TABLE IF NOT EXISTS `anotacion` (
  `idanotacion` int NOT NULL AUTO_INCREMENT,
  `nota` varchar(455) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fkusuario` int DEFAULT NULL,
  `fksucursal` int DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `refId` int DEFAULT NULL,
  PRIMARY KEY (`idanotacion`),
  KEY `fk_anotacion_sucursal` (`fksucursal`),
  KEY `fk_anotacion_usuario` (`fkusuario`),
  CONSTRAINT `fk_anotacion_sucursal` FOREIGN KEY (`fksucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_anotacion_usuario` FOREIGN KEY (`fkusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=560 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `baja_desperfecto` (
  `idbaja_desperfecto` int NOT NULL AUTO_INCREMENT,
  `fkcodigo` int NOT NULL,
  `fksucursal` int NOT NULL,
  `fkusuario` int NOT NULL,
  `cantidad` int NOT NULL,
  `comentarios` varchar(255) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idbaja_desperfecto`),
  KEY `fk_baja_codigo` (`fkcodigo`),
  KEY `fk_baja_sucursal` (`fksucursal`),
  KEY `fk_baja_usuario` (`fkusuario`),
  CONSTRAINT `fk_baja_codigo` FOREIGN KEY (`fkcodigo`) REFERENCES `codigo` (`idcodigo`),
  CONSTRAINT `fk_baja_sucursal` FOREIGN KEY (`fksucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_baja_usuario` FOREIGN KEY (`fkusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `banco` (
  `idbanco` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `order` int DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`idbanco`)
) ENGINE=InnoDB AUTO_INCREMENT=321 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `caja` (
  `idcaja` int NOT NULL AUTO_INCREMENT,
  `sucursal_idsucursal` int NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto_inicial` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `fecha_a` datetime DEFAULT CURRENT_TIMESTAMP,
  `control` varchar(10) DEFAULT 'PENDIENTE',
  PRIMARY KEY (`idcaja`),
  KEY `fk_caja_sucursal1_idx` (`sucursal_idsucursal`),
  CONSTRAINT `fk_caja_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=2864 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `carga_manual` (
  `idcarga_manual` int NOT NULL AUTO_INCREMENT,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `cliente_idcliente` int NOT NULL,
  `sucursal_idsucursal` int NOT NULL,
  `monto` varchar(45) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `concepto` varchar(45) DEFAULT NULL,
  `anulado` int DEFAULT '0',
  PRIMARY KEY (`idcarga_manual`),
  KEY `fk_carga_manual_caja1_idx` (`caja_idcaja`),
  KEY `fk_carga_manual_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_carga_manual_cliente1_idx` (`cliente_idcliente`),
  KEY `fk_carga_manual_sucursal1_idx` (`sucursal_idsucursal`),
  CONSTRAINT `fk_carga_manual_caja1` FOREIGN KEY (`caja_idcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_carga_manual_cliente1` FOREIGN KEY (`cliente_idcliente`) REFERENCES `cliente` (`idcliente`),
  CONSTRAINT `fk_carga_manual_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_carga_manual_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3657 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `carga_manual_proveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_proveedor` int NOT NULL DEFAULT '0',
  `monto` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `fecha_alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `comentarios` varchar(50) DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  `modo_ficha` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_cm_proveedor` (`fk_proveedor`),
  CONSTRAINT `fk_cm_proveedor` FOREIGN KEY (`fk_proveedor`) REFERENCES `proveedor` (`idproveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `cliente` (
  `idcliente` int NOT NULL AUTO_INCREMENT,
  `localidad_idlocalidad` int DEFAULT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `dni` varchar(45) DEFAULT NULL,
  `telefono1` varchar(45) DEFAULT NULL,
  `telefono2` varchar(45) DEFAULT NULL,
  `bloqueado` int DEFAULT '0',
  `fecha_nacimiento` datetime DEFAULT CURRENT_TIMESTAMP,
  `destinatario` tinyint DEFAULT '0',
  `saldo` int DEFAULT '0',
  `baja` tinyint DEFAULT '0',
  PRIMARY KEY (`idcliente`)
) ENGINE=InnoDB AUTO_INCREMENT=28464 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `cobro` (
  `idcobro` int NOT NULL AUTO_INCREMENT,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `cliente_idcliente` int NOT NULL,
  `venta_idventa` int DEFAULT NULL,
  `sucursal_idsucursal` int DEFAULT NULL,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto` varchar(45) DEFAULT NULL,
  `tipo` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'CIE_OP',
  `concepto` varchar(50) DEFAULT NULL,
  `saldo_actual` decimal(20,6) DEFAULT '0.000000',
  `anulado` int DEFAULT '0',
  PRIMARY KEY (`idcobro`),
  KEY `fk_cobro_caja1_idx` (`caja_idcaja`),
  KEY `fk_cobro_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_cobro_cliente1_idx` (`cliente_idcliente`),
  KEY `fk_cobro_venta1_idx` (`venta_idventa`),
  CONSTRAINT `fk_cobro_caja1` FOREIGN KEY (`caja_idcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_cobro_cliente1` FOREIGN KEY (`cliente_idcliente`) REFERENCES `cliente` (`idcliente`),
  CONSTRAINT `fk_cobro_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`),
  CONSTRAINT `fk_cobro_venta1` FOREIGN KEY (`venta_idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=57193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `cobro_has_modo_pago` (
  `idcobro_mp` int NOT NULL AUTO_INCREMENT,
  `cobro_idcobro` int NOT NULL,
  `banco_idbanco` int DEFAULT NULL,
  `mutual_idmutual` int DEFAULT NULL,
  `fk_tarjeta` int DEFAULT NULL,
  `modo_pago` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `monto` varchar(45) DEFAULT NULL,
  `cant_cuotas` varchar(45) DEFAULT NULL,
  `monto_cuota` varchar(45) DEFAULT NULL,
  `total_int` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`idcobro_mp`),
  KEY `fk_cobro_has_modo_pago_cobro1_idx` (`cobro_idcobro`),
  KEY `fk_cobro_has_modo_pago_banco1_idx` (`banco_idbanco`),
  KEY `fk_cobro_has_modo_pago_mutual1_idx` (`mutual_idmutual`),
  CONSTRAINT `fk_cobro_has_modo_pago_banco1` FOREIGN KEY (`banco_idbanco`) REFERENCES `banco` (`idbanco`),
  CONSTRAINT `fk_cobro_has_modo_pago_cobro1` FOREIGN KEY (`cobro_idcobro`) REFERENCES `cobro` (`idcobro`),
  CONSTRAINT `fk_cobro_has_modo_pago_mutual1` FOREIGN KEY (`mutual_idmutual`) REFERENCES `mutual` (`idmutual`)
) ENGINE=InnoDB AUTO_INCREMENT=60673 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `codigo` (
  `idcodigo` int NOT NULL AUTO_INCREMENT,
  `subgrupo_idsubgrupo` int NOT NULL,
  `codigo_base` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `codigo` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `costo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  `activo` int DEFAULT '1',
  `genero` varchar(50) DEFAULT NULL,
  `edad` varchar(50) DEFAULT NULL,
  `modo_precio` int DEFAULT '0' COMMENT '0: multip, 1: prec. sub.  2: prec. ind.',
  `precio` decimal(20,6) DEFAULT '0.000000',
  `esf` varchar(6) DEFAULT NULL,
  `cil` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ad` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `base` varchar(50) DEFAULT NULL,
  `stock_ideal` int DEFAULT '0',
  `hook` varchar(25) DEFAULT NULL,
  `fecha_a` datetime DEFAULT CURRENT_TIMESTAMP,
  `precio_ant` decimal(20,6) DEFAULT '0.000000',
  `precio_mayorista` decimal(20,6) DEFAULT '0.000000',
  PRIMARY KEY (`idcodigo`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_codigo_subgrupo1_idx` (`subgrupo_idsubgrupo`),
  CONSTRAINT `fk_codigo_subgrupo1` FOREIGN KEY (`subgrupo_idsubgrupo`) REFERENCES `subgrupo` (`idsubgrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=53242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=3793 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `codigo_has_tag` (
  `fk_codigo` int NOT NULL,
  `fk_etiqueta` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`fk_codigo`,`fk_etiqueta`),
  KEY `fk_codigo_has_tag_etiqueta` (`fk_etiqueta`),
  CONSTRAINT `fk_codigo_has_tag_codigo` FOREIGN KEY (`fk_codigo`) REFERENCES `codigo` (`idcodigo`),
  CONSTRAINT `fk_codigo_has_tag_etiqueta` FOREIGN KEY (`fk_etiqueta`) REFERENCES `tag` (`etiqueta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `codigo_insert_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hook` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hook` (`hook`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `concepto_gasto` (
  `idconcepto_gasto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idconcepto_gasto`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `control_stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `fkusuario` int DEFAULT NULL,
  `fksucursal` int DEFAULT NULL,
  `tipo` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `comentarios` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_usuario_e_` (`fkusuario`) USING BTREE,
  KEY `fk_sucursal_e_` (`fksucursal`) USING BTREE,
  CONSTRAINT `fk_sucursal_e_` FOREIGN KEY (`fksucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_usuario_e_` FOREIGN KEY (`fkusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `departamentos` (
  `id` int NOT NULL,
  `provincia_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `detalle_categoria` (
  `iddetalle` int NOT NULL AUTO_INCREMENT,
  `fkcategoria` int DEFAULT '0',
  `tipo` int NOT NULL DEFAULT '0' COMMENT '-1 familia \r\n-2 subfamilia \r\n-3 grupo \r\n-4 subgrupo \r\n-5 codigo ',
  `titulo` text,
  `descripcion` longtext,
  `old_id` int DEFAULT NULL,
  PRIMARY KEY (`iddetalle`)
) ENGINE=InnoDB AUTO_INCREMENT=847 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `envio` (
  `idenvio` int NOT NULL AUTO_INCREMENT,
  `sucursal_idsucursal` int NOT NULL,
  `usuario_idusuario` int DEFAULT '1',
  `sucursal_origen` int DEFAULT NULL,
  `cantidad_total` int DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'GENERADO',
  `anulado` int DEFAULT '0',
  PRIMARY KEY (`idenvio`),
  KEY `fk_envio_sucursal1_idx` (`sucursal_idsucursal`),
  KEY `fk_envio_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_envio_origen` (`sucursal_origen`),
  CONSTRAINT `fk_envio_origen` FOREIGN KEY (`sucursal_origen`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_envio_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=1601 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=27792 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `evento` (
  `idevento` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `detalle` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fk_usuario` int DEFAULT NULL,
  `fk_sucursal` int DEFAULT NULL,
  `ref_id` int DEFAULT NULL,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `curr_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idevento`) USING BTREE,
  KEY `fk_evento_usuario_` (`fk_usuario`) USING BTREE,
  KEY `fk_evento_sucursal_` (`fk_sucursal`) USING BTREE,
  CONSTRAINT `fk_evento_sucursal_` FOREIGN KEY (`fk_sucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_evento_usuario_` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=23177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `factura` (
  `idfactura` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `proveedor_idproveedor` int NOT NULL,
  `es_remito` tinyint DEFAULT '0',
  `punto_venta` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `cantidad` int NOT NULL DEFAULT '0',
  `monto` varchar(50) NOT NULL DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `activo` int DEFAULT '1',
  `tipo` char(50) DEFAULT NULL,
  `c_n_gravados` decimal(20,6) DEFAULT '0.000000',
  `imp_int` decimal(20,6) DEFAULT '0.000000',
  `periodo` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idfactura`) USING BTREE,
  UNIQUE KEY `_prov_nro_factura` (`numero`,`proveedor_idproveedor`,`es_remito`,`punto_venta`) USING BTREE,
  KEY `fk_factura_proveedor1_idx` (`proveedor_idproveedor`) USING BTREE,
  CONSTRAINT `fk_factura_proveedor1` FOREIGN KEY (`proveedor_idproveedor`) REFERENCES `proveedor` (`idproveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `factura_iva` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_factura` int DEFAULT NULL,
  `monto` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `iva_fk_factura` (`fk_factura`),
  CONSTRAINT `iva_fk_factura` FOREIGN KEY (`fk_factura`) REFERENCES `factura` (`idfactura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `factura_percepcion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_factura` int DEFAULT NULL,
  `monto` decimal(20,6) NOT NULL DEFAULT '0.000000',
  PRIMARY KEY (`id`),
  KEY `fk_percepcion_factura` (`fk_factura`),
  CONSTRAINT `fk_percepcion_factura` FOREIGN KEY (`fk_factura`) REFERENCES `factura` (`idfactura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `factura_retencion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_factura` int DEFAULT NULL,
  `monto` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_retencion_factura` (`fk_factura`),
  CONSTRAINT `fk_retencion_factura` FOREIGN KEY (`fk_factura`) REFERENCES `factura` (`idfactura`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `familia` (
  `idfamilia` int NOT NULL AUTO_INCREMENT,
  `nombre_corto` varchar(45) DEFAULT NULL,
  `nombre_largo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idfamilia`),
  UNIQUE KEY `nombre_corto` (`nombre_corto`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `gasto` (
  `idgasto` int NOT NULL AUTO_INCREMENT,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `concepto_gasto_idconcepto_gasto` int NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto` varchar(45) DEFAULT NULL,
  `sucursal_idsucursal` int DEFAULT NULL,
  `comentarios` varchar(50) DEFAULT NULL,
  `anulado` int DEFAULT '0',
  PRIMARY KEY (`idgasto`),
  KEY `fk_gasto_caja1_idx` (`caja_idcaja`),
  KEY `fk_gasto_usuario1_idx` (`usuario_idusuario`),
  KEY `fk_gasto_concepto_gasto1_idx` (`concepto_gasto_idconcepto_gasto`),
  CONSTRAINT `fk_gasto_caja1` FOREIGN KEY (`caja_idcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_gasto_concepto_gasto1` FOREIGN KEY (`concepto_gasto_idconcepto_gasto`) REFERENCES `concepto_gasto` (`idconcepto_gasto`),
  CONSTRAINT `fk_gasto_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3060 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `grupo` (
  `idgrupo` int NOT NULL AUTO_INCREMENT,
  `subfamilia_idsubfamilia` int NOT NULL,
  `nombre_corto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre_largo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `old_id` int DEFAULT NULL,
  `old_cid` int DEFAULT NULL,
  `visible_lp` int DEFAULT '1' COMMENT 'visible en lista de precios',
  PRIMARY KEY (`idgrupo`),
  KEY `fk_grupo_subfamilia1_idx` (`subfamilia_idsubfamilia`),
  CONSTRAINT `fk_grupo_subfamilia1` FOREIGN KEY (`subfamilia_idsubfamilia`) REFERENCES `subfamilia` (`idsubfamilia`)
) ENGINE=InnoDB AUTO_INCREMENT=100168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `imagen` (
  `idimagen` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `path` varchar(45) DEFAULT NULL,
  `fk_ref` int DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `active` tinyint DEFAULT '1',
  `default` tinyint DEFAULT '0',
  PRIMARY KEY (`idimagen`)
) ENGINE=InnoDB AUTO_INCREMENT=726 DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `imagen_has_image_tag` (
  `imagen_idimagen` int NOT NULL,
  `image_tag_idimage_tag` int NOT NULL,
  `acitive` tinyint DEFAULT '1',
  PRIMARY KEY (`imagen_idimagen`,`image_tag_idimage_tag`),
  KEY `fk_imagen_has_image_tag_image_tag1_idx` (`image_tag_idimage_tag`),
  KEY `fk_imagen_has_image_tag_imagen_idx` (`imagen_idimagen`),
  CONSTRAINT `fk_imagen_has_image_tag_image_tag1` FOREIGN KEY (`image_tag_idimage_tag`) REFERENCES `image_tag` (`idimage_tag`),
  CONSTRAINT `fk_imagen_has_image_tag_imagen` FOREIGN KEY (`imagen_idimagen`) REFERENCES `imagen` (`idimagen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `image_tag` (
  `idimage_tag` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idimage_tag`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `llamada_cliente` (
  `idllamada` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comentarios` varchar(255) DEFAULT NULL,
  `fk_usuario` int DEFAULT NULL,
  `fk_sucursal` int DEFAULT NULL,
  `fk_cliente` int DEFAULT NULL,
  PRIMARY KEY (`idllamada`),
  KEY `fk_llamada_usuario` (`fk_usuario`),
  KEY `fk_llamada_sucursal` (`fk_sucursal`),
  KEY `fk_llamada_cliente` (`fk_cliente`),
  CONSTRAINT `fk_llamada_cliente` FOREIGN KEY (`fk_cliente`) REFERENCES `cliente` (`idcliente`),
  CONSTRAINT `fk_llamada_sucursal` FOREIGN KEY (`fk_sucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_llamada_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=838 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `localidad` (
  `idlocalidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idlocalidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `localidades` (
  `id` int NOT NULL,
  `departamento_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `medico` (
  `idmedico` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `matricula` varchar(45) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `enabled` int DEFAULT '1',
  PRIMARY KEY (`idmedico`)
) ENGINE=InnoDB AUTO_INCREMENT=424 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `mensaje` (
  `idmensaje` int NOT NULL AUTO_INCREMENT,
  `fkemisor` int NOT NULL DEFAULT '0',
  `mensaje` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmensaje`) USING BTREE,
  KEY `fk_emisor_` (`fkemisor`) USING BTREE,
  CONSTRAINT `fk_emisor_` FOREIGN KEY (`fkemisor`) REFERENCES `optdelsol_28`.`usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `modo_pago` (
  `idmodo_pago` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmodo_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `moneda` (
  `moneda` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre_largo` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`moneda`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `mult_cuota` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantidad_cuotas` int NOT NULL DEFAULT '0',
  `interes` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`cantidad_cuotas`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `mutual` (
  `idmutual` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL DEFAULT '0',
  `descripcion` varchar(150) NOT NULL DEFAULT '0',
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmutual`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `objetivo_sucursal` (
  `id_objetivo_sucursal` int NOT NULL AUTO_INCREMENT,
  `fk_sucursal` int NOT NULL DEFAULT '0',
  `monto` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_objetivo_sucursal`),
  KEY `fk_objetivo_sucursal_sucursal` (`fk_sucursal`),
  CONSTRAINT `fk_objetivo_sucursal_sucursal` FOREIGN KEY (`fk_sucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `old_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL DEFAULT '0',
  `cantidad` varchar(50) NOT NULL DEFAULT '0',
  `precio` varchar(50) NOT NULL DEFAULT '0',
  `genero` varchar(50) NOT NULL DEFAULT '0',
  `marca` varchar(50) NOT NULL DEFAULT '0',
  `modelo` varchar(50) NOT NULL DEFAULT '0',
  `material` varchar(50) NOT NULL DEFAULT '0',
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `fecha_m` varchar(50) NOT NULL DEFAULT '0',
  `fkcodigo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `costo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2907 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='//generate from the csv file using the following regular expression:\r\n([0-9A-Z\\-\\/]{0,})(,)([0-9]+)(,)([0-9]*)(,)([A-Z]*)(,)([\\sA-Z\\-]*)(,)([\\sA-Z\\-0-9]*)(,)([A-Z\\-\\/\\s0-9]*)(,)([\\.A-Z\\-\\s\\/\\*\\/\\(\\)]*)(,)(\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d\\s\\d\\d:\\d\\d)\r\n//replace with:\r\ninto old_codes \\(codigo,cantidad,precio,genero,marca,modelo,material,descripcion,fecha_m\\)values\\(''$1'',''$3'',''$5'',''$7'',''$9'',''$11'',''$13'',''$15'',''$17''\\);';

CREATE TABLE IF NOT EXISTS `optica` (
  `idoptica` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `fkusuario` int DEFAULT NULL,
  PRIMARY KEY (`idoptica`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `fk_optica_usuario` (`fkusuario`),
  CONSTRAINT `fk_optica_usuario` FOREIGN KEY (`fkusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pago_proveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_proveedor` int DEFAULT NULL,
  `monto` decimal(20,6) DEFAULT '0.000000',
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint DEFAULT '1',
  `modo_ficha` tinyint DEFAULT '1',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_pago_proveedor_proveedor` (`fk_proveedor`) USING BTREE,
  CONSTRAINT `fk_pago_proveedor_proveedor` FOREIGN KEY (`fk_proveedor`) REFERENCES `proveedor` (`idproveedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pago_proveedor_modo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modo_pago` varchar(10) NOT NULL DEFAULT '0',
  `fk_pago_proveedor` int DEFAULT NULL,
  `monto` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `fk_banco` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fk_pago_proveedor_modo_pago_proveedor` (`fk_pago_proveedor`),
  CONSTRAINT `fk_pago_proveedor_modo_pago_proveedor` FOREIGN KEY (`fk_pago_proveedor`) REFERENCES `pago_proveedor` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `proveedor` (
  `idproveedor` int NOT NULL AUTO_INCREMENT,
  `cuit` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono1` varchar(50) DEFAULT NULL,
  `telefono2` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idproveedor`) USING BTREE,
  UNIQUE KEY `uq_cuit` (`cuit`)
) ENGINE=InnoDB AUTO_INCREMENT=302 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `provincias` (
  `id` int NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `sesion` (
  `idsesion` int NOT NULL AUTO_INCREMENT,
  `token` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `fkaccount` int DEFAULT NULL,
  `fksucursal` int DEFAULT NULL,
  `fkcaja` int DEFAULT NULL,
  `active` int DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'P',
  PRIMARY KEY (`idsesion`) USING BTREE,
  KEY `_fk_session_user_` (`fkaccount`) USING BTREE,
  KEY `_fk_session_sucursal_` (`fksucursal`) USING BTREE,
  KEY `_fk_session_caja_` (`fkcaja`) USING BTREE,
  CONSTRAINT `_fk_session_caja_` FOREIGN KEY (`fkcaja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `_fk_session_sucursal_` FOREIGN KEY (`fksucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `_fk_session_user_` FOREIGN KEY (`fkaccount`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `session` (
  `idsession` int NOT NULL AUTO_INCREMENT,
  `token` varchar(250) NOT NULL DEFAULT '0',
  `fkaccount` int DEFAULT NULL,
  `fksucursal` int DEFAULT NULL,
  `fkcaja` int DEFAULT NULL,
  `active` int DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idsession`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `s_key` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `s_value` varchar(125) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uq_key` (`s_key`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE IF NOT EXISTS `sobre_adicionales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_sucursal` int DEFAULT NULL,
  `fk_codigo` int DEFAULT NULL,
  `fk_venta` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `tipo` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_adicional_sucursal` (`fk_sucursal`),
  KEY `fk_adicional_codigo` (`fk_codigo`),
  KEY `fk_adicional_venta` (`fk_venta`),
  CONSTRAINT `fk_adicional_codigo` FOREIGN KEY (`fk_codigo`) REFERENCES `codigo` (`idcodigo`),
  CONSTRAINT `fk_adicional_sucursal` FOREIGN KEY (`fk_sucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_adicional_venta` FOREIGN KEY (`fk_venta`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=29507 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `stock` (
  `sucursal_idsucursal` int NOT NULL,
  `codigo_idcodigo` int NOT NULL,
  `cantidad` int DEFAULT '0',
  `fecha_modif` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `stock_ideal` int DEFAULT '0',
  PRIMARY KEY (`sucursal_idsucursal`,`codigo_idcodigo`),
  KEY `fk_sucursal_has_codigo_codigo1_idx` (`codigo_idcodigo`),
  KEY `fk_sucursal_has_codigo_sucursal1_idx` (`sucursal_idsucursal`),
  CONSTRAINT `fk_sucursal_has_codigo_codigo1` FOREIGN KEY (`codigo_idcodigo`) REFERENCES `codigo` (`idcodigo`),
  CONSTRAINT `fk_sucursal_has_codigo_sucursal1` FOREIGN KEY (`sucursal_idsucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `stock_modif` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_codigo` int DEFAULT NULL,
  `fk_sucursal` int DEFAULT NULL,
  `cant_ant` int DEFAULT NULL,
  `cant_nueva` int DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `subfamilia` (
  `idsubfamilia` int NOT NULL AUTO_INCREMENT,
  `familia_idfamilia` int NOT NULL,
  `nombre_corto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre_largo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `old_id` int DEFAULT NULL,
  `visible` int DEFAULT '1',
  PRIMARY KEY (`idsubfamilia`),
  UNIQUE KEY `uqid` (`nombre_corto`,`familia_idfamilia`),
  KEY `fk_subfamilia_familia1_idx` (`familia_idfamilia`),
  CONSTRAINT `fk_subfamilia_familia1` FOREIGN KEY (`familia_idfamilia`) REFERENCES `familia` (`idfamilia`)
) ENGINE=InnoDB AUTO_INCREMENT=88899 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `subgrupo` (
  `idsubgrupo` int NOT NULL AUTO_INCREMENT,
  `grupo_idgrupo` int NOT NULL,
  `nombre_corto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre_largo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `multiplicador` varchar(50) DEFAULT '1',
  `precio_defecto` decimal(20,6) DEFAULT '0.000000',
  `old_id` int DEFAULT NULL,
  `old_subc_id` int DEFAULT NULL,
  `no_stock` tinyint DEFAULT '0',
  `comentarios` varchar(255) DEFAULT NULL,
  `precio_defecto_mayorista` decimal(20,6) DEFAULT '0.000000',
  PRIMARY KEY (`idsubgrupo`),
  KEY `fk_subgrupo_grupo1_idx` (`grupo_idgrupo`),
  CONSTRAINT `fk_subgrupo_grupo1` FOREIGN KEY (`grupo_idgrupo`) REFERENCES `grupo` (`idgrupo`)
) ENGINE=InnoDB AUTO_INCREMENT=67657 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `sucursal` (
  `idsucursal` int NOT NULL AUTO_INCREMENT,
  `fkoptica` int DEFAULT NULL,
  `fk_localidad` int DEFAULT NULL,
  `fk_provincia` int DEFAULT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `denominacion` varchar(50) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `instagram` varchar(50) DEFAULT NULL,
  `comentarios_sobre` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `facebook` varchar(50) DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`idsucursal`),
  KEY `fk_sucursal_optica_` (`fkoptica`),
  KEY `fk_sucursal_localidad_` (`fk_localidad`),
  CONSTRAINT `fk_sucursal_localidad_` FOREIGN KEY (`fk_localidad`) REFERENCES `localidades` (`id`),
  CONSTRAINT `fk_sucursal_optica_` FOREIGN KEY (`fkoptica`) REFERENCES `optica` (`idoptica`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `tag` (
  `etiqueta` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fk_categoria` int DEFAULT NULL,
  PRIMARY KEY (`etiqueta`),
  KEY `fk_categoria` (`fk_categoria`),
  CONSTRAINT `fk_categoria` FOREIGN KEY (`fk_categoria`) REFERENCES `tag_categoria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `tag_categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_parent` int DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fk_parent_nombre` (`fk_parent`,`nombre`),
  KEY `fk_parent` (`fk_parent`),
  CONSTRAINT `fk_parent_cat` FOREIGN KEY (`fk_parent`) REFERENCES `tag_categoria` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `tarea` (
  `idtarea` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fk_parent` varchar(50) DEFAULT NULL,
  `ref_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `nombre` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `descripcion` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '  ',
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`idtarea`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `tarjeta` (
  `idtarjeta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`idtarjeta`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `tipo_permisos` (
  `idtipo_permisos` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idtipo_permisos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `transferencia` (
  `idtransferencia` int NOT NULL AUTO_INCREMENT,
  `fk_destino` int DEFAULT NULL,
  `fk_origen` int DEFAULT NULL,
  `fk_caja` int DEFAULT NULL,
  `monto` decimal(20,6) NOT NULL DEFAULT '0.000000',
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comentarios` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idtransferencia`),
  KEY `fk_transferencia_destino` (`fk_destino`),
  KEY `fk_transferencia_origen` (`fk_origen`),
  KEY `fk_transferencia_caja` (`fk_caja`),
  CONSTRAINT `fk_transferencia_caja` FOREIGN KEY (`fk_caja`) REFERENCES `caja` (`idcaja`),
  CONSTRAINT `fk_transferencia_destino` FOREIGN KEY (`fk_destino`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_transferencia_origen` FOREIGN KEY (`fk_origen`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuario` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `usuario` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `passwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `logged` tinyint DEFAULT '0',
  `token` varchar(250) DEFAULT NULL,
  `ventas` tinyint DEFAULT '0',
  `caja1` tinyint DEFAULT '0',
  `deposito_min` tinyint DEFAULT '0',
  `deposito` tinyint DEFAULT '0',
  `caja2` tinyint DEFAULT '0',
  `admin1` tinyint DEFAULT '0',
  `admin2` tinyint DEFAULT '0',
  `admin_prov` tinyint DEFAULT '0',
  `laboratorio` tinyint DEFAULT '0',
  `permisos` varchar(12) DEFAULT NULL,
  `fksucursal_default` int DEFAULT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `uq` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuario_has_tipo_permisos` (
  `usuario_idusuario` int NOT NULL,
  `tipo_permisos_idtipo_permisos` int NOT NULL,
  PRIMARY KEY (`usuario_idusuario`,`tipo_permisos_idtipo_permisos`),
  KEY `fk_usuario_has_tipo_permisos_tipo_permisos1_idx` (`tipo_permisos_idtipo_permisos`),
  KEY `fk_usuario_has_tipo_permisos_usuario1_idx` (`usuario_idusuario`),
  CONSTRAINT `fk_usuario_has_tipo_permisos_tipo_permisos1` FOREIGN KEY (`tipo_permisos_idtipo_permisos`) REFERENCES `tipo_permisos` (`idtipo_permisos`),
  CONSTRAINT `fk_usuario_has_tipo_permisos_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuario_permiso_sucursal` (
  `idpermiso` int NOT NULL AUTO_INCREMENT,
  `fk_sucursal` int DEFAULT NULL,
  `fk_usuario` int DEFAULT NULL,
  `ventas` tinyint DEFAULT '0',
  `caja1` tinyint DEFAULT '0',
  `deposito_min` tinyint DEFAULT '0',
  `deposito` tinyint DEFAULT '0',
  `caja2` tinyint DEFAULT '0',
  `admin1` tinyint DEFAULT '0',
  `admin2` tinyint DEFAULT '0',
  `laboratorio` tinyint DEFAULT '0',
  `admin_prov` tinyint DEFAULT '0',
  PRIMARY KEY (`idpermiso`),
  UNIQUE KEY `uk` (`fk_sucursal`,`fk_usuario`),
  KEY `fk_permiso_usuario` (`fk_usuario`),
  CONSTRAINT `fk_permiso_sucursal` FOREIGN KEY (`fk_sucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_permiso_usuario` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`idusuario`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `venta` (
  `idventa` int NOT NULL AUTO_INCREMENT,
  `cliente_idcliente` int NOT NULL,
  `sucursal_idsucursal` int NOT NULL,
  `caja_idcaja` int NOT NULL,
  `usuario_idusuario` int NOT NULL,
  `medico_idmedico` int DEFAULT NULL,
  `monto_total` varchar(45) DEFAULT NULL,
  `descuento` varchar(45) DEFAULT NULL,
  `debe` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  `haber` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  `saldo` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_alta` datetime DEFAULT CURRENT_TIMESTAMP,
  `fk_os` int DEFAULT NULL,
  `fecha_retiro` datetime DEFAULT CURRENT_TIMESTAMP,
  `fk_destinatario` int DEFAULT NULL,
  `subtotal` decimal(20,6) DEFAULT NULL,
  `comentarios` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'DIRECTA: "1",\r\nLCLAB: "6",\r\nLCSTOCK: "3",\r\nMONOFLAB: "4",\r\nMULTILAB: "5",\r\nRECSTOCK: "2",',
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'INGRESADO',
  `hora_retiro` varchar(50) DEFAULT NULL,
  `en_laboratorio` int DEFAULT '0',
  `json_items` text,
  `estado_taller` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '//ESTADOS:\r\nPENDIENTE\r\nPEDIDO\r\nCALIBRADO: entra en calibracion, despues de la carga de cristales\r\nTERMINADO\r\n',
  `recarga` decimal(20,6) DEFAULT '0.000000',
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
) ENGINE=InnoDB AUTO_INCREMENT=49160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `venta_has_modo_pago` (
  `id_modopago` int NOT NULL AUTO_INCREMENT,
  `venta_idventa` int NOT NULL,
  `modo_pago_idmodo_pago` int DEFAULT NULL,
  `banco_idbanco` int DEFAULT NULL,
  `mutual_idmutual` int DEFAULT NULL,
  `fk_tarjeta` int DEFAULT NULL,
  `modo_pago` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `monto` decimal(20,6) DEFAULT '0.000000',
  `monto_int` decimal(20,6) DEFAULT '0.000000',
  `cant_cuotas` int DEFAULT '0',
  `monto_cuota` decimal(20,6) DEFAULT '0.000000',
  `pagare_impreso` tinyint DEFAULT '0',
  `tarjeta_nro` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id_modopago`),
  KEY `fk_venta_has_modo_pago_venta1_idx` (`venta_idventa`),
  KEY `fk_venta_has_modo_pago_banco1_idx` (`banco_idbanco`),
  KEY `fk_venta_has_modo_pago_mutual1_idx` (`mutual_idmutual`),
  KEY `fk_venta_has_modo_pago_tarjeta1` (`fk_tarjeta`),
  CONSTRAINT `fk_venta_has_modo_pago_banco1` FOREIGN KEY (`banco_idbanco`) REFERENCES `banco` (`idbanco`),
  CONSTRAINT `fk_venta_has_modo_pago_mutual1` FOREIGN KEY (`mutual_idmutual`) REFERENCES `mutual` (`idmutual`),
  CONSTRAINT `fk_venta_has_modo_pago_tarjeta1` FOREIGN KEY (`fk_tarjeta`) REFERENCES `tarjeta` (`idtarjeta`),
  CONSTRAINT `fk_venta_has_modo_pago_venta1` FOREIGN KEY (`venta_idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=92697 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `venta_has_stock` (
  `idventaitem` int NOT NULL AUTO_INCREMENT,
  `venta_idventa` int NOT NULL,
  `stock_sucursal_idsucursal` int NOT NULL,
  `stock_codigo_idcodigo` int NOT NULL,
  `cantidad` int DEFAULT '0',
  `tipo` varchar(50) DEFAULT NULL,
  `esf` varchar(50) DEFAULT NULL,
  `cil` varchar(50) DEFAULT NULL,
  `eje` varchar(50) DEFAULT NULL,
  `precio` decimal(20,6) DEFAULT '0.000000',
  `total` decimal(20,6) DEFAULT '0.000000',
  `orden` int DEFAULT '0',
  `descontable` int DEFAULT '1',
  `curva_base` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `diametro` varchar(50) DEFAULT NULL,
  `activo` tinyint DEFAULT '1',
  PRIMARY KEY (`idventaitem`),
  KEY `fk_venta_has_stock_stock1_idx` (`stock_sucursal_idsucursal`,`stock_codigo_idcodigo`),
  KEY `fk_venta_has_stock_venta1_idx` (`venta_idventa`),
  CONSTRAINT `fk_venta_has_stock_stock1` FOREIGN KEY (`stock_sucursal_idsucursal`, `stock_codigo_idcodigo`) REFERENCES `stock` (`sucursal_idsucursal`, `codigo_idcodigo`),
  CONSTRAINT `fk_venta_has_stock_venta1` FOREIGN KEY (`venta_idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=111766 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `venta_stock_pedido` (
  `idVtaStockPedido` int NOT NULL AUTO_INCREMENT,
  `fkSucursalPedido` int DEFAULT NULL,
  `fkcodigo` int DEFAULT NULL,
  `fkventa` int DEFAULT NULL,
  `tipo` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  `cantidad` int DEFAULT '1',
  `fechaModif` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `anulado` tinyint DEFAULT '0',
  `estado` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'PENDIENTE' COMMENT '//ESTADOS:\r\nPENDIENTE\r\nPEDIDO\r\nCALIBRADO\r\nTERMINADO\r\n',
  PRIMARY KEY (`idVtaStockPedido`) USING BTREE,
  KEY `fk_pedido_sucursal` (`fkSucursalPedido`) USING BTREE,
  KEY `fk_codigo_pedido` (`fkcodigo`) USING BTREE,
  KEY `fk_venta_pedido` (`fkventa`) USING BTREE,
  CONSTRAINT `fk_codigo_pedido` FOREIGN KEY (`fkcodigo`) REFERENCES `codigo` (`idcodigo`),
  CONSTRAINT `fk_sucursal_pedido` FOREIGN KEY (`fkSucursalPedido`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_venta_pedido` FOREIGN KEY (`fkventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
