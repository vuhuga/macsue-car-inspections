<?php
require_once 'includes/config.php';
require_once 'includes/header.php';

if (!isLoggedIn()) {
    redirect('login.php');
}

$pageTitle = "Book Inspection";
$errors = [];
$success = false;

// Get inspection type from URL if specified
$inspectionType = $_GET['type'] ?? '';

// Get prices
$stmt = $pdo->query("SELECT * FROM prices");
$prices = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $carMake = trim($_POST['car_make']);
    $carModel = trim($_POST['car_model']);
    $carYear = trim($_POST['car_year']);
    $carType = trim($_POST['car_type']);
    $inspectionType = trim($_POST['inspection_type']);
    $appointmentDate = trim($_POST['appointment_date']);
    $appointmentTime = trim($_POST['appointment_time']);
    $notes = trim($_POST['notes']);

    // Validation
    if (empty($carMake)) $errors[] = "Car make is required";
    if (empty($carModel)) $errors[] = "Car model is required";
    if (empty($carYear) || !is_numeric($carYear)) $errors[] = "Valid car year is required";
    if (empty($carType)) $errors[] = "Car type is required";
    if (empty($inspectionType)) $errors[] = "Inspection type is required";
    if (empty($appointmentDate)) $errors[] = "Appointment date is required";
    if (empty($appointmentTime)) $errors[] = "Appointment time is required";

    // Check if date is in the future
    if (strtotime($appointmentDate) < strtotime('today')) {
        $errors[] = "Appointment date must be in the future";
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare("INSERT INTO inspections (car_make, car_model, car_year, inspection_type, appointment_date, appointment_time, user_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$carMake, $carModel, $carYear, $inspectionType, $appointmentDate, $appointmentTime, $_SESSION['user_id'], $notes])) {
            $success = true;
        } else {
            $errors[] = "Failed to book inspection. Please try again.";
        }
    }
}
?>

<div class="row">
    <div class="col-md-8">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h3 class="mb-0">Book Your Inspection</h3>
            </div>
            <div class="card-body">
                <?php if ($success): ?>
                    <div class="alert alert-success">
                        <h4>Inspection Booked Successfully!</h4>
                        <p>Your inspection has been scheduled. We've sent a confirmation to your email.</p>
                        <a href="dashboard.php" class="btn btn-primary">View Your Appointments</a>
                    </div>
                <?php else: ?>
                    <?php if (!empty($errors)): ?>
                        <div class="alert alert-danger">
                            <?php foreach ($errors as $error): ?>
                                <p><?php echo $error; ?></p>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <form method="post">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="car_make" class="form-label">Car Make</label>
                                <input type="text" class="form-control" id="car_make" name="car_make" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="car_model" class="form-label">Car Model</label>
                                <input type="text" class="form-control" id="car_model" name="car_model" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="car_year" class="form-label">Year</label>
                                <input type="number" class="form-control" id="car_year" name="car_year" min="1900" max="<?php echo date('Y') + 1; ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="car_type" class="form-label">Car Type</label>
                                <select class="form-select" id="car_type" name="car_type" required>
                                    <option value="">Select...</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                    <option value="truck">Truck</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="inspection_type" class="form-label">Inspection Type</label>
                            <select class="form-select" id="inspection_type" name="inspection_type" required>
                                <option value="">Select...</option>
                                <option value="body" <?php echo $inspectionType === 'body' ? 'selected' : ''; ?>>Body Inspection</option>
                                <option value="mechanical" <?php echo $inspectionType === 'mechanical' ? 'selected' : ''; ?>>Mechanical Inspection</option>
                                <option value="full" <?php echo $inspectionType === 'full' ? 'selected' : ''; ?>>Full Inspection</option>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="appointment_date" class="form-label">Appointment Date</label>
                                <input type="date" class="form-control" id="appointment_date" name="appointment_date" min="<?php echo date('Y-m-d'); ?>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="appointment_time" class="form-label">Appointment Time</label>
                                <select class="form-select" id="appointment_time" name="appointment_time" required>
                                    <option value="">Select...</option>
                                    <option value="09:00:00">9:00 AM</option>
                                    <option value="10:00:00">10:00 AM</option>
                                    <option value="11:00:00">11:00 AM</option>
                                    <option value="12:00:00">12:00 PM</option>
                                    <option value="13:00:00">1:00 PM</option>
                                    <option value="14:00:00">2:00 PM</option>
                                    <option value="15:00:00">3:00 PM</option>
                                    <option value="16:00:00">4:00 PM</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="notes" class="form-label">Special Notes</label>
                            <textarea class="form-control" id="notes" name="notes" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Book Inspection</button>
                    </form>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card mb-4">
            <div class="card-header bg-info text-white">
                <h4 class="mb-0">Pricing Information</h4>
            </div>
            <div class="card-body">
                <div id="priceDisplay">
                    <p class="text-muted">Select car type and inspection type to see price</p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header bg-info text-white">
                <h4 class="mb-0">What to Expect</h4>
            </div>
            <div class="card-body">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><i class="fas fa-clock me-2"></i> 1-2 hour inspection</li>
                    <li class="list-group-item"><i class="fas fa-file-alt me-2"></i> Detailed report</li>
                    <li class="list-group-item"><i class="fas fa-images me-2"></i> Photos of any issues</li>
                    <li class="list-group-item"><i class="fas fa-phone me-2"></i> Follow-up consultation</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const carTypeSelect = document.getElementById('car_type');
    const inspectionTypeSelect = document.getElementById('inspection_type');
    const priceDisplay = document.getElementById('priceDisplay');
    
    function updatePriceDisplay() {
        const carType = carTypeSelect.value;
        const inspectionType = inspectionTypeSelect.value;
        
        if (carType && inspectionType) {
            // In a real app, you would fetch this from the server
            const prices = {
                sedan: { body: 49.99, mechanical: 79.99, full: 119.99 },
                suv: { body: 59.99, mechanical: 89.99, full: 139.99 },
                truck: { body: 69.99, mechanical: 99.99, full: 159.99 },
                other: { body: 79.99, mechanical: 109.99, full: 179.99 }
            };
            
            const price = prices[carType][inspectionType];
            priceDisplay.innerHTML = `
                <h4>Estimated Cost: <span class="text-primary">$${price.toFixed(2)}</span></h4>
                <small class="text-muted">Final price may vary based on vehicle specifics</small>
            `;
        } else {
            priceDisplay.innerHTML = '<p class="text-muted">Select car type and inspection type to see price</p>';
        }
    }
    
    carTypeSelect.addEventListener('change', updatePriceDisplay);
    inspectionTypeSelect.addEventListener('change', updatePriceDisplay);
    
    // Initial update if values are preselected
    updatePriceDisplay();
});
</script>

<?php require_once 'includes/footer.php'; ?>