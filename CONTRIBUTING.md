# Contributing

Keep changes focused on Wenxuecity ad placements and preserve article content and navigation. For a selector or blocking-rule change, describe the affected page type and why the existing behavior needs adjustment.

Run these syntax checks before submitting a pull request:

```sh
node --check wenxuecity-no-ads.user.js
python3 -m json.tool manifest.json >/dev/null
python3 -m json.tool rules.json >/dev/null
```

Reload the unpacked extension in Opera and inspect Wenxuecity home, category, and article pages. Check that intended ads disappear, surrounding content remains, and blocked requests match the hosts in `rules.json`. If the userscript changes, test it separately in Tampermonkey with the extension copy disabled.

In the pull request, include the affected URLs or page types, what changed, the checks performed, and before/after screenshots when layout changed. Do not include credentials, browsing data, or private keys.
