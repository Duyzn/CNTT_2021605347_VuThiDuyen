-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: foodee_app
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Món chính','Các món ăn chính',1),(3,'Đồ uống','Các loại đồ uống\n',1),(4,'snack','bim bim tí..',1),(6,'bom hẹn giờ','hehe',0),(7,'Món tráng miệng','ăn nhẹ trước khi ăn nậng..',1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price_adjustment` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,'Hương vị Matcha',10000.00),(2,'Hương vị Cacao',8000.00),(3,'Hương vị Khoai môn',12000.00),(4,'Size L',7000.00),(5,'Size XL',12000.00),(6,'Thêm trân châu đen',5000.00),(7,'Thêm thạch dừa',5000.00),(8,'Thêm pudding',7000.00),(16,'Vị dừa',1000.00),(17,'Thêm đá bào',3000.00),(18,'Thêm ớt cay tê lưỡi Bình luôn',0.00),(19,'Thêm xúc xích',5000.00);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `base_price` decimal(10,2) NOT NULL,
  `topping_price` decimal(10,2) DEFAULT '0.00',
  `total_price` decimal(10,2) GENERATED ALWAYS AS ((`quantity` * (`base_price` + `topping_price`))) STORED,
  `order_toppings` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `base_price`, `topping_price`, `order_toppings`) VALUES (42,58,19,1,7000.00,0.00,'[]'),(43,58,20,1,7000.00,12000.00,'[{\"id\": 5, \"name\": \"Size XL\", \"price_adjustment\": \"12000.00\"}]'),(44,58,7,1,1000000.00,0.00,'[]'),(45,59,20,1,7000.00,0.00,'[]'),(46,60,19,1,7000.00,0.00,'[]'),(47,60,18,1,15000.00,0.00,'[]'),(48,60,13,1,25000.00,8000.00,'[{\"id\": 2, \"name\": \"Hương vị Cacao\", \"quantity\": 1, \"price_adjustment\": \"8000.00\"}]'),(49,60,10,1,777777.00,0.00,'[]'),(50,60,15,1,12000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}]'),(51,62,19,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}]'),(52,63,19,1,7000.00,12000.00,'[{\"id\": 5, \"name\": \"Size XL\", \"quantity\": 1, \"price_adjustment\": \"12000.00\"}]'),(53,64,19,2,7000.00,0.00,'[]'),(54,64,19,4,7000.00,19000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}, {\"id\": 5, \"name\": \"Size XL\", \"quantity\": 1, \"price_adjustment\": \"12000.00\"}]'),(55,65,19,1,7000.00,0.00,'[]'),(56,65,18,1,15000.00,10000.00,'[{\"id\": 1, \"name\": \"Hương vị Matcha\", \"quantity\": 1, \"price_adjustment\": \"10000.00\"}]'),(57,65,15,1,12000.00,0.00,'[]'),(58,66,19,1,7000.00,0.00,'[]'),(59,67,20,1,7000.00,0.00,'[]'),(60,67,19,1,7000.00,12000.00,'[{\"id\": 5, \"name\": \"Size XL\", \"price_adjustment\": \"12000.00\"}]'),(61,67,15,3,12000.00,19000.00,'[{\"id\": 4, \"name\": \"Size L\", \"price_adjustment\": \"7000.00\"}, {\"id\": 5, \"name\": \"Size XL\", \"price_adjustment\": \"12000.00\"}]'),(62,68,19,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}]'),(63,69,4,1,5555.00,0.00,'[]'),(64,69,19,1,7000.00,0.00,'[]'),(65,70,4,1,5555.00,0.00,'[]'),(66,70,5,1,5555.00,0.00,'[]'),(67,70,18,2,15000.00,8000.00,'[{\"id\": 2, \"name\": \"Hương vị Cacao\", \"price_adjustment\": \"8000.00\"}]'),(68,71,4,1,5555.00,0.00,'[]'),(69,71,1,1,100000.00,0.00,'[]'),(70,72,20,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}]'),(71,73,21,2,25000.00,0.00,'[]'),(72,73,20,1,7000.00,0.00,'[]'),(73,73,19,1,7000.00,0.00,'[]'),(74,73,18,1,15000.00,0.00,'[]'),(75,73,15,1,12000.00,0.00,'[]'),(76,74,20,1,7000.00,19000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}, {\"id\": 5, \"name\": \"Size XL\", \"quantity\": 1, \"price_adjustment\": \"12000.00\"}]'),(77,74,19,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}]'),(78,75,20,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"quantity\": 1, \"price_adjustment\": \"7000.00\"}]'),(79,76,20,1,7000.00,0.00,'[]'),(102,93,20,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"price_adjustment\": \"7000.00\"}]'),(103,106,20,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"price_adjustment\": \"7000.00\"}]'),(104,107,20,1,7000.00,12000.00,'[{\"id\": 5, \"name\": \"Size XL\", \"price_adjustment\": \"12000.00\"}]'),(105,107,21,1,25000.00,7000.00,'[{\"id\": 8, \"name\": \"Thêm pudding\", \"price_adjustment\": \"7000.00\"}]'),(106,107,18,1,15000.00,12000.00,'[{\"id\": 3, \"name\": \"Hương vị Khoai môn\", \"price_adjustment\": \"12000.00\"}]'),(107,108,19,1,7000.00,7000.00,'[{\"id\": 4, \"name\": \"Size L\", \"price_adjustment\": \"7000.00\"}]'),(108,108,20,1,7000.00,0.00,'[]'),(109,108,18,1,15000.00,0.00,'[]'),(110,108,5,1,5555.00,0.00,'[]'),(111,108,4,1,5555.00,0.00,'[]'),(112,108,6,1,9999.00,0.00,'[]'),(113,109,20,1,7000.00,0.00,'[]'),(114,109,21,1,25000.00,0.00,'[]'),(115,110,21,1,25000.00,5000.00,'[{\"id\": 19, \"name\": \"Thêm xúc xích\", \"price_adjustment\": \"5000.00\"}]'),(116,110,19,3,7000.00,0.00,'[{\"id\": 18, \"name\": \"Thêm ớt cay tê lưỡi Bình luôn\", \"price_adjustment\": \"0.00\"}]'),(117,111,20,1,7000.00,0.00,'[]'),(118,111,20,1,7000.00,12000.00,'[{\"id\": 5, \"name\": \"Size XL\", \"quantity\": 1, \"price_adjustment\": \"12000.00\"}]'),(119,111,21,1,25000.00,12000.00,'[{\"id\": 3, \"name\": \"Hương vị Khoai môn\", \"quantity\": 1, \"price_adjustment\": \"12000.00\"}]'),(120,112,21,1,25000.00,1000.00,'[{\"id\": 16, \"name\": \"Vị dừa\", \"price_adjustment\": \"1000.00\"}]'),(121,112,19,1,7000.00,0.00,'[]'),(122,112,10,1,777777.00,0.00,'[]'),(123,113,21,1,25000.00,7000.00,'[{\"id\": 8, \"name\": \"Thêm pudding\", \"price_adjustment\": \"7000.00\"}]'),(124,113,19,1,7000.00,0.00,'[]'),(125,114,22,3,7000.00,0.00,'[]'),(126,114,21,1,25000.00,0.00,'[]'),(127,114,18,1,15000.00,10000.00,'[{\"id\": 1, \"name\": \"Hương vị Matcha\", \"quantity\": 1, \"price_adjustment\": \"10000.00\"}]'),(128,114,20,1,7000.00,0.00,'[]'),(129,114,22,1,7000.00,10000.00,'[{\"id\": 1, \"name\": \"Hương vị Matcha\", \"quantity\": 1, \"price_adjustment\": \"10000.00\"}]'),(130,115,21,1,25000.00,1000.00,'[{\"id\": 16, \"name\": \"Vị dừa\", \"quantity\": 1, \"price_adjustment\": \"1000.00\"}]'),(131,115,20,1,7000.00,0.00,'[]'),(132,115,15,1,12000.00,0.00,'[]'),(133,116,22,1,7000.00,0.00,'[]'),(134,116,21,1,25000.00,0.00,'[]'),(135,117,22,1,7000.00,0.00,'[]'),(136,117,22,1,7000.00,8000.00,'[{\"id\": 2, \"name\": \"Hương vị Cacao\", \"quantity\": 1, \"price_adjustment\": \"8000.00\"}]'),(137,118,21,1,25000.00,0.00,'[]'),(138,119,22,1,7000.00,0.00,'[]'),(139,119,21,1,25000.00,12000.00,'[{\"id\": 3, \"name\": \"Hương vị Khoai môn\", \"quantity\": 1, \"price_adjustment\": \"12000.00\"}]');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_id` int NOT NULL,
  `order_code` varchar(50) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed') DEFAULT 'pending',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `selected_options` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `orders_table_id_fk` (`table_id`),
  CONSTRAINT `orders_table_id_fk` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (58,2,'ORD1734311214865',1014000.00,'completed',NULL,'2024-12-16 01:06:54',NULL),(59,1,'ORD1734311235403',7000.00,'completed',NULL,'2024-12-16 01:07:15',NULL),(60,1,'ORD1734319829054',836777.02,'completed',NULL,'2024-12-16 03:30:29',NULL),(61,1,'ORD1734320297047',0.00,'pending',NULL,'2024-12-16 03:38:17',NULL),(62,1,'ORD1734320354889',7000.01,'pending',NULL,'2024-12-16 03:39:14',NULL),(63,1,'ORD1734322413537',7000.00,'pending',NULL,'2024-12-16 04:13:33',NULL),(64,8,'ORD1734323472644',42000.01,'pending',NULL,'2024-12-16 04:31:12',NULL),(65,3,'ORD1734323540639',34000.00,'pending',NULL,'2024-12-16 04:32:20',NULL),(66,1,'ORD1734324149623',7000.00,'pending',NULL,'2024-12-16 04:42:29',NULL),(67,2,'ORD1734324455366',50000.01,'completed',NULL,'2024-12-16 04:47:35',NULL),(68,8,'ORD1734325544476',7000.01,'pending',NULL,'2024-12-16 05:05:44',NULL),(69,2,'ORD1734327096748',12555.00,'pending',NULL,'2024-12-16 05:31:36',NULL),(70,6,'ORD1734327175392',41110.02,'pending',NULL,'2024-12-16 05:32:55',NULL),(71,3,'ORD1734327328738',105555.00,'pending',NULL,'2024-12-16 05:35:28',NULL),(72,8,'ORD1734327397743',7000.01,'pending',NULL,'2024-12-16 05:36:37',NULL),(73,8,'ORD1734343957717',91000.00,'pending',NULL,'2024-12-16 10:12:37',NULL),(74,8,'ORD1734343987095',14000.01,'pending',NULL,'2024-12-16 10:13:07',NULL),(75,8,'ORD1734346589649',7000.01,'completed',NULL,'2024-12-16 10:56:29',NULL),(76,8,'ORD1734346756634',7000.00,'completed',NULL,'2024-12-16 10:59:16',NULL),(77,1,'ORD004',250000.00,'completed',NULL,'2024-11-15 10:00:00',NULL),(78,2,'ORD005',180000.00,'completed',NULL,'2024-11-20 11:30:00',NULL),(79,3,'ORD006',320000.00,'completed',NULL,'2024-10-05 14:20:00',NULL),(81,2,'ORD008',420000.00,'completed',NULL,'2024-09-10 12:30:00',NULL),(85,1,'ORD077',250000.00,'completed',NULL,'2024-11-15 10:00:00',NULL),(86,2,'ORD078',180000.00,'completed',NULL,'2024-11-20 11:30:00',NULL),(87,3,'ORD079',320000.00,'completed',NULL,'2024-10-05 14:20:00',NULL),(88,1,'ORD080',150000.00,'completed',NULL,'2024-10-15 16:45:00',NULL),(89,2,'ORD081',420000.00,'completed',NULL,'2024-09-10 12:30:00',NULL),(90,3,'ORD082',280000.00,'completed',NULL,'2024-09-25 18:15:00',NULL),(91,1,'ORD083',190000.00,'completed',NULL,'2024-08-05 13:40:00',NULL),(92,2,'ORD084',350000.00,'completed',NULL,'2024-08-20 15:20:00',NULL),(93,2,'ORD1734350799009',7000.01,'completed',NULL,'2024-12-16 12:06:39',NULL),(94,1,'ORD085',350000.00,'completed',NULL,'2024-12-01 10:00:00',NULL),(95,2,'ORD086',420000.00,'completed',NULL,'2024-12-05 11:30:00',NULL),(96,3,'ORD087',280000.00,'completed',NULL,'2024-11-10 14:20:00',NULL),(97,1,'ORD088',520000.00,'completed',NULL,'2024-11-15 16:45:00',NULL),(98,2,'ORD089',180000.00,'completed',NULL,'2024-10-20 12:30:00',NULL),(99,3,'ORD090',670000.00,'completed',NULL,'2024-10-25 18:15:00',NULL),(100,1,'ORD091',440000.00,'completed',NULL,'2024-09-05 13:40:00',NULL),(101,2,'ORD092',290000.00,'completed',NULL,'2024-09-20 15:20:00',NULL),(102,3,'ORD093',380000.00,'completed',NULL,'2024-08-10 11:00:00',NULL),(103,1,'ORD094',550000.00,'completed',NULL,'2024-08-15 14:30:00',NULL),(104,2,'ORD08666',180000.00,'completed',NULL,'2024-10-20 12:30:00',NULL),(105,3,'ORD02323',670000.00,'completed',NULL,'2024-10-25 18:15:00',NULL),(106,6,'ORD1734363801906',7000.01,'pending',NULL,'2024-12-16 15:43:21',NULL),(107,7,'ORD1734365319807',47000.01,'pending',NULL,'2024-12-16 16:08:39',NULL),(108,3,'ORD1734365780277',50109.01,'completed',NULL,'2024-12-16 16:16:20',NULL),(109,3,'ORD1734366289885',32000.00,'completed',NULL,'2024-12-16 16:24:49',NULL),(110,3,'ORD1734367517180',46000.01,'pending',NULL,'2024-12-16 16:45:17',NULL),(111,7,'ORD1734368257004',39000.00,'completed',NULL,'2024-12-16 16:57:37',NULL),(112,3,'ORD1734372142280',809777.00,'pending',NULL,'2024-12-16 18:02:22',NULL),(113,2,'ORD1734375917526',32000.01,'pending',NULL,'2024-12-16 19:05:17',NULL),(114,7,'ORD1734376968021',75000.00,'pending',NULL,'2024-12-16 19:22:48',NULL),(115,7,'ORD1734377139221',44000.00,'pending',NULL,'2024-12-16 19:25:39',NULL),(116,7,'ORD1734377242069',32000.00,'pending',NULL,'2024-12-16 19:27:22',NULL),(117,7,'ORD1734401982684',14000.01,'pending',NULL,'2024-12-17 02:19:42',NULL),(118,7,'ORD1734405423679',25000.00,'pending',NULL,'2024-12-17 03:17:03',NULL),(119,7,'ORD1734407395389',32000.00,'pending',NULL,'2024-12-17 03:49:55',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_options`
--

DROP TABLE IF EXISTS `product_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_options` (
  `product_id` int NOT NULL,
  `option_id` int NOT NULL,
  PRIMARY KEY (`product_id`,`option_id`),
  KEY `option_id` (`option_id`),
  CONSTRAINT `product_options_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_options_ibfk_2` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_options`
--

LOCK TABLES `product_options` WRITE;
/*!40000 ALTER TABLE `product_options` DISABLE KEYS */;
INSERT INTO `product_options` VALUES (9,1),(11,1),(18,1),(22,1),(12,2),(13,2),(18,2),(22,2),(9,3),(12,3),(13,3),(18,3),(21,3),(22,3),(11,4),(15,4),(18,4),(19,4),(20,4),(22,4),(11,5),(15,5),(19,5),(20,5),(22,5),(11,6),(22,6),(11,7),(22,7),(11,8),(21,8),(21,16),(22,16),(15,18),(19,18),(20,18),(21,19),(22,19);
/*!40000 ALTER TABLE `product_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,3,'3','rtfhhthrt',100000.00,'product-1733279806840.jpg',1,'2024-12-03 18:12:43'),(4,3,'1','fgfgfg',5555.00,'product-1733251304440.jpg',1,'2024-12-03 18:41:44'),(5,3,'2','fgfgfg',5555.00,'product-1733251315370.jpg',1,'2024-12-03 18:41:55'),(6,3,'4','rất là tươi và hấp dẫn',9999.00,'product-1733277919029.jpg',1,'2024-12-04 02:05:19'),(7,1,'5','ngon',1000000.00,'product-1733278621499.jpg',1,'2024-12-04 02:17:01'),(9,3,'6','',343232.00,'product-1733282100561.jpg',1,'2024-12-04 03:15:00'),(10,1,'7','',777777.00,'product-1733478373565.jpg',1,'2024-12-06 09:46:13'),(11,3,'Trà sữa','Trà sữa truyền thống',25000.00,'product-1733480678854.jpg',0,'2024-12-06 10:23:35'),(12,3,'8','',232323.00,'product-1733499769967.jpg',0,'2024-12-06 15:42:50'),(13,1,'test 7.12','hehee',25000.00,'product-1733543084652.jpg',1,'2024-12-07 03:44:44'),(15,4,'lạp xưởng nướng đá','ngon',12000.00,'product-1733913420378.jpg',1,'2024-12-07 03:52:03'),(18,1,'ngô nướng','rất ngon hấp dẫn người nhìn',15000.00,'product-1733883071198.jpg',1,'2024-12-11 02:11:11'),(19,4,'Bánh chuối','Bánh chuối là một loại bánh được chế biến bằng cách sử dụng chuối làm thành phần chính, cùng với những nguyên liệu làm bánh thông thường. Món ăn có thể được chế biến dưới nhiều hình dạng khác nhau, chẳng hạn như bánh nhiều lớp, như bánh muffin và cupcake.',7000.00,'product-1734100904269.jpg',1,'2024-12-13 14:41:44'),(20,4,'Bánh khoai','Bánh khoái là bánh bột chiên của xứ Huế, cách chế biến cũng khá giống bánh xèo nhưng dạng bánh có hình tròn theo dạng của khuôn đổ, bánh được làm từ bột gạo, có nhân tôm, giò, giá đỗ ở trên. Thông thường người ta hay ăn kèm với rau sống, nước chấm sền sệt và có vị bùi bùi.',7000.00,'product-1734236454033.jpg',1,'2024-12-15 04:20:54'),(21,7,'Bánh đa trộn hehee','Mặc dù tìm đường đi không dễ, nhưng quán bánh đa trộn nem chua trong khu Vĩnh Phúc, Ba Đình, thường được giới trẻ Hà Nội tìm đến. Thông thường, món ăn này là sự kết hợp của bánh đa chần qua nước canh riêu, thêm giò, đậu rán, chả cá, rau muống, cần tây. Món ăn được rắc thêm chút lạc rang, hành phi bên trên, rồi trộn chung với xì dầu và gia vị. Khi ăn bánh đa trộn, thực khách được phục vụ một bát nước dùng cua thanh nhẹ. Đặc biệt, sợi bánh đa được chần qua phải mềm mà vẫn dai dai, không nát.',25000.00,'product-1734325750166.jpg',1,'2024-12-16 05:09:10'),(22,1,'Bánh trung thu','Bánh trung thu là một loại bánh thường được ăn trong dịp Trung thu có nguồn gốc từ Trung Quốc nhưng các nước, các vùng có những biến thể khác nhau. Ở Việt Nam nó được chỉ cho loại bánh nướng và bánh dẻo có nhân ngọt thường được dùng trong dịp Tết Trung thu. Bánh trung thu thường có dạng hình tròn (đường kính khoảng 10 cm) hay hình vuông (chiều dài cạnh khoảng 7–8 cm), chiều cao khoảng 4–5 cm, không loại trừ các kích cỡ to hơn, thậm chí khổng lồ.[1] Ngoài ra, bánh trung thu còn có nhiều kiểu dáng khác nhưng phổ biến hơn là kiểu lợn mẹ với đàn con, cá chép.',7000.00,'product-1734369087537.jpg',1,'2024-12-16 17:11:27');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_number` varchar(20) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `status` enum('available','maintenance') DEFAULT 'available',
  `position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_number` (`table_number`),
  UNIQUE KEY `qr_code` (`qr_code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES (1,'CASH','qr_code_cash','available',7),(2,'T001','qr_code_t001','available',9),(3,'T002','qr_code_t002','available',5),(4,'T003','qr_code_t003','available',4),(6,'T004','qr_code_t004','available',8),(7,'T005','qr_code_t005','available',0),(8,'T006','qr_code_t006','available',1);
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(64) NOT NULL,
  `role` enum('admin','staff','kitchen') NOT NULL DEFAULT 'staff',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin','6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b','admin'),('admin2','6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b','admin'),('kitchen','6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b','kitchen'),('staff1','6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b','staff');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-17 10:43:30
