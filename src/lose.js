/**
 * Losing scene
 */
export function loseScene() {
    loadSprite("background", "sprites/desert.png");

    scene("lose", (score) => {
        setBackground()

        add([
            text("Game Over"),
            pos(width() / 2, height() / 2 - 80),
            scale(5, 5),
            anchor("center"),
            color(0,0,0),
        ])

        // display score
        add([
            text("Score: " + score),
            pos(width() / 2, height() / 2 + 120),
            scale(2),
            anchor("center"),
        ]);

        onKeyPress("space", () => {
            go("game");
        })
    })


    function setBackground() {
        add([
            sprite("background"),
            pos(width() / 2, height() / 2),
            anchor("center"),
            scale(1.07),
            fixed()
        ]);
    }
}