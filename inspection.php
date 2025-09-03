<?php
include 'includes/config.php';
include 'includes/header.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id'];
    $car_model = $_POST['car_model'];
    $inspection_type = $_POST['inspection_type'];
    $car_type = $_POST['car_type'];

    $stmt = $pdo->prepare("INSERT INTO inspections (user_id, car_model, inspection_type, car_type) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$user_id, $car_model, $inspection_type, $car_type])) {
        echo "<p>Inspection request submitted!</p>";
    } else {
        echo "<p>Error submitting request.</p>";
    }
}
?>
<main>
    <section class="form-section">
        <h2>Request Inspection</h2>
        <form method="POST">
            <label for="car_model">Car Model:</label>
            <input type="text" id="car_model" name="car_model" required>
            <label for="inspection_type">Inspection Type:</label>
            <select id="inspection_type" name="inspection_type" required>
                <option value="body">Body</option>
                <option value="machinery">Machinery</option>
                <option value="mechanics">Mechanics</option>
                <option value="full">Full</option>
            </select>
            <label for="car_type">Car Type:</label>
            <select id="car_type" name="car_type" required>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
            </select>
            <button type="submit">Submit Request</button>
        </form>
    </section>
</main>
<?php include 'includes/footer.php'; ?>