<?php
require_once 'includes/config.php';
require_once 'includes/header.php';

$pageTitle = "Contact Us";
$success = false;
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $subject = trim($_POST['subject']);
    $message = trim($_POST['message']);

    // Validation
    if (empty($name)) $errors[] = "Name is required";
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
    if (empty($subject)) $errors[] = "Subject is required";
    if (empty($message)) $errors[] = "Message is required";

    if (empty($errors)) {
        // In a real application, you would send an email here
        $success = true;
    }
}
?>

<div class="row">
    <div class="col-md-6">
        <h1>Contact Macsue Car Inspections</h1>
        <p>Have questions or need assistance? Fill out the form below and we'll get back to you as soon as possible.</p>
        
        <?php if ($success): ?>
            <div class="alert alert-success">
                <h4>Thank You!</h4>
                <p>Your message has been sent successfully. We'll respond to you shortly.</p>
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
                <div class="mb-3">
                    <label for="name" class="form-label">Your Name</label>
                    <input type="text" class="form-control" id="name" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number (Optional)</label>
                   