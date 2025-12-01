<?php
require_once 'db.php';

function deleteOrder($id) {
    if (empty($id)) {
        throw new InvalidArgumentException("Order ID is empty");
    }

    $conn = getDbConnection();

    $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
    if (false === $stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $id);

    $success = $stmt->execute();

    if ($success) {
        if ($stmt->affected_rows > 0) {
            $response = ['message' => 'Order deleted successfully'];
        } else {
            http_response_code(404);
            $response = ['message' => 'Order not found or already deleted'];
        }
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

    return json_encode($response);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || $_SERVER['REQUEST_METHOD'] === 'GET') { // Aceptamos GET para compatibilidad
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Order ID is required']);
        exit;
    }

    try {
        echo deleteOrder($id);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error deleting order', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>