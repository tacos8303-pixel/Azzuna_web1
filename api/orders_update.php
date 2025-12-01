<?php
require_once 'db.php';

function updateOrder($id, $data) {
    if (empty($data) || empty($id)) {
        throw new InvalidArgumentException("Input data or ID is empty");
    }

    $conn = getDbConnection();

    // Asumiendo campos. El usuario deberá ajustarlos.
    $arrangement_id = $data['arrangement_id'] ?? null;
    $client_id = $data['client_id'] ?? null;
    $delivery_date = $data['delivery_date'] ?? null;
    $delivery_address = $data['delivery_address'] ?? '';
    $recipient_name = $data['recipient_name'] ?? '';
    $total_amount = $data['total_amount'] ?? 0;
    $status = $data['status'] ?? 'pending';

    $stmt = $conn->prepare("UPDATE orders SET arrangement_id = ?, client_id = ?, delivery_date = ?, delivery_address = ?, recipient_name = ?, total_amount = ?, status = ? WHERE id = ?");
    if (false === $stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("iisssdsi", $arrangement_id, $client_id, $delivery_date, $delivery_address, $recipient_name, $total_amount, $status, $id);

    $success = $stmt->execute();

    if ($success) {
        if ($stmt->affected_rows > 0) {
            $response = ['message' => 'Order updated successfully'];
        } else {
            $response = ['message' => 'No changes were made to the order'];
        }
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

    return json_encode($response);
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') { // Aceptamos POST para compatibilidad
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID is required']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    try {
        echo updateOrder($id, $data);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Error updating order', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>