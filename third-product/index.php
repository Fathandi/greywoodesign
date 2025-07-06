<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interior Living Room Custom Design</title>
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
                <h2>First Meeting Starts in a Meaningful Living Room</h2>
                <div class="about-content">
                    <div class="about-text">
                        <p>This home renovation project specifically refers to the comprehensive renewal of the existing residence, including the reinforcement of the main structure, the rearrangement of the functional plan on both floors, and the upgrading of materials and vital systems such as lighting, plumbing, and electrical.</p>
                        <p>The main objective was to optimize space utilization, improve comfort, energy efficiency, and overall aesthetics of the house, adapting it to modern needs and the tropical climate, without changing the basic dimensions of the land.</p>
                    </div>
                    <div class="about-image">
                        <img src="../assets/third-product-/third-product-result.png" alt="Modern house design">
                    </div>
                </div>
            </div>
        </section>
        <section class="about-section">
            <div class="container">
                <h2>Stucture Architecture</h2>
                <div class="about-content">
                    <div class="about-image">
                        <img src="../assets/third-product-/third-product-blueprint.png" alt="Modern house design">
                    </div>
                    <div class="about-text">
                        <p>The ±200 m² residence stands on a 10 x 15 meter plot, supported by a reinforced concrete structure with a strong foundation. The ground floor includes a living room, open kitchen, dining room, guest bedroom and bathroom. </p>
                        <p>Lightweight steel roof with concrete flat tiles, natural lighting from large windows, and energy-efficient LED lights. The exterior uses weatherproof paint and natural stone, while the interior has 60x60 cm granite flooring.</p>
                        <p>Plumbing and electrical systems are neatly embedded, with optimal cross ventilation creating a comfortable home in a tropical climate.</p>
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