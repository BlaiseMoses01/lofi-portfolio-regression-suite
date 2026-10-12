# explorer extensions

This file is yours, and plugin updates never overwrite it. The playgentic agents pass these rules to the **explorer** agent on every run.

They're added to its built-in instructions, and **they override those instructions where the two conflict, including the guardrails.** Keep the rules short and concrete. Delete the examples you don't want.

## Rules

- The site is one page: a pixel-art room drawn on a scaled stage, with an HTML HUD on top. There is no routing; state lives in the URL hash and browser storage.
- A fresh load is gated: the CRT shows `> PRESS ENTER` (`> TAP TO BEGIN` on touch). The first click or Enter/Space only wakes it and does nothing else. After that, the boot lines type and the camera holds on the screen for about 5.7s before easing out to the room.
- A known hash (`#projects`, `#gameboy`), or `prefers-reduced-motion: reduce`, skips the gate and the intro entirely. Reduced motion also starts with sound off.
- The theme follows the local clock (day 07:00–19:00). Fix it with `page.clock` before exploring; day and night have different hotspot positions.
- Hotspots are elements with `data-focus="<key>"` and a `title` set to the point name. The CRT itself carries `data-focus="projects"`.
- The `desktop` project is landscape: the artwork is letterboxed and fully visible. The `mobile` project (Pixel 7) is portrait: the artwork is cropped at the sides, you drag to pan, the reading panel is a sheet at the top or bottom, and the room ignores taps while a point is open.
- The debug panel (`debug layers`, bottom-left) only exists in `npm run dev:debug`. If it shows up against `TARGET_URL`, report it as a bug.
