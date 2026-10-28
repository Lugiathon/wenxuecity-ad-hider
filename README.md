# Wenxuecity Ad Hider

A small browser extension and Tampermonkey userscript that hide ad placements on [Wenxuecity](https://www.wenxuecity.com/). The extension also blocks requests to a short list of known ad hosts on Wenxuecity pages.

## Why I Started This

I wanted to read Wenxuecity without popups, floating ads, and empty spaces breaking up the page. I started this project to make those pages calmer while keeping the articles and navigation intact. I kept it small so I could adjust the rules when the site changes. — Lugiathon

## Install

Open [install.html](install.html) for step-by-step instructions. To use the extension in Opera, open its Extensions page, enable **Developer mode**, choose **Load unpacked**, and select this folder. The extension hides page elements and blocks requests to the hosts listed in `rules.json`.

For the userscript only, create a new script in Tampermonkey, replace its contents with [wenxuecity-no-ads.user.js](wenxuecity-no-ads.user.js), and save. Disable the Tampermonkey copy when using the extension to avoid running the script twice. The userscript hides page elements but does not apply the extension's request-blocking rules.

Both versions match `wenxuecity.com` and its subdomains. Other ad hosts and first-party ad content may still download. Site layout changes may require updated selectors or rules.

## Files

- `manifest.json`: extension configuration and site permissions.
- `rules.json`: host-specific request-blocking rules.
- `wenxuecity-no-ads.user.js`: shared page script and standalone userscript.
- `install.html`: installation guide.

## Development

No build step or dependencies are required. After a change, check JavaScript and JSON syntax, then reload the extension in Opera and inspect home, category, and article pages. See [CONTRIBUTING.md](CONTRIBUTING.md) for commands and a review checklist.

## License

No license has been granted for reuse or redistribution.
