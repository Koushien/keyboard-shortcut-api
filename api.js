/*
 * Keyboard Shortcut/Navigation API
 *
 * Design:
 *   Perform actions possible with keyboard presses in Firefox
 *   Ideally, we'd be using the same calls real shortcuts do.
 *
 */
var {classes: Cc, interfaces: Ci, utils: Cu} = Components
const nsIWindowMediator = Cc['@mozilla.org/appshell/window-mediator;1']
  .getService(Ci.nsIWindowMediator);
const nsIFocusManager = Cc["@mozilla.org/focus-manager;1"]
  .getService(Ci.nsIFocusManager);
const debugging = Cu.import('resource://gre/modules/Console.jsm');

// GENERATORS
// panels from DevTools.jsm:26
function devTools(panel) {
  return function() {
    const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
    window.gDevToolsBrowser.selectToolCommand(window.gBrowser, panel);
  }
}
function doCommand(cmd) {
  return function() {
    const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
    window.goDoCommand(cmd);
  }
}

class API extends ExtensionAPI {
  getAPI(context) {
    return {
      keyboard_shortcut: {
        // NAVIGATION SHORTCUTS
        navigationBack() {
          // browser.js:~1985
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserBack();
        },
        navigationForward() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserForward();
        },
        navigationHome() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserHome();
        },
        navigationOpenFile() {
          // browser.js:2063
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserOpenFileWindow()
        },
        navigationReload() {
          // inferred from browser.js:2036
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserReload();
        },
        navigationReloadOverrideCache() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserReloadSkipCache();
        },
        navigationStop() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
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
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          fm.moveFocus(window, null, fm.MOVEFOCUS_FORWARDDOC, fm.FLAG_BYKEY);
        },
        pageMoveToPreviousFrame() {
          const fm = nsIFocusManager;
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          fm.moveFocus(window, null, fm.MOVEFOCUS_BACKWARDDOC, fm.FLAG_BYKEY);
        },
        pagePrint() {
          // browser.js:~2066 and browser-sets.inc:~32
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.PrintUtils
            .printWindow(
              window.gBrowser.selectedBrowser.outerWindowID,
              window.gBrowser.selectedBrowser);
        },
        pageSaveAs() {
          // browser.js:~2070
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.saveBrowser(window.gBrowser.selectedBrowser);
        },
        pageZoomIn() {
          // browser-sets.inc:~85
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.FullZoom.enlarge();
        },
        pageZoomOut() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.FullZoom.reduce();
        },
        pageZoomReset() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
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
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gFindBar.onFindCommand();
        },
        searchFindAgain() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gFindBar.onFindAgainCommand(false);
        },
        searchFindPrevious() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gFindBar.onFindAgainCommand(true);
        },
        searchQuickFindLinksOnly() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          // The clear() mimics native shortcut behavior,
          // but doesn't autofill highlighted text which could be useful
          window.gFindBar.clear();
          window.gFindBar.startFind(window.gFindBar.FIND_LINKS);
        },
        searchQuickFind() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gFindBar.clear();
          window.gFindBar.startFind(window.gFindBar.FIND_TYPEAHEAD);
        },
        searchCloseFind() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gFindBar.close();
        },

        // WINDOWS & TABS SHORTCUTS
        tabClose() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserCloseTabOrWindow();
        },
        tabMoveLeft() {
          // tabbrowser.xml
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.moveTabBackward();
        },
        tabMoveRight() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.moveTabForward();
        },
        tabMoveToStart() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.moveTabToStart();
        },
        tabMoveToEnd() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.moveTabToEnd();
        },
        tabToggleMute() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.selectedTab.toggleMuteAudio();
        },
        tabNew() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          // Called without event passed in browser-sets.inc:24
          window.BrowserOpenTab();
        },
        tabNext() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.tabContainer.advanceSelectedTab(1, true);
        },
        tabPrevious() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.tabContainer.advanceSelectedTab(-1, true);
        },
        tabUndoClose() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.undoCloseTab();
        },
        tabSelect(tabNumber) {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          // Called without event passed in Tabs.jsm among other places.
          // Alternatively, we can use code directly from tabbrowser.xml.
          window.gBrowser.selectTabAtIndex(tabNumber - 1);
        },
        tabSelectLast() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.selectTabAtIndex(-1);
        },
        windowClose() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserTryToCloseWindow();
        },
        windowNew() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.OpenBrowserWindow();
        },
        windowNewPrivate() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.OpenBrowserWindow({private: true});
        },
        windowUndoClose() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.undoCloseWindow();
        },

        // HISTORY
        historySidebar() {
          // browser-sets.inc:131
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.SidebarUI.toggle('viewHistorySidebar');
        },
        historyLibraryWindow() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.PlacesCommandHook.showPlacesOrganizer('History');
        },
        historyClearRecent() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          Cc['@mozilla.org/browser/browserglue;1']
            .getService(Ci.nsIBrowserGlue).sanitize(window);
        },

        // BOOKMARKS
        bookmarksThisPage() {
          // browser-sets.inc:60
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.PlacesCommandHook.bookmarkCurrentPage(
            true, window.PlacesUtils.bookmarksMenuFolderId);
        },
        bookmarksSidebar() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.SidebarUI.toggle('viewBookmarksSidebar');
        },
        bookmarksLibraryWindow() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.PlacesCommandHook.showPlacesOrganizer('UnfiledBookmarks');
        },

        // TOOLS
        toolsDownloads() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserDownloadsUI();
        },
        toolsAddons() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserOpenAddonsMgr();
        },
        toolsToggleDeveloper() {
          // devtools-browser.js:267
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
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
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          // gDevToolsBrowser.getDeveloperToolbar not exposed in Nightly 57.0a1
        },
        toolsResponsiveDesignView() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.ResponsiveUI.ResponsiveUIManager
            .toggle(window, window.gBrowser.selectedTab);
        },
        toolsScratchpad() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.Scratchpad.ScratchpadManager.openScratchpad();
        },
        toolsPageSource() {
          // browser-sets.inc:43 Observes "canViewSource"
          // Do we need to set our own observer?
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserViewSource(window.gBrowser.selectedBrowser);
        },
        toolsBrowserConsole() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.HUDService.openBrowserConsoleOrFocus();
        },
        toolsPageInfo() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserPageInfo();
        },

        // MISC SHORTCUTS
        toggleFullScreen() {
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.BrowserFullScreen();
        },
        // toggleMenuBar
        toggleMenuBar() {
          // window.menubar is read-only
        },
        toggleReaderMode() {
          // browser-sets.inc:46
          // Add a non-null document for readermode to parse
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          window.gBrowser.selectedBrowser.messageManager
            .sendAsyncMessage("Reader:ToggleReaderMode");
        },
        toggleCaretBrowsing() {
          // Adapted directly from browser.xml:1605
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
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
          const window = nsIWindowMediator
            .getMostRecentWindow('navigator:browser');
          // it is undocumented on MDN, but is defined in browser.js:2263
          // called in the same manner as below in ext-tabs.js:385
          window.focusAndSelectUrlBar();
        }
      }
    };
  }
}
