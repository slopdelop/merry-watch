# Merry Watch

[Open the app](https://slopdelop.github.io/merry-watch/) · [GitHub repository](https://github.com/slopdelop/merry-watch)

A personal, iPhone-first Christmas movie tracker. Static HTML, CSS and JavaScript; no runtime dependencies, account, analytics, or backend. Cozy High Street miniature village design with illuminated shop-window navigation.

## Preview

Run `npm start`, then open http://localhost:4173. Run `npm test` for catalogue, streaming-date, watched-state and backup checks. No installation is required.

## Included in V1

- All 34 movies from the supplied Hallmark October–December 2026 schedule, plus The Hallmark Christmas Experience special.
- Official Hallmark film stills, original short synopses, cast, TV premiere and next-day Hallmark+ streaming dates.
- Holiday Baking Championship season 13, Harry Potter: Wizards of Baking season 3, and existing seasons of The Great Christmas Light Fight.
- To watch / Coming soon / Watched, search, service and type filters, and reaction filtering in Watched.
- Meh / OK / Good / Great / Holiday magic. Ratings are optional; watched status can be undone or edited.
- An episode counter for competition shows. A show only moves to Watched when explicitly finished.
- Device-local storage and JSON backup export/import. No cross-device sync. Local previews and the eventual GitHub Pages address have separate storage; use export/import to transfer progress.
- Home Screen manifest, icons, and a service worker. The app shell is cached after the first online load; images cache as viewed. Updates require an online visit. The catalogue is curated, not automatically refreshed.

## Data and availability

Catalogue checked October 24, 2026. Streaming dates use the device's local calendar date; a scheduled day is not a guarantee of availability at a particular hour. Hallmark dates are TV premiere + one calendar day. If a service has not announced a streaming date, V1 shows it as unconfirmed rather than deriving a date. The Great Christmas Light Fight entry describes existing Hulu seasons; it does not claim a new 2026 season.

The Hallmark schedule and movie details were checked against the [official 2026 preview](https://www.hallmarkchannel.com/christmas/countdown-to-christmas-2026-preview/) and linked individual title pages. Each catalogue record includes its original listing and original artwork URL.

Additional official sources: [Food Network holiday lineup](https://www.foodnetwork.com/shows/photos/food-network-holiday-programming-winter-2026), [Wizards of Baking season 3](https://www.foodnetwork.com/shows/harry-potter-wizards-of-baking/articles/harry-potter-wizards-of-baking-season-three), and [Hulu's Light Fight listing](https://www.hulu.com/series/the-great-christmas-light-fight-08671001-3106-480d-9c94-d20a9934b44f). All 38 titles have locally saved official artwork. Holiday Baking Championship uses general series artwork from Hulu; Wizards artwork is an official season 2 still from Wizarding World.

Film stills belong to Hallmark Media. Other show artwork belongs to its credited owners. The village and storefront illustrations were generated with OpenAI's built-in image generation tool. This independent personal tracker is not affiliated with the networks.

## GitHub Pages

The site uses relative URLs and can live at `https://YOUR-USER.github.io/merry-watch/`.

1. Sign in to the GitHub CLI with `gh auth login -h github.com` if needed.
2. Create a new repository named `merry-watch`, push this directory to its `main` branch.
3. In repository Settings → Pages, choose **GitHub Actions** as the source.
4. Run the bundled **Publish Merry Watch** workflow (or push a commit). It runs the tests and deploys the static site.
5. Open the published URL in iPhone Safari → Share → Add to Home Screen.

Keep the repository separate from other personal websites: localStorage is scoped to the origin, and this app uses a distinct key, `merry-watch-v1`. Backups contain only watch records, not artwork.

## Editing the collection

Update `catalogue.json` and add local stills under `assets/`. Keep each title's `id` stable so saved reactions continue to match. Add `available: true` only for confirmed existing streaming availability. Series can optionally declare `totalEpisodes`; otherwise their episode count is an open-ended personal tally.

When changing cached assets, increment the cache version in `sw.js`. Core files use a network-first cache policy; offline visits use the last cached copy. New service workers activate after old app windows close.
