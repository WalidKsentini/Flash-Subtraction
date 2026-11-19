# [Flash Subtraction](https://flashsubtraction.vercel.app/)

A minimal flash subtraction trainer for mental math practice. Numbers flash on screen one at a time, you subtract them mentally, then type the answer.

## How it works

1. Choose your settings:
   - **Numbers:** how many numbers appear
   - **Interval (ms):** how long each number stays on screen
   - **First number digits:** digit count of the first number (positive)
   - **Next numbers digits:** digit count of the numbers to subtract (negative)
2. Press Start and watch the numbers flash.
3. Enter your answer. The page tells you if you were right and shows the correct answer.
4. A new round starts automatically after 3 seconds, or you can go back to settings.

The final answer is always positive. If the settings make that impossible, the page tells you to change them.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| Enter | Start (settings), check answer, or next round (result) |
| Esc | Back to settings |

## Run it

No build step and no dependencies. Open `index.html` in a browser, or use the live version on [Vercel](https://flashsubtraction.vercel.app/).
