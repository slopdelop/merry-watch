# Merry Watch

[Open the app](https://slopdelop.github.io/merry-watch/) · [GitHub repository](https://github.com/slopdelop/merry-watch)

A personal, iPhone-first Christmas movie tracker. Static HTML, CSS and JavaScript; no runtime dependencies, account, analytics, or backend. Cozy High Street miniature village design with illuminated shop-window navigation.

## Preview

Run `npm start`, then open http://localhost:4173. Run `npm test` for catalogue, streaming-date, watched-state and backup checks. No installation is required.

## Included in V1

- All 34 movies from the supplied Hallmark October–December 2026 schedule, plus The Hallmark Christmas Experience special.
- Simple, bakeable iced-cookie motif thumbnails for every title, with original official stills retained in expanded details; original short synopses, cast, TV premiere and next-day Hallmark+ dates.
- Holiday Baking Championship season 13, Harry Potter: Wizards of Baking season 3, with confirmed HBO Max streaming dates. Light Fight is hidden from unwatched lists because no 2026 season was picked up; its original ID remains valid for saved history.
- Ten additional confirmed 2026 releases: five Netflix films, Netflix’s four-episode Bakers and Makers holiday competition, two Apple TV specials, Prime Video’s The Man with the Bag, and Tubi’s Christmas at the Zoo. Each has a new motif cookie and its own streaming date.
- Seventeen November 12 additions across HBO Max, Hulu, Netflix, Peacock, The Roku Channel, Prime Video, Paramount+ and Disney+, each with a new cookie and a short original tagline.
- Steady warm fairy lights, evergreen sprigs and red berries decorate the list margins. Close buttons stay pinned at the upper right while detail, rating and settings sheets scroll.
- To watch / Coming soon / Watched through the illuminated shop windows. The collection opens directly to the movie list, with no search, filters, counts or introductory headings.
- Star any title in its details to give its cookie thumbnail a gold frame. Stars are independent of watched or skipped status, persist on this device and are included in backups. Date ordering stays the same.
- Won’t watch hides a title from all main collections. A link inside Watched opens a separate sheet to restore skipped titles to To watch or Coming soon. Choices survive reloads and backup export/import; episode progress is retained.
- Meh / OK / Good / Great / Holiday magic. Ratings are optional; watched status can be undone or edited.
- An episode counter for competition shows. A show only moves to Watched when explicitly finished.
- Device-local storage and JSON backup export/import. No cross-device sync. Local previews and the eventual GitHub Pages address have separate storage; use export/import to transfer progress.
- Cookie thumbnails and all shop states preload and decode in the background. Unloaded cookies fade from ivory, while decoded images appear immediately on return.
- Home Screen manifest, icons, and a service worker. The app shell is cached after the first online load; images cache as viewed. Updates require an online visit. The catalogue is curated, not automatically refreshed.

## Data and availability

Catalogue checked November 12, 2026. Streaming dates use the device’s local calendar day. Hallmark dates are TV premiere + one day; other dates come from service schedules or linked announcements. Holiday Baking Championship season 13 streams on HBO Max from November 3, after its November 2 Food Network premiere. Light Fight has no 2026 season and is excluded from both unwatched lists. It remains in the catalogue so watched records, ratings, stars and skipped choices retain their original ID. Its historical 2025 streaming date is labeled separately.

The Hallmark schedule and movie details were checked against the [official 2026 preview](https://www.hallmarkchannel.com/christmas/countdown-to-christmas-2026-preview/) and linked individual title pages. Each catalogue record includes its original listing and original artwork URL.

Additional official sources: [Food Network holiday lineup](https://www.foodnetwork.com/shows/photos/food-network-holiday-programming-winter-2026), [Wizards of Baking season 3](https://www.foodnetwork.com/shows/harry-potter-wizards-of-baking/articles/harry-potter-wizards-of-baking-season-three), and [Hulu's Light Fight listing](https://www.hulu.com/series/the-great-christmas-light-fight-08671001-3106-480d-9c94-d20a9934b44f). There are 65 title records, including the retained inactive Light Fight record. Official artwork is saved locally where available; Titles without accessible, verified promotional artwork use their cookie in details too; the credit explicitly identifies this. Guarding Stars uses the official announcement portraits; The Christmas Switch uses its official first-look video thumbnail. Holiday Baking Championship uses general series artwork from Hulu; Wizards artwork is an official season 2 still from Wizarding World.

Film stills and promotional artwork belong to their credited owners, including Hallmark Media, Netflix, Amazon MGM Studios, Apple TV, Peanuts, WildBrain, The Jim Henson Company and Tubi / Very Merry Entertainment. Fraunces soft-serif headings and movie titles with Nunito body text are self-hosted for reliable loading. The village, storefront states, and cookie motifs were generated with OpenAI's built-in image generation tool. The title and shop labels are integrated into the artwork. Each navigation state has its own lamp-lit panorama; images render in their native aspect ratios with no stretching. The full prompt set is saved in artwork-prompts.json. This independent personal tracker is not affiliated with the networks.

## Other streaming services — October 24 research

Official announcements confirm these US streaming releases:

| Title | Service | Streaming date |
| --- | --- | --- |
| A Dog’s Perfect Christmas | Netflix | November 4 |
| Christmas at the Zoo | Tubi | November 10 |
| Tyler Perry’s The Gospel of Christmas | Netflix | November 11 |
| The Christmas Switch | Netflix | November 12 |
| Snoopy Presents: 12 Days of Snoopy | Apple TV | November 13 |
| Guarding Stars | Netflix | November 18 |
| In a Holidaze | Netflix | December 2 |
| The Man with the Bag | Prime Video | December 2 |
| Fraggle Rock: A Holiday Gift | Apple TV | December 4 |
| Gabby’s Dollhouse: Bakers and Makers — 4 holiday episodes | Netflix | December 9 |

Sources: [Netflix fall slate](https://www.netflix.com/tudum/features/new-fall-movies-on-netflix-2026), [Gospel release announcement](https://www.netflix.com/tudum/articles/the-gospel-of-christmas-news-cast-release-date-photos), [The Christmas Switch](https://about.netflix.com/en/news/netflix-unwraps-first-look-at-swedish-holiday-film-the-christmas-switch), [Guarding Stars](https://www.netflix.com/tudum/articles/leighton-meester-jared-padalecki-bodyguard-adaptation-cast-news-movie-name), [Bakers and Makers](https://www.netflix.com/tudum/articles/new-netflix-preschool-shows-games), [Prime Video](https://www.aboutamazon.com/news/entertainment/the-man-with-the-bag-arnold-schwarzenegger-christmas-movie-prime-video), [Apple TV holiday slate](https://www.apple.com/tv-pr/news/2026/09/theres-no-place-like-apple-tv-for-the-holidays/), [Tubi](https://tubitv.com/movies/100063504/christmas-at-the-zoo).

## November 12 additions

US streaming dates; television premieres are shown separately inside the app.

| Title | Service | Streaming date |
| --- | --- | --- |
| Big Bargain Holiday Showdown | HBO Max | 2026-11-11 |
| Tournament of Champions: All-Star Christmas | HBO Max | 2026-11-09 |
| Next Level Baker | Hulu | 2026-11-20 |
| The Great British Baking Show: Holidays | Netflix | 2026-11-23 |
| Pillsbury Bake-Off Classic | Paramount+ | 2026-11-24 |
| Sweet Deceit — Holiday Episodes | HBO Max | 2026-11-17 |
| Beat Bobby Flay: Holiday Throwdown | HBO Max | 2026-11-18 |
| The 12 Dates of Christmas | Hulu | 2026-11-06 |
| The Holiday Spark | The Roku Channel | 2026-11-02 |
| Second Chance Holiday | The Roku Channel | 2026-11-05 |
| The Christmas Rewrite | Peacock | 2026-11-06 |
| Postcards for Christmas | Hulu | 2026-11-13 |
| Unbearable Christmas | Peacock | 2026-11-20 |
| Clashing Through the Snow | Prime Video | 2026-11-23 |
| All for Christmas | Netflix | 2026-11-24 |
| Dasher | Disney+ | 2026-11-28 |
| Diary of a Wimpy Kid Christmas: The Getaway | Disney+ | 2026-12-04 |

Each record links its listing and, where separate, its date evidence. Pillsbury is dated for November 24 on demand; Paramount+ Premium also offers the November 23 CBS broadcast live. The 12 Dates of Christmas is the Lucy Hale / Ian Harding 2026 film, distinct from the 2011 movie; its reported debut is November 6. Baking Show: Holidays tracks only the two new US Netflix specials. Sweet Deceit and Bobby Flay track their holiday runs. Ordinary scripted shows and individual scripted episodes remain excluded.

### Saved-history compatibility

All 48 pre-expansion IDs are retained. The storage key (`merry-watch-v1`) and version-1 backup format are unchanged; catalogue updates do not write or reset device storage. Regression tests round-trip ratings, watched timestamps, episode counts, stars and skipped choices for every original ID. Inactive titles remain valid when importing old backups and still appear in Watched if previously watched. The app origin is unchanged.

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
