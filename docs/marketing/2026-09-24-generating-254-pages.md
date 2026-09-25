# I built a 254-page site out of 41 sentence templates

*The generator was the easy part. The checks that were supposed to catch its mistakes are where everything broke.*

---

I run a small store selling resume templates and printables. It has no backlinks and no traffic, and the standard advice for that situation is to publish more pages. So I built a second site: a free font-pairing tool. Pick a heading font and a body font, see them rendered together with real copy, copy the CSS.

There are 254 pairings, 40 fonts and 9 styles, which comes to 310 static pages and no database. Every page is generated at build time from a catalogue in JSON, and the build is a static export pushed to Cloudflare. The checks below all run inside that build, in order: lint the data, generate, assert the output, check the links. Any of them failing fails the deploy.

The generator took an afternoon. Keeping it from publishing garbage took considerably longer — and almost none of the problems were where I expected them.

## Uniqueness is a supply problem

The reason generated-content sites get penalised is that the pages are near-duplicates of each other. So the obvious check is pairwise similarity: take every page, compare it to every other page, fail if any pair is too close.

I wrote that. It failed immediately, on a catalogue I already knew was fine.

The reason is that a generated page has two parts. The specimen and the CSS are unique by construction, because they come from the font pair. The explanatory prose is not: it comes from a template, and 254 pairings drawn from 41 templates means the same sentence shape appears many times, differing only in which fonts it names.

So a whole page and a paragraph have completely different similarity profiles — I was measuring the paragraph while asking about the page. Measured at the paragraph level, 136 pairs out of the catalogue already exceeded the threshold I had picked. The gate would have locked the catalogue on the day I added it.

The check that actually works measures supply: for each template, how many generated pairings use it.

The catalogue now sits at 6.15 pairings per template, averaged over 41 slots, against a ceiling of 6.5. The ceiling was set on the day I added it, from the measurement: 171 generated pairings over 28 slots, 6.11 each. Rounded up with a little allowance, so the catalogue as it stood passed and any growth had to bring templates with it.

That last property is the point. Writing more prose is now cheaper than adding more pairings, which is the correct incentive for a site whose problem is repeated prose. When I later grew the catalogue from 173 to 254 pairings, the growth came with 13 new templates, because the arithmetic forced it.

I gate on the average rather than the maximum on purpose. The heaviest slot carries 11 pairings, and I left it. What matters is how much of the site's prose is recycled overall, and a hard maximum would have failed a catalogue that is, in aggregate, fine.

## Four ways a check lies to you

Everything below is a real bug from this project. They have different symptoms and the same shape: a check that reported success while the thing it was checking was wrong.

### 1. It measures the wrong surface

An automated audit told me 230 pages had meta descriptions over the length limit and would be truncated in search results.

The audit was reading the raw HTML. The descriptions contain ampersands, which HTML-escape to `&amp;`, five characters of markup standing in for one character of text. Measured on the raw bytes, "Fonts & Pairings" is longer than it looks. Measured on what a search result actually displays, zero pages were over the limit.

I nearly shipped truncated descriptions to fix a display problem that did not exist. The same string, counted two ways, gives opposite answers about whether it needs fixing.

### 2. It cannot survive the build environment

My sitemap declares a `lastmod` date per page, derived at build time from `git log -1 -- <path>`.

Locally that works. Every page gets the date of the last commit that touched its data file, which is exactly right. On Cloudflare's build it produced the same date for every entry.

The build runs against a depth-1 clone. There is one commit. Every path resolves to it, so every page reports the same "last modified" date, and the sitemap claims the whole site changed on the same day, forever.

A check derived from the build environment has to be re-asked in that environment. Mine was written on a machine with full history and validated there. The fix was to declare the dates in a data file and assert the built sitemap matches; a drift check that reads `git log` now steps aside when there is no history to read, rather than confidently producing nonsense.

### 3. Nothing connects it to the thing you just changed

The homepage has a generator with a font pool, and shipping all 254 pairings to the browser was wasteful, so I cut the pool to 48.

Separately, all 40 font pages have a "try it in the generator" link pointing at that font's first pairing.

Those two facts had no connection anywhere in the code. Shrinking the pool quietly moved 32 of the 40 links outside it. The links still worked. They took you to the generator, which told you the pairing you had just clicked was "not a checked pairing," and rendered placeholder text instead of the specimen.

The fix was to top the pool up with each font's first pairing, so the two facts cannot disagree.

More recently, on the store side of the same funnel, a link checker skipped everything that was not a site-relative path. The store links are absolute URLs to another domain, so the entire class was unverified. A separate assertion did read those URLs, but only to extract the campaign parameter, never the path. 134 of 254 pages spent weeks pointing at a category the store had deleted, and both checks passed.

A check is only as good as its coverage of the thing that changed. Two guards can look at the same URL and be looking at different halves of it.

### 4. Your own tooling is the least trustworthy part

Those three were caught eventually, and each one taught me something about where to look. The checks I wrote myself were the harder problem, because a script reporting a plausible failure is more convincing than one reporting nothing at all.

I wrote a script to verify internal links across the built site. It fired requests concurrently. Against Cloudflare, 33 simultaneous requests tripped a connection limit, and the script reported 26 live pages as broken. I spent a while "fixing" linking bugs that did not exist.

Over one working session, my own verification scripts produced six false reports while the code under test was correct. `grep -c` counts lines, and the built HTML is one line, so navigation links were counted as page content and I concluded that every style page was missing its store link. A regex missed an optional campaign parameter. Case sensitivity. A slug I typed by hand. A template slot count I estimated at 30 instead of measuring it at 28, which made a new gate fail on the existing catalogue on its first run.

The order of suspicion matters. I now prove the instrument works before concluding the code is broken.

## What I do now

Three habits, all of them learned by getting it wrong.

**Assert on the built artefact, not the intention.** The checks that have caught real bugs read the generated HTML, the emitted sitemap, the deployed response. The ones that read my own source and inferred the output have been wrong repeatedly.

**Prove the check can fail.** A guard that has never gone red is decoration. When I added the store-link check, I pointed it at the deleted category and confirmed it exits non-zero, then pointed it at a non-existent path and confirmed it again. Pointing it at the deleted category still fails even though the store now redirects that URL, because the check treats a redirect as broken. Following a redirect would have hidden the exact defect it exists to catch.

**Count the surface you are about to publish on.** Descriptions are measured after HTML-decoding. Pairing prose is measured per template, not per page. Content is measured in rendered characters, not bytes. The number you compute is only meaningful alongside a statement of what you counted.

None of this is specific to generated sites. Every one of these bugs is a check that agreed with itself.

---

*The site is [kyno.top](https://www.kyno.top), a free font-pairing tool: 254 pairings, real specimen text, copy-ready CSS, no signup. I built it to be genuinely useful on its own, and it also happens to be where the store's traffic might eventually come from.*
