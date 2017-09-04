browser.browserAction.onClicked.addListener(
  function openKeyboardShortcutTester() {
    browser.tabs.create({
      "url": "main.html"
    });
})
