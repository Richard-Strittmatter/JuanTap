/**
 * Start scene
 */
export function startScene() {
    loadSprite("start", "sprites/start_screen.png");

    scene("start", () => {
        setBackground()

        onKeyPress("space", () => {
            go("game");
        })
    })


    function setBackground() {
        add([
            sprite("start"),
            pos(width() / 2, height() / 2 - 40),
            anchor("center"),
            scale(1),
            fixed()
        ]);
    }
}