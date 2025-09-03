<?php
include 'includes/config.php';
include 'includes/header.php';

$stmt = $pdo->prepare("SELECT * FROM pricing");
$stmt->execute();
$prices = $stmt->fetchAll();
?>
<main>
    <section>
        <h2>Inspection Pricing</h2>
        <table>
            <tr>
                <th>Car Type</th>
                <th>Inspection Type</th>
                <th>Price</th>
            </tr>
            <?php foreach ($prices as $price): ?>
                <tr>
                    <td><?php echo htmlspecialchars($price['car_type']); ?></td>
                    <td><?php echo htmlspecialchars($price['inspection_type']); ?></td>
                    <td>$<?php echo number_format($price['price'], 2); ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    </section>
</main>
<?php include 'includes/footer.php'; ?>