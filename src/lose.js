/**
 * Losing scene
 */
export function loseScene() {
    scene("lose", (score) => {
        add([
            text("Game Over"),
            pos(center()),
            scale(5, 5),
            anchor("center"),
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
}