<?php
// Perform server-side validation

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve form data
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $confirmPassword = $_POST["confirm_password"];

    // Validate name
    if (empty($name)) {
        die("Error: Name is required.");
    }

    // Validate email
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Error: Please provide a valid email address.");
    }

    // Validate password
    if (empty($password)) {
        die("Error: Password is required.");
    }

    // Validate password confirmation
    if ($password !== $confirmPassword) {
        die("Error: Password and Confirm Password do not match.");
    }

    // Further validation and processing can be added as needed

    // If validation is successful, proceed with storing the data or other actions
    // For demonstration purposes, you might want to redirect to a success page
    header("Location: signup_success.php");
    exit();
} else {
    // Handle cases where the form is not submitted via POST
    die("Error: Invalid form submission.");
}
?>
