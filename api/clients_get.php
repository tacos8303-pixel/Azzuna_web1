<?php
require_once 'db.php';

function getClients() {
    $conn = getDbConnection();
    $sql = "SELECT id, name, phone FROM clients ORDER BY name ASC"; // Asumiendo campos
    $result = $conn->query($sql);
    $clients = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $clients[] = $row;
        }
    }
    
    $conn->close();
    return json_encode($clients);
}

try {
    echo getClients();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error getting clients', 'message' => $e->getMessage()]);
}
?>