<?php
include 'includes/config.php';
include 'includes/header.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT * FROM inspections WHERE user_id = ?");
$stmt->execute([$user_id]);
$inspections = $stmt->fetchAll();
?>
<main>
    <section>
        <h2>Your Dashboard</h2>
        <h3>Your Inspection Requests</h3>
        <table>
            <tr>
                <th>Car Model</th>
                <th>Inspection Type</th>
                <th>Car Type</th>
                <th>Status</th>
            </tr>
            <?php foreach ($inspections as $inspection): ?>
                <tr>
                    <td><?php echo htmlspecialchars($inspection['car_model']); ?></td>
                    <td><?php echo htmlspecialchars($inspection['inspection_type']); ?></td>
                    <td><?php echo htmlspecialchars($inspection['car_type']); ?></td>
                    <td><?php echo htmlspecialchars($inspection['status']); ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    </section>
</main>
<?php include 'includes/footer.php'; ?>