<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Construction New House</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../style/navbar.css">
    <link rel="stylesheet" href="../style/footer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="icon" href="../favicon.ico" type="image/x-icon">
</head>

<body>
    <?php include "../navbar.html"; ?>

    <main class="content">
        <section class="about-section secondary">
            <div class="container">
                <h2>Modern Tropical Oasis for Young Families</h2>
                <div class="about-content">
                    <div class="about-text">
                        <p>This two-story residence, conceived with a modern tropical concept, is meticulously crafted for young families seeking a harmonious blend of comfort and functionality within the bustling city. The design prioritizes natural lighting and cross-ventilation, ensuring a perpetually cool and bright atmosphere throughout the day, significantly reducing the need for artificial cooling.</p>
                        <p>The minimalist facade, subtly accented with warm wood elements, exudes an elegant yet inviting impression. Every inch of this home is thoughtfully engineered for maximized utility and spatial efficiency, guaranteeing long-term comfort. This makes it an ideal and sustainable choice for families embracing a contemporary, modern lifestyle.</p>
                    </div>
                    <div class="about-image">
                        <img src="../assets/first-product-/first-product-result.png" alt="Modern house design">
                    </div>
                </div>
            </div>
        </section>
        <section class="about-section">
            <div class="container">
                <h2>Stucture Architecture</h2>
                <div class="about-content">
                    <div class="about-image">
                        <img src="../assets/first-product-/first-product-blueprint.png" alt="Modern house design">
                    </div>
                    <div class="about-text">
                        <p>The house has a built-up area of 120 m² and sits on a 100 m² plot of land. Consisting of two floors, the house is equipped with three spacious bedrooms and two bathrooms designed with high space efficiency.</p>
                        <p>The open kitchen blends directly into the dining area, giving it a spacious and modern feel. There is a carport enough for one car in the front area of the house. The water system uses PDAM, and a standard 2200 watt electrical installation from PLN.</p>
                        <p>The main structure of the house is built using light brick and light steel roof with elegant granite tile finishing, ensuring strength as well as aesthetics.</p>
                    </div>
                </div>
                <button class="cta-button secondary-button" onclick="redirectToHome()">Kembali</button>
            </div>
        </section>
    </main>

    <?php include "../footer.html"; ?>

    <script src="../script/navbar.js"></script>
    <script src="../script/auth.js"></script>
    <script>
        function redirectToHome() {
            window.location.href = "../index.php";
        }
    </script>
</body>

</html>