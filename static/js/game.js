document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 480;

    let flickerIntensity = 0;
    let flashIntensity = 0;
    let bloodDrips = [];
    let shadowEntities = [];
    let screenshake = 0;
    let gameTime = 0;

    const background = "#0D0D0D";
    const groundColor = "#2F1B14";

    const marioImg = new Image();
    marioImg.src = "/static/resources/player.png";

    let player = {
        x: 50,
        y: 350,
        w: 80,
        h: 80,
        vy: 0,
        jumping: false,
        health: 100,
        fear: 0
    };

    let keys = {
        left: false,
        right: false,
        up: false,
        down: false
    };

    const gravity = 1;
    const blocks = [
        { x: 100, y: 300, w: 100, h: 20, trigger: true, corrupted: false },
        { x: 250, y: 200, w: 100, h: 20, trigger: false, corrupted: true },
        { x: 400, y: 250, w: 80, h: 20, trigger: false, corrupted: false },
        { x: 500, y: 150, w: 100, h: 20, trigger: false, corrupted: true }
    ];

    for (let i = 0; i < 5; i++) {
        createBloodDrip();
        createShadowEntity();
    }

    function createBloodDrip() {
        bloodDrips.push({
            x: Math.random() * canvas.width,
            y: -10,
            speed: 2 + Math.random() * 3,
            size: 2 + Math.random() * 4
        });
    }

    function createShadowEntity() {
        shadowEntities.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            alpha: 0.3 + Math.random() * 0.4,
            size: 20 + Math.random() * 40,
            speed: 0.5 + Math.random() * 1.5,
            direction: Math.random() * Math.PI * 2
        });
    }

    function drawBlock(b) {
        const shakeX = screenshake > 0 ? (Math.random() - 0.5) * screenshake : 0;
        const shakeY = screenshake > 0 ? (Math.random() - 0.5) * screenshake : 0;

        if (b.corrupted) {
            ctx.fillStyle = `rgb(${Math.floor(Math.random() * 50)}, 0, ${Math.floor(Math.random() * 30)})`;
        } else if (b.trigger) {
            ctx.fillStyle = "#8B0000";
            ctx.shadowColor = "#FF0000";
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = "#3D2B1F";
        }

        ctx.fillRect(b.x + shakeX, b.y + shakeY, b.w, b.h);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(b.x + shakeX, b.y + shakeY, b.w, b.h);
        ctx.shadowBlur = 0;
    }

    function drawPlayer(p) {
        const shakeX = screenshake > 0 ? (Math.random() - 0.5) * screenshake : 0;
        const shakeY = screenshake > 0 ? (Math.random() - 0.5) * screenshake : 0;

        if (marioImg.complete) {
            let alpha = 1;
            if (p.fear >= 100) {
                alpha = 0;
            }
            else if (p.fear >= 50) {
                alpha = 1 - ((p.fear - 50) / 50);
            }
            ctx.globalAlpha = alpha;
            ctx.drawImage(marioImg, p.x + shakeX, p.y + shakeY, p.w, p.h);
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = "#8B0000";
            ctx.fillRect(p.x + shakeX, p.y + shakeY, p.w, p.h);
        }
    }


    function drawHorrorEffects() {
        ctx.fillStyle = "#8B0000";
        bloodDrips.forEach(drip => {
            ctx.beginPath();
            ctx.arc(drip.x, drip.y, drip.size, 0, Math.PI * 2);
            ctx.fill();
        });

        shadowEntities.forEach(entity => {
            ctx.fillStyle = `rgba(0, 0, 0, ${entity.alpha})`;
            ctx.beginPath();
            ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
            ctx.fill();
        });

        if (flickerIntensity > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flickerIntensity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (flashIntensity > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawHUD() {
        // === BARRA SALUTE ===
        ctx.fillStyle = "#006400"; // verde scuro (sfondo)
        ctx.fillRect(10, 10, 200, 20);

        ctx.fillStyle = "#00FF00"; // verde chiaro (valore salute)
        ctx.fillRect(10, 10, (player.health / 100) * 200, 20);

        ctx.strokeStyle = "#000";
        ctx.strokeRect(10, 10, 200, 20);

        // === TESTO SALUTE ===
        ctx.fillStyle = "#000";
        ctx.font = "12px bold Courier New";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`HEALTH ${Math.round(player.health)}%`, 15, 12 + 20 / 2);

        // === BARRA PAURA ===
        ctx.fillStyle = "#4B0082"; // viola scuro (sfondo)
        ctx.fillRect(10, 35, 200, 20);

        ctx.fillStyle = "#8A2BE2"; // viola chiaro (valore fear)
        ctx.fillRect(10, 35, (player.fear / 100) * 200, 20);

        ctx.strokeStyle = "#000";
        ctx.strokeRect(10, 35, 200, 20);

        // === TESTO PAURA ===
        ctx.fillStyle = "#FFF";
        ctx.font = "12px Courier New";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`FEAR ${Math.round(player.fear)}%`, 15, 38 + 15 / 2);
    }

    function draw() {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = groundColor;
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        ctx.fillStyle = "#8B0000";
        for (let i = 0; i < canvas.width; i += 20) {
            if (Math.random() > 0.7) {
                ctx.fillRect(i, canvas.height - 50 + Math.random() * 20, 5, 5);
            }
        }

        blocks.forEach(drawBlock);
        drawPlayer(player);
        drawHorrorEffects();
        drawHUD();
    }

    function update() {
        gameTime++;

        const speed = 4;
        if (keys.left) player.x -= speed;
        if (keys.right) player.x += speed;
        if (keys.up) player.y -= speed;
        if (keys.down) player.y += speed;

        player.vy += gravity;
        player.y += player.vy;

        if (player.y + player.h > canvas.height - 50) {
            player.y = canvas.height - 50 - player.h;
            player.vy = 0;
            player.jumping = false;
        }

        player.fear += 0.03;
        player.fear = Math.min(player.fear, 100);

        blocks.forEach(b => {
            if (
                player.x < b.x + b.w &&
                player.x + player.w > b.x &&
                player.y + player.h > b.y &&
                player.y + player.h < b.y + b.h + 10
            ) {
                player.y = b.y - player.h;
                player.vy = 0;
                player.jumping = false;

                if (b.trigger) {
                    screenshake = 20;
                    flickerIntensity = 0.8;
                    flashIntensity = 1;
                    const flashEffect = setInterval(() => {
                        flashIntensity -= 0.05;
                        if (flashIntensity <= 0) {
                            clearInterval(flashEffect);
                            window.location.href = "/secret";
                        }
                    }, 50);
                }

                if (b.corrupted) {
                    player.fear += 0.5;
                    if (Math.random() > 0.95) {
                        screenshake = 5;
                    }
                }
            }
        });

        flickerIntensity = Math.max(0, flickerIntensity - 0.02);
        screenshake = Math.max(0, screenshake - 0.5);

        if (Math.random() > 0.998) {
            flickerIntensity = Math.random() * 0.3;
            createBloodDrip();
        }

        if (Math.random() > 0.995) {
            createShadowEntity();
        }

        bloodDrips = bloodDrips.filter(drip => {
            drip.y += drip.speed;
            return drip.y < canvas.height;
        });

        shadowEntities = shadowEntities.filter(entity => {
            entity.x += Math.cos(entity.direction) * entity.speed;
            entity.y += Math.sin(entity.direction) * entity.speed;
            entity.alpha -= 0.005;
            return entity.alpha > 0;
        });

        if (player.fear >= 100) {
            showGameOverMessage();
        }

    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    document.addEventListener("keydown", (e) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
            e.preventDefault();
        }

        switch (e.code) {
            case "ArrowLeft":
            case "KeyA":
                keys.left = true;
                break;
            case "ArrowRight":
            case "KeyD":
                keys.right = true;
                break;
            case "ArrowUp":
            case "KeyW":
                keys.up = true;
                break;
            case "ArrowDown":
            case "KeyS":
                keys.down = true;
                break;
            case "Space":
                if (!player.jumping) {
                    player.vy = -15;
                    player.jumping = true;
                }
                break;
        }
    });

    document.addEventListener("keyup", (e) => {
        switch (e.code) {
            case "ArrowLeft":
            case "KeyA":
                keys.left = false;
                break;
            case "ArrowRight":
            case "KeyD":
                keys.right = false;
                break;
            case "ArrowUp":
            case "KeyW":
                keys.up = false;
                break;
            case "ArrowDown":
            case "KeyS":
                keys.down = false;
                break;
        }
    });

    let gameOver = false;
    let gameOverStartTime = null;

    function showGameOverMessage() {
        if (!gameOver) {
            gameOver = true;
            gameOverStartTime = performance.now();
        }

        const now = performance.now();
        const elapsed = now - gameOverStartTime;

        if (elapsed > 2500) {
            window.location.href = "/game_over";
        }
    }

    loop();

});
