-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.27 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para optica_32
CREATE DATABASE IF NOT EXISTS `optica_32` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `optica_32`;

-- Volcando estructura para tabla optica_32.comentario
CREATE TABLE IF NOT EXISTS `comentario` (
  `idcomentario` int NOT NULL AUTO_INCREMENT,
  `id_ref` int DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `tipo` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `comentario` text,
  `fk_sucursal` int DEFAULT NULL,
  `fk_usuario` int DEFAULT NULL,
  PRIMARY KEY (`idcomentario`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla optica_32.comentario: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
INSERT INTO `comentario` (`idcomentario`, `id_ref`, `fecha`, `tipo`, `comentario`, `fk_sucursal`, `fk_usuario`) VALUES
	(3, 1, '2023-10-11 12:45:46', 'BLOQUEO', '', 14, 4),
	(4, 1, '2023-10-11 12:47:38', 'BLOQUEO', '', 14, 4),
	(5, 1, '2023-10-11 12:50:50', 'BLOQUEO', '', 14, 4),
	(6, 1, '2023-10-11 12:54:36', 'BLOQUEO', '', 14, 4),
	(7, 1, '2023-10-11 12:59:21', 'BLOQUEO', 'dgdsfgdgd', 14, 4);
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
