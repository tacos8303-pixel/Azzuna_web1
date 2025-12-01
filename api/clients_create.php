<?php
require_once 'db.php';

function createClient($data) {
    if (empty($data)) {
        throw new InvalidArgumentException("Input data is empty");
    }

    $conn = getDbConnection();
    
    // Asumiendo campos
    $name = $data['name'] ?? '';
    $phone = $data['phone'] ?? '';
    $address = $data['address'] ?? '';

    $stmt = $conn->prepare("INSERT INTO clients (name, phone, address) VALUES (?, ?, ?)");
    if (false === $stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sss", $name, $phone, $address);

    $success = $stmt->execute();

    if ($success) {
        $new_client_id = $stmt->insert_id;
        $response = ['message' => 'Client created successfully', 'id' => $new_client_id];
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
        echo createClient($data);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Error creating client', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>