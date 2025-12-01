<?php
require_once 'db.php';

function createArrangement($data) {
    if (empty($data)) {
        throw new InvalidArgumentException("Input data is empty");
    }

    $conn = getDbConnection();
    
    // Asumiendo campos. El usuario deberá ajustarlos a su tabla.
    $name = $data['name'] ?? 'Custom Arrangement';
    $style = $data['style'] ?? '';
    $size = $data['size'] ?? '';
    $color_palette = $data['color_palette'] ?? '';
    $extras = $data['extras'] ? json_encode($data['extras']) : '';
    $dedication = $data['dedication'] ?? '';
    $price = $data['price'] ?? 0;

    $stmt = $conn->prepare("INSERT INTO arrangements (name, style, size, color_palette, extras, dedication, price) VALUES (?, ?, ?, ?, ?, ?, ?)");
    if (false === $stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssssssd", $name, $style, $size, $color_palette, $extras, $dedication, $price);

    $success = $stmt->execute();

    if ($success) {
        $new_arrangement_id = $stmt->insert_id;
        $response = ['message' => 'Arrangement created successfully', 'id' => $new_arrangement_id];
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
        echo createArrangement($data);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => 'Error creating arrangement', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>