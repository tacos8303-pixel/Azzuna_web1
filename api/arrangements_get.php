<?php
require_once 'db.php';

function getArrangements() {
    $conn = getDbConnection();
    $sql = "SELECT * FROM arrangements"; // Asumiendo campos
    $result = $conn->query($sql);
    $arrangements = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $arrangements[] = $row;
        }
    }
    
    $conn->close();
    return json_encode($arrangements);
}

try {
    echo getArrangements();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error getting arrangements', 'message' => $e->getMessage()]);
}
?>