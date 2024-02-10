/**
 * Start scene
 */
export function startScene() {
    loadSprite("start", "sprites/desert.png");
    loadSprite("juan_tap", "sprites/Juan_tap.png");
    loadSprite("juan", "sprites/Juan.png");

    scene("start", () => {
        setBackground()

        add([
            sprite("juan_tap"),
            anchor("center"),
            pos(width() / 2 + 300, height() / 2 - 100),
            scale(0.85),
            fixed()
        ])

        add([
            sprite("juan"),
            anchor("center"),
            pos(width() / 2 - 500, height() / 2 + 147),
            scale(0.6),
            fixed()
        ])

        addButton("Press space to play", vec2(width() / 2 + 200, height() / 2 + 250), () => {
            go("game");
        });

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

    function addButton(txt, p, f) {
        const btn = add([
            rect(420, 80, { radius: 8 }),
            pos(p),
            area(),
            scale(1.3),
            anchor("center"),
            outline(4),
            color(255, 255, 255),
        ]);

        btn.add([
            text(txt, 24),
            anchor("center"),
            color(0, 0, 0),
        ]);

        onUpdate(() => {
            const t = time() * 5;
            btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
            btn.scale = vec2(1.3 + Math.sin(t / 2) * 0.1);
        });

        btn.onClick(f);

        return btn;
    }

}