<?php
require_once 'db.php';

function createOrder($data) {
    if (empty($data)) {
        throw new InvalidArgumentException("Input data is empty");
    }

    $conn = getDbConnection();
    
    // Asumiendo que estos son los campos. El usuario deberá ajustarlos a su tabla.
    $arrangement_id = $data['arrangement_id'] ?? null;
    $client_id = $data['client_id'] ?? null;
    $delivery_date = $data['delivery_date'] ?? null;
    $delivery_address = $data['delivery_address'] ?? '';
    $recipient_name = $data['recipient_name'] ?? '';
    $total_amount = $data['total_amount'] ?? 0;
    $status = $data['status'] ?? 'pending';

    $stmt = $conn->prepare("INSERT INTO orders (arrangement_id, client_id, delivery_date, delivery_address, recipient_name, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    if (false === $stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("iisssds", $arrangement_id, $client_id, $delivery_date, $delivery_address, $recipient_name, $total_amount, $status);

    $success = $stmt->execute();

    if ($success) {
        $new_order_id = $stmt->insert_id;
        $response = ['message' => 'Order created successfully', 'id' => $new_order_id];
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

    return json_encode($response);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    try {
        echo createOrder($data);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Error creating order', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>