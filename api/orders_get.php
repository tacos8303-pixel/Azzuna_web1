<?php
require_once 'db.php';

function getOrders() {
    $conn = getDbConnection();
    $sql = "SELECT * FROM orders ORDER BY order_date DESC";
    $result = $conn->query($sql);
    $orders = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }
    
    $conn->close();
    return json_encode($orders);
}

try {
    echo getOrders();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error getting orders', 'message' => $e->getMessage()]);
}
?>