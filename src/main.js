import kaboom from "kaboom"

kaboom()

// load a sprite "dino" from an image
loadSprite("bean", "sprites/bean.png")

scene("game", () => {

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

    // Count jumped over obstacles by calculating the position of the player relative to the trees
    onUpdate("tree", (tree) => {
        if (tree.pos.x < player.pos.x && !tree.passed) {
            score++;
            scoreLabel.text = score;
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
            { passed: false }, // Add "passed" parameter for counter and set default to false
        ]);

        wait(rand(0.9, 2), () => {
            spawnTree();
        });
    }

    player.onCollide("tree", () => {
        addKaboom(player.pos);
        shake();
    });

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
        addKaboom();
        shake();
        go("lose");
    })

    let score = 0;
    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ])
})

scene("lose", () => {
    add([
        text("Gay"),
        pos(center()),
        scale(5, 5),
        anchor("center"),
    ])
})

go("game")
