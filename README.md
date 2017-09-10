# Keyboard Shortcut API

This repo contains a prototype API implemented as a WebExtension Experiment for Firefox
that aims to address [Bug 1215061 - Better keyboard shortcut support][bug-1215061] as
mentioned in [comment 44][bug-1215061-c44]. This API triggers Firefox's [native
shortcuts][shortcuts] programmatically.

While extensions such as [Vimium-FF][vimium-ff] and [Saka Key][saka-key] make do only with
what's provided to regular WebExtensions, prior art in [Vimium][vimium] demonstrates
[limitations][vimium-faq]. These include loss of functionality on protected pages
requiring non-Vimium motions to navigate away from and Vimium needing to implement its own
location and findbar. In tandem with Colin Caine's [Keyboard API][keyboard-api], this API
landing means a user can define their own motions for Firefox's shortcuts and be usable
anywhere they normally are. It is our hope this use will go a long way in
[Vimperator][vimperator] or [Pentadactyl][pentadactyl] successors.

## Usage

1. Get the latest [Firefox Nightly][nightly].
2. Ensure extensions.legacy.enabled is set to "true" in about:config (an Experiment is
really a legacy extension).
3. Enter about:debugging and load keyboard-shortcut-api/schema.json to load the API.
4. Load /test-extension/manifest.json to load our test extension that adds a browser
action (i.e., a button on your toolbar) which opens a sample page that calls the functions
our API returns.

## Considerations for reviewers

- Currently, the implementation to toggle caret browsing with F7 is hardcoded inside
source/toolkit/content/widgets/browser.xml. Is there any intent to encapsulate this? If
not, is the verbatim reuse in the API acceptable?
- If at all, how would you like tests to work?
- If we can manage, we intend to implement a new shortcut here that focuses tab content,
escaping from browser chrome. Do we have approval for this?

[bug-1215061]: https://bugzilla.mozilla.org/show_bug.cgi?id=1215061
[bug-1215061-c44]: https://bugzilla.mozilla.org/show_bug.cgi?id=1215061#c44
[keyboard-api]: https://github.com/cmcaine/keyboard-api
[nightly]: https://www.mozilla.org/en-US/firefox/nightly/all/
[vimium]: https://github.com/philc/vimium/
[vimium-faq]: https://github.com/philc/vimium/wiki/FAQ
[vimium-ff]: https://addons.mozilla.org/firefox/addon/vimium-ff/
[vimperator]: https://github.com/vimperator/vimperator-labs/
[pentadactyl]: https://github.com/5digits/dactyl
[saka-key]: https://addons.mozilla.org/firefox/addon/saka-key/
[shortcuts]: https://support.mozilla.org/kb/keyboard-shortcuts-perform-firefox-tasks-quickly
