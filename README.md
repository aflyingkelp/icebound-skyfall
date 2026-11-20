# ICEBOUND: Skyfall

A browser ice-boat racer with blue ice, elevated sky trails, submerged tunnels, branching routes, uncapped speed, stackable wall-tap surge, and Firebase multiplayer.

**Play:** https://aflyingkelp.github.io/icebound-skyfall/

## Controls

| Action | Key |
| --- | --- |
| Accelerate | W / Up |
| Steer | A / D or Left / Right |
| Brake / reverse | S / Down |
| Unlimited boost | Space / Shift |
| Reset boat | R |
| Pause solo race | P / Escape |

Touch controls appear on devices with a coarse pointer.

## Play with friends

1. Open the game and choose **Multiplayer**.
2. Enter a racer name and choose **Create room**.
3. Share the six-character room code and the game link.
4. Friends choose **Join room**. The host chooses **Start free roam**.

Rooms support up to eight guest players. Multiplayer is free-roam surge combat; solo mode is a three-lap race against bots. Leaving as the host closes the room. Firebase removes disconnected players.

Wall taps add surge stacks. Ramming a rival spends your stacks on knockback. More stacks produce stronger hits. Boost and speed have no hard cap.

## Run locally

Requires Node.js 20 or newer. No package installation or build is required.

```sh
npm start
```

Open http://127.0.0.1:4174. Use an HTTP server rather than opening `index.html` as a local file, because the game uses JavaScript modules.

```sh
npm test
```

The runtime checks cover controls, checkpoints, race completion, surge, and separation of elevated routes. They do not connect to the production database.

## Firebase

The deployed game uses the `icebound-skyfall-kelp-2026` project, Firebase Anonymous Authentication, and Realtime Database. Its web configuration is in `multiplayer.js`; the Firebase web API key identifies the project and is not an administrator credential. Database access is controlled by `database.rules.json`.

The rules restrict each player to their own membership and pose, allocate eight room slots, and validate the sender of hit messages. Movement is client-owned and interpolated by peers. This is a casual multiplayer implementation, not a server-authoritative competitive simulation.

To use your own Firebase project:

1. Create a Firebase web app, enable Anonymous Authentication, and provision Realtime Database.
2. Replace the web configuration and database URL in `multiplayer.js`.
3. Change the default project in `.firebaserc`.
4. Deploy the rules and authentication configuration:

```sh
npx -y firebase-tools@latest login
npx -y firebase-tools@latest deploy --only auth,database
```

Never commit service-account keys, refresh tokens, or administrator credentials.

## Hosting

The repository root is ready for GitHub Pages. In **Settings → Pages**, use **Deploy from a branch**, select `main`, and choose `/ (root)`.

## Files

- `index.html`, `style.css`: menus, lobby, and HUD.
- `game.js`: Three.js scene, trails, physics, race logic, and multiplayer bridge.
- `multiplayer.js`: Firebase guest identities, rooms, presence, movement, and hit messages.
- `three.module.js`: vendored Three.js 0.160.1; see `THREE-LICENSE.txt`.
- `firebase.json`, `.firebaserc`, `database.rules.json`: Firebase deployment configuration.

Three.js is distributed under the MIT license. Google Fonts and Firebase SDK modules are loaded over HTTPS.
