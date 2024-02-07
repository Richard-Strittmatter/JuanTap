/**
 * The game scene
 */
export function gameScene() {
    loadSprite("bean", "sprites/bean.png")
    loadSprite("tumbleweed", "sprites/tumbleweed.png")
    loadSprite("plattform", "sprites/plattform.png")
    loadSprite("background", "sprites/desert.png");
    loadSprite("cactus", "sprites/cactus.png");
    loadSprite("rock", "sprites/rock.png");
    loadSprite("jump", "sprites/jump.png");

    loadSprite("playerRun", [
        "sprites/walk2.png",
        "sprites/walk3.png",
        "sprites/walk4.png",
    ], {
        sliceX: 3,
        anims: {
            run: {
                from: 0,
                to: 2,
                loop: true,
                speed: 20,
            },
        },
    });


    let gameState = {
        score: 0,
        speed: 400,
    };

    scene("game", () => {
        // Set scene background
        setBackground();

        setGravity(1600)

        // putting together our player character
        const player = add([
            sprite("playerRun"),
            pos(300, 40),
            scale(0.5),
            area({
                scale: 0.6,
                offset: vec2(0, +48)
            }),
            anchor("center"),
            body(),
        ])
        player.play("run");

        setPlayerMovement(player, gameState)
        calculateScore(player, gameState);
        spawnObstacles(gameState);
        createMovingPlatform(gameState)
    });
}

function setBackground() {
    add([
        sprite("background"),
        pos(width() / 2, height() / 2),
        anchor("center"),
        scale(1.07),
        fixed()
    ]);
}

/**
 * Define player movement
 *
 * @param player The player constant
 * @param gameState
 */
function setPlayerMovement(player, gameState) { // 'player' als Parameter
    const normalGravity = 1600;
    const increasedGravity = 4000;
    let jumps = 0;

    let playerState = "running";

    // Allow double jumps if score is > 10
    onKeyPress("space", () => {
        if (player.isGrounded() || (jumps < 2 && gameState.score > 10)) {
            player.jump();
            jumps++;
            playerState = "jumping";
            player.use(sprite("jump"));
            player.use(
                area({
                    scale: 0.5,
                    offset: vec2(0, +53)
                }));
        }
    });

    // Reset after jumping
    player.onUpdate(() => {
        if (player.isGrounded()) {
            jumps = 0;
            if (playerState !== "running") {
                playerState = "running";
                player.use(sprite("playerRun"));
                player.play("run");
            }
        }
    });

    onKeyDown("left", () => {
        player.move(-450, 0);
    });

    onKeyDown("right", () => {
        player.move(450, 0);
    });

    onKeyDown("down", () => {
        if (!player.isGrounded()) {
            setGravity(increasedGravity);
        }
    });

    onKeyRelease("down", () => {
        setGravity(normalGravity);
    });
}

/**
 * Spawn tumbleweed obstacles
 *
 * @param gameState
 */
function spawnObstacles(gameState) {
    let obstacleType;
    if (gameState.score > 10) { // Add rocks after score hits 10+
        const randNum = Math.random();
        if (randNum < 0.33) obstacleType = "tumbleweed";
        else if (randNum < 0.66) obstacleType = "cactus";
        else obstacleType = "rock";
    } else {
        obstacleType = Math.random() < 0.5 ? "tumbleweed" : "cactus";
    }

    // Scale and position for obstacles
    let rockArea;
    let posAndScale = {y: height() - 145, scale: 0.20};
    if (obstacleType === "cactus") posAndScale.scale = 0.27;
    else if (obstacleType === "rock") posAndScale = {y: height() - 120, scale: 0.51}

    let areaConfig = obstacleType === "rock" ?
        area({ scale: vec2(0.4, 1), offset: vec2(200, 0) }) :
        area();

    add([
        sprite(obstacleType),
        areaConfig,
        outline(4),
        scale(posAndScale.scale),
        pos(width(), posAndScale.y),
        anchor("botleft"),
        move(LEFT, gameState.speed),
        "tree",
        {passed: false},
    ]);

    let spawnIntervalFrom = gameState.score >= 20 ? 0.5 : 0.9;
    let spawnIntervalTo = gameState.score >= 20 ? 1.5 : 2;

    wait(rand(spawnIntervalFrom, spawnIntervalTo), () => {
        spawnObstacles(gameState);
    });
}

/**
 * Calculate the score
 *
 * @param player
 * @param gameState
 */
function calculateScore(player, gameState) {
    // keep track of score
    //let score = 0;

    const scoreLabel = add([
        text("Score: " + gameState.score),
        pos(width() / 2, height() / 7),
        scale(2),
        anchor("center"),
        color(0, 0, 0),
    ]);

    let lastSpeedIncreaseScore = 0;

    // Count jumped over obstacles by calculating the position of the player relative to the trees
    onUpdate("tree", (tree) => {
        if (tree.pos.x < player.pos.x && !tree.passed) {
            gameState.score++;
            scoreLabel.text = "Score: " + gameState.score;
            tree.passed = true;
        }

        // Check if score reached a 10+ mark
        if (Math.floor(gameState.score / 10) > Math.floor(lastSpeedIncreaseScore / 10)) {
            gameState.speed += 60; // Increase speed by 60
            lastSpeedIncreaseScore = gameState.score;
        }
    });

    // Pass the score to the losing screen
    player.onCollide("tree", () => {
        shake();
        go("lose", gameState.score);
        gameState.score = 0; // Reset score
        gameState.speed = 400; // Reset speed
    })

    player.onUpdate(() => {
        if (player.pos.x < 0) {
            go("lose", gameState.score);
        }
    });
}

/**
 *
 * @param gameState
 */
function createMovingPlatform(gameState) {
    const platformSpeed = gameState.speed;
    const platformWidth = width();
    let platforms = [];

    for (let i = 0; i < 2; i++) {
        platforms.push(add([
            sprite("plattform"),
            pos(i * platformWidth, height() - 153),
            area(),
            body({isStatic: true}),
            "movingPlatform",
        ]));
    }

    onUpdate("movingPlatform", (platform) => {
        platform.move(-platformSpeed, 0);
        if (platform.pos.x <= -platformWidth) {
            let maxRight = platforms.reduce((max, p) => Math.max(max, p.pos.x), 0);
            platform.pos.x = maxRight + platformWidth;
        }
    });
}
