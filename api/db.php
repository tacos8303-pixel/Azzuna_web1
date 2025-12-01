<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

function getDbConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "azzuna_db"; // El usuario debe crear esta base de datos

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Chequear conexión
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    return $conn;
}
?>