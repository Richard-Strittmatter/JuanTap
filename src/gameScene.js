/**
 * The game scene
 */
export function gameScene() {
    loadSprite("bean", "sprites/bean.png")
    loadSprite("tumbleweed", "sprites/tumbleweed.png")
    loadSprite("plattform", "sprites/plattform.png")
    loadSprite("background", "sprites/desert.png");

    scene("game", () => {
        // Set scene background
        setBackground();

        setGravity(1600)

        // putting together our player character
        const player = add([
            sprite("bean"),
            pos(80, 40),
            area(),
            body(),
        ])

        setPlayerMovement(player)
        calculateScore(player)
        spawnTree();

        // add platform
        createMovingPlatform()
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
 */
function setPlayerMovement(player) { // 'player' als Parameter
    onKeyPress("space", () => {
        if (player.isGrounded()) {
            player.jump();
        }
    });

    onKeyDown("left", () => {
        player.move(-450, 0);
    });

    onKeyDown("right", () => {
        player.move(450, 0);
    });
}

/**
 * Spawn tumbleweed obstacles
 *
 * @param player
 */
function spawnTree(player) {
    const tumbleweed = add([
        sprite("tumbleweed"),
        area(),
        outline(4),
        scale(0.20),
        pos(width(), height() - 145),
        anchor("botleft"),
        move(LEFT, 400),
        "tree",
        {passed: false}, // Add "passed" parameter for counter and set default to false
    ]);

    wait(rand(0.9, 2), () => {
        spawnTree();
    });
}

/**
 * Calculate the score
 *
 * @param player
 */
function calculateScore(player) {
    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text("Score: " + score),
        pos(width() / 2, height() / 7),
        scale(2),
        anchor("center"),
        color(0, 0, 0),
    ]);

    // Count jumped over obstacles by calculating the position of the player relative to the trees
    onUpdate("tree", (tree) => {
        if (tree.pos.x < player.pos.x && !tree.passed) {
            score++;
            scoreLabel.text = "Score: " + score;
            tree.passed = true;
        }
    });

    // Pass the score to the losing screen
    player.onCollide("tree", () => {
        shake();
        go("lose", score);
    })
}

function createMovingPlatform() {
    const platformSpeed = 400;
    const platformWidth = width();

    for (let i = 0; i < 2; i++) {
        add([
            sprite("plattform"),
            pos(i * platformWidth, height() - 153), // Put the platforms next to each other
            area(),
            body({isStatic: true}),
            "movingPlatform",
            {
                update() {
                    this.move(-platformSpeed, 0);
                    if (this.pos.x <= -this.width) {
                        this.pos.x += this.width * 2;
                    }
                }
            }
        ]);
    }
}
