/**
 * The game scene
 */
export function gameScene() {
    loadSprite("bean", "sprites/bean.png")

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

        onKeyPress("space", () => {
            if (player.isGrounded()) {
                player.jump();
            }
        });

        // keep track of score
        let score = 0;

        const scoreLabel = add([
            text("Score: " + score),
            pos(24, 24),
        ]);

        // Count jumped over obstacles by calculating the position of the player relative to the trees
        onUpdate("tree", (tree) => {
            if (tree.pos.x < player.pos.x && !tree.passed) {
                score++;
                scoreLabel.text = "Score: " + score;
                tree.passed = true;
            }
        });

        function spawnTree() {
            add([
                rect(48, rand(24, 64)),
                area(),
                outline(4),
                pos(width(), height() - 48),
                anchor("botleft"),
                color(255, 180, 255),
                move(LEFT, 400),
                "tree",
                {passed: false}, // Add "passed" parameter for counter and set default to false
            ]);

            wait(rand(0.9, 2), () => {
                spawnTree();
            });
        }

// add platform
        add([
            rect(width(), 48),
            pos(0, height() - 48),
            outline(4),
            area(),
            body({isStatic: true}),
            color(7, 125, 39),
        ])

        spawnTree();

        player.onCollide("tree", () => {
            shake();
            go("lose", score);
        })
    });
}

function setBackground() {
    let bgImage =  loadSprite("background", "sprites/desert.png");

    let background = add([
        sprite("background"),
        // Make the background centered on the screen
        pos(width() / 2, height() / 2),
        anchor("center"),
        // Allow the background to be scaled
        scale(1.1),
        fixed()
    ]);
}
