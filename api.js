/*
 * Keyboard Shortcut/Navigation API
 *
 * Design:
 *   Perform actions possible with keyboard presses in Firefox.
 *   Ideally, we'd be using the same calls real shortcuts do.
 *
 */
const {classes: Cc, interfaces: Ci, utils: Cu} = Components
const nsIWindowMediator = Cc['@mozilla.org/appshell/window-mediator;1']
  .getService(Ci.nsIWindowMediator);
const nsIFocusManager = Cc["@mozilla.org/focus-manager;1"]
  .getService(Ci.nsIFocusManager);
const debugging = Cu.import('resource://gre/modules/Console.jsm');

// panels from DevTools.jsm:26
function devTools(panel) {
  return function() {
    const window = getWindow();
    window.gDevToolsBrowser.selectToolCommand(window.gBrowser, panel);
  }
}
function doCommand(cmd) {
  return function() {
    const window = getWindow();
    window.goDoCommand(cmd);
  }
}
function getWindow() {
  return nsIWindowMediator.getMostRecentWindow('navigator:browser');
}

class API extends ExtensionAPI {
  getAPI(context) {
    return {
      keyboard_shortcut: {
        // NAVIGATION SHORTCUTS
        navigationBack() {
          // browser.js:~1985
          const window = getWindow();
          window.BrowserBack();
        },
        navigationForward() {
          const window = getWindow();
          window.BrowserForward();
        },
        navigationHome() {
          const window = getWindow();
          window.BrowserHome();
        },
        navigationOpenFile() {
          // browser.js:2063
          const window = getWindow();
          window.BrowserOpenFileWindow()
        },
        navigationReload() {
          // inferred from browser.js:2036
          const window = getWindow();
          window.BrowserReload();
        },
        navigationReloadOverrideCache() {
          const window = getWindow();
          window.BrowserReloadSkipCache();
        },
        navigationStop() {
          const window = getWindow();
          window.BrowserStop();
        },

        // CURRENT PAGE SHORTCUTS
        // mozilla-central/source/dom/xbl/builtin/mac/platformHTMLBindings.xml
        // along those lines, as in browser.js:2115
        pageGoDownAScreen: doCommand("cmd_scrollPageDown"),
        pageGoUpAScreen: doCommand("cmd_scrollPageUp"),
        pageGoToBottom: doCommand("cmd_scrollBottom"),
        pageGoToTop: doCommand("cmd_scrollTop"),
        pageMoveToNextFrame() {
          // EventStateManager.cpp:~2930
          const fm = nsIFocusManager;
          const window = getWindow();
          fm.moveFocus(window, null, fm.MOVEFOCUS_FORWARDDOC, fm.FLAG_BYKEY);
        },
        pageMoveToPreviousFrame() {
          const fm = nsIFocusManager;
          const window = getWindow();
          fm.moveFocus(window, null, fm.MOVEFOCUS_BACKWARDDOC, fm.FLAG_BYKEY);
        },
        pagePrint() {
          // browser.js:~2066 and browser-sets.inc:~32
          const window = getWindow();
          window.PrintUtils.printWindow(
            window.gBrowser.selectedBrowser.outerWindowID,
            window.gBrowser.selectedBrowser);
        },
        pageSaveAs() {
          // browser.js:~2070
          const window = getWindow();
          window.saveBrowser(window.gBrowser.selectedBrowser);
        },
        pageZoomIn() {
          // browser-sets.inc:~85
          const window = getWindow();
          window.FullZoom.enlarge();
        },
        pageZoomOut() {
          const window = getWindow();
          window.FullZoom.reduce();
        },
        pageZoomReset() {
          const window = getWindow();
          window.FullZoom.reset();
        },

        // EDITING SHORTCUTS
        // as noted in editMenuOverlay.xul
        // <!-- These key nodes are here only for show.
        //      The real bindings come from XBL, in platformHTMLBindings.xml.
        //      See bugs 57078 and 71779. -->
        editCopy: doCommand("cmd_copy"),
        editCut: doCommand("cmd_cut"),
        editDelete: doCommand("cmd_delete"),
        editPaste: doCommand("cmd_paste"),
        editPasteAsPlainText: doCommand("cmd_pasteNoFormatting"),
        editRedo: doCommand("cmd_redo"),
        editSelectAll: doCommand("cmd_selectAll"),
        editUndo: doCommand("cmd_undo"),

        // SEARCH SHORTCUTS
        searchFind() {
          // browser-sets.inc:~48 and findbar.xml
          const window = getWindow();
          window.gFindBar.onFindCommand();
        },
        searchFindAgain() {
          const window = getWindow();
          window.gFindBar.onFindAgainCommand(false);
        },
        searchFindPrevious() {
          const window = getWindow();
          window.gFindBar.onFindAgainCommand(true);
        },
        searchQuickFindLinksOnly() {
          const window = getWindow();
          // The clear() mimics native shortcut behavior,
          // but doesn't autofill highlighted text which could be useful
          window.gFindBar.clear();
          window.gFindBar.startFind(window.gFindBar.FIND_LINKS);
        },
        searchQuickFind() {
          const window = getWindow();
          window.gFindBar.clear();
          window.gFindBar.startFind(window.gFindBar.FIND_TYPEAHEAD);
        },
        searchCloseFind() {
          const window = getWindow();
          window.gFindBar.close();
        },

        // WINDOWS & TABS SHORTCUTS
        tabClose() {
          const window = getWindow();
          window.BrowserCloseTabOrWindow();
        },
        tabMoveLeft() {
          // tabbrowser.xml
          const window = getWindow();
          window.gBrowser.moveTabBackward();
        },
        tabMoveRight() {
          const window = getWindow();
          window.gBrowser.moveTabForward();
        },
        tabMoveToStart() {
          const window = getWindow();
          window.gBrowser.moveTabToStart();
        },
        tabMoveToEnd() {
          const window = getWindow();
          window.gBrowser.moveTabToEnd();
        },
        tabToggleMute() {
          const window = getWindow();
          window.gBrowser.selectedTab.toggleMuteAudio();
        },
        tabNew() {
          const window = getWindow();
          // Called without event passed in browser-sets.inc:24
          window.BrowserOpenTab();
        },
        tabNext() {
          const window = getWindow();
          window.gBrowser.tabContainer.advanceSelectedTab(1, true);
        },
        tabPrevious() {
          const window = getWindow();
          window.gBrowser.tabContainer.advanceSelectedTab(-1, true);
        },
        tabUndoClose() {
          const window = getWindow();
          window.undoCloseTab();
        },
        tabSelect(tabNumber) {
          const window = getWindow();
          // Called without event passed in Tabs.jsm among other places.
          // Alternatively, we can use code directly from tabbrowser.xml.
          window.gBrowser.selectTabAtIndex(tabNumber - 1);
        },
        tabSelectLast() {
          const window = getWindow();
          window.gBrowser.selectTabAtIndex(-1);
        },
        windowClose() {
          const window = getWindow();
          window.BrowserTryToCloseWindow();
        },
        windowNew() {
          const window = getWindow();
          window.OpenBrowserWindow();
        },
        windowNewPrivate() {
          const window = getWindow();
          window.OpenBrowserWindow({private: true});
        },
        windowUndoClose() {
          const window = getWindow();
          window.undoCloseWindow();
        },

        // HISTORY
        historySidebar() {
          // browser-sets.inc:131
          const window = getWindow();
          window.SidebarUI.toggle('viewHistorySidebar');
        },
        historyLibraryWindow() {
          const window = getWindow();
          window.PlacesCommandHook.showPlacesOrganizer('History');
        },
        historyClearRecent() {
          const window = getWindow();
          Cc['@mozilla.org/browser/browserglue;1']
            .getService(Ci.nsIBrowserGlue).sanitize(window);
        },

        // BOOKMARKS
        bookmarksThisPage() {
          // browser-sets.inc:60
          const window = getWindow();
          window.PlacesCommandHook.bookmarkCurrentPage(
            true, window.PlacesUtils.bookmarksMenuFolderId);
        },
        bookmarksSidebar() {
          const window = getWindow();
          window.SidebarUI.toggle('viewBookmarksSidebar');
        },
        bookmarksLibraryWindow() {
          const window = getWindow();
          window.PlacesCommandHook.showPlacesOrganizer('UnfiledBookmarks');
        },

        // TOOLS
        toolsDownloads() {
          const window = getWindow();
          window.BrowserDownloadsUI();
        },
        toolsAddons() {
          const window = getWindow();
          window.BrowserOpenAddonsMgr();
        },
        toolsToggleDeveloper() {
          // devtools-browser.js:267
          const window = getWindow();
          // gDevToolsBrowser.onKeyShortcut not exposed in Nightly 57.0a1
          window.gDevToolsBrowser.toggleToolboxCommand(window.gBrowser);
        },
        toolsWebConsole: devTools("webconsole"),
        toolsInspector: devTools("inspector"),
        toolsDebugger: devTools("jsdebugger"),
        toolsStyleEditor: devTools("styleeditor"),
        toolsProfiler: devTools("performance"),
        toolsNetwork: devTools("netmonitor"),
        // toolsStorage: devTools("storage"); undocumented shortcut (shift+F9)
        toolsDeveloperToolbar() {
          const window = getWindow();
          // gDevToolsBrowser.getDeveloperToolbar not exposed in Nightly 57.0a1
        },
        toolsResponsiveDesignView() {
          const window = getWindow();
          window.ResponsiveUI.ResponsiveUIManager
            .toggle(window, window.gBrowser.selectedTab);
        },
        toolsScratchpad() {
          const window = getWindow();
          window.Scratchpad.ScratchpadManager.openScratchpad();
        },
        toolsPageSource() {
          // browser-sets.inc:43 Observes "canViewSource"
          // Do we need to set our own observer?
          const window = getWindow();
          window.BrowserViewSource(window.gBrowser.selectedBrowser);
        },
        toolsBrowserConsole() {
          const window = getWindow();
          window.HUDService.openBrowserConsoleOrFocus();
        },
        toolsPageInfo() {
          const window = getWindow();
          window.BrowserPageInfo();
        },

        // MISC SHORTCUTS
        isFullScreen() {
          const window = getWindow();
          return window.fullScreen;
        },
        toggleFullScreen() {
          const window = getWindow();
          window.BrowserFullScreen();
        },
        // toggleMenuBar
        isReaderMode() {
          // e.g., ReaderParent.jsm:77
          const window = getWindow();
          return window.gBrowser.currentURI.spec.startsWith("about:reader");
        },
        toggleReaderMode() {
          // browser-sets.inc:46
          // We don't have an event to pass directly
          // to ReaderParent.toggleReaderMode() so we
          // just use its short implementation here.
          const window = getWindow();
          window.gBrowser.selectedBrowser.messageManager
            .sendAsyncMessage("Reader:ToggleReaderMode");
        },
        isCaretBrowsing() {
          const mPrefs = Cc["@mozilla.org/preferences-service;1"]
            .getService(Ci.nsIPrefBranch);
          const kPrefCaretBrowsingOn = "accessibility.browsewithcaret";
          return mPrefs.getBoolPref(kPrefCaretBrowsingOn, false);
        },
        toggleCaretBrowsing() {
          // Directly from browser.xml:1605, the block handling F7 keypress.
          // We omit the check for defaultPrevented and !isTrusted
          // since we do not pass an event and set mPrefs and
          // mStrBundle inside this block.
          const window = getWindow();
          const mPrefs = Cc["@mozilla.org/preferences-service;1"]
            .getService(Ci.nsIPrefBranch);
          const mStrBundle = Cc["@mozilla.org/intl/stringbundle;1"]
            .getService(Ci.nsIStringBundleService)
            .createBundle("chrome://global/locale/browser.properties");
          const kPrefShortcutEnabled = "accessibility.browsewithcaret_shortcut.enabled";
          const kPrefWarnOnEnable    = "accessibility.warn_on_browsewithcaret";
          const kPrefCaretBrowsingOn = "accessibility.browsewithcaret";

          var isEnabled = mPrefs.getBoolPref(kPrefShortcutEnabled);
          if (!isEnabled)
            return;

          // Toggle browse with caret mode
          var browseWithCaretOn = mPrefs.getBoolPref(kPrefCaretBrowsingOn, false);
          var warn = mPrefs.getBoolPref(kPrefWarnOnEnable, true);
          if (warn && !browseWithCaretOn) {
            var checkValue = {value: false};
            var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                          .getService(Components.interfaces.nsIPromptService);

            var buttonPressed = promptService.confirmEx(window,
              mStrBundle.GetStringFromName("browsewithcaret.checkWindowTitle"),
              mStrBundle.GetStringFromName("browsewithcaret.checkLabel"),
              // Make "No" the default:
              promptService.STD_YES_NO_BUTTONS | promptService.BUTTON_POS_1_DEFAULT,
              null, null, null, mStrBundle.GetStringFromName("browsewithcaret.checkMsg"),
              checkValue);
            if (buttonPressed != 0) {
              if (checkValue.value) {
                try {
                  mPrefs.setBoolPref(kPrefShortcutEnabled, false);
                } catch (ex) {
                }
              }
              return;
            }
            if (checkValue.value) {
              try {
                mPrefs.setBoolPref(kPrefWarnOnEnable, false);
              } catch (ex) {
              }
            }
          }

          // Toggle the pref
          try {
            mPrefs.setBoolPref(kPrefCaretBrowsingOn, !browseWithCaretOn);
          } catch (ex) {
          }
        },
        selectLocationBar() {
          const window = getWindow();
          // it is undocumented on MDN, but is defined in browser.js:2263
          // called in the same manner as below in ext-tabs.js:385
          window.focusAndSelectUrlBar();
        }
      }
    };
  }
}
