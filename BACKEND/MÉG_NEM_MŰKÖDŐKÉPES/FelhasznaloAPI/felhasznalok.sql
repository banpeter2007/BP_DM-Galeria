CREATE DATABASE IF NOT EXISTS felhasznalok CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE felhasznalok;

CREATE TABLE IF NOT EXISTS adatok (
    id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalonev VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    jelszo VARCHAR(100) NOT NULL,
    telefon VARCHAR(30),
    cim VARCHAR(255)
);