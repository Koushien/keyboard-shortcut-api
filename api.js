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

class API extends ExtensionAPI {
  getAPI(context) {
    return {
      keyboard_shortcut: {
        // NAVIGATION SHORTCUTS
        navigationBack() {
          // browser.js:~1985
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserBack();
        },
        navigationForward() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserForward();
        },
        navigationHome() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserHome();
        },
        navigationOpenFile() {
          // browser.js:2063
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserOpenFileWindow()
        },
        navigationReload() {
          // inferred from browser.js:2036
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserReload();
        },
        navigationReloadOverrideCache() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserReloadSkipCache();
        },
        navigationStop() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserStop();
        },

        // CURRENT PAGE SHORTCUTS
        pageGoDownAScreen() {
          // http://searchfox.org/mozilla-central/source/dom/xbl/builtin/mac/platformHTMLBindings.xml
          // along those lines, as in browser.js:2115
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollPageDown");
        },
        pageGoUpAScreen() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollPageUp");
        },

        pageGoToBottom() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollBottom");
        },
        pageGoToTop() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollTop");
        },
        pageMoveToNextFrame() {
          // EventStateManager.cpp:~2930
          const fm = nsIFocusManager;
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          fm.moveFocus(window, null, fm.MOVEFOCUS_FORWARDDOC, fm.FLAG_BYKEY);
        },
        pageMoveToPreviousFrame() {
          const fm = nsIFocusManager;
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          fm.moveFocus(window, null, fm.MOVEFOCUS_BACKWARDDOC, fm.FLAG_BYKEY);
        },
        pagePrint() {
          // browser.js:~2066 and browser-sets.inc:~32
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.PrintUtils.printWindow(window.gBrowser.selectedBrowser.outerWindowID,
                                        window.gBrowser.selectedBrowser);
        },
        pageSaveAs() {
          // browser.js:~2070
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.saveBrowser(window.gBrowser.selectedBrowser);
        },
        pageZoomIn() {
          // browser-sets.inc:~85
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.FullZoom.enlarge();
        },
        pageZoomOut() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.FullZoom.reduce();
        },
        pageZoomReset() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.FullZoom.reset();
        },

        // EDITING SHORTCUTS
        editCopy() {
          // as noted in editMenuOverlay.xul
          //   <!-- These key nodes are here only for show. The real bindings
          //   come from XBL, in platformHTMLBindings.xml. See bugs 57078 and 71779. -->
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_copy");
        },
        editCut() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_cut");
        },
        editDelete() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_delete");
        },
        editPaste() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_paste");
        },
        editPasteAsPlainText() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_pasteNoFormatting");
        },
        editRedo() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_redo");
        },
        editSelectAll() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_selectAll");
        },
        editUndo() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_undo");
        },

        // SEARCH SHORTCUTS
        searchFind() {
          // browser-sets.inc:~48 and findbar.xml
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gFindBar.onFindCommand();
        },
        searchFindAgain() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gFindBar.onFindAgainCommand(false);
        },
        searchFindPrevious() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gFindBar.onFindAgainCommand(true);
        },
        searchQuickFindLinksOnly() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          // The clear() mimics native shortcut behavior,
          // but doesn't autofill highlighted text which could be useful
          window.gFindBar.clear();
          window.gFindBar.startFind(window.gFindBar.FIND_LINKS);
        },
        searchQuickFind() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gFindBar.clear();
          window.gFindBar.startFind(window.gFindBar.FIND_TYPEAHEAD);
        },
        searchCloseFind() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gFindBar.close();
        },

        // WINDOWS & TABS SHORTCUTS
        // closeTab
        tabCloseTab() {
          // option 1: get current tab id, tabs.close(id);
          // tabs.getSelected() is deprecated but stated to work
          // tabs.getCurrent() is async and standardized
        },
        // closeWindow
        windowCloseWindow() {
          window.close();
        },
        // moveLeft
        tabsMoveLeft() {
          // get id of current tab
          // does first tab wrap around to end or stay left?
          if (id.index == -1) index = tabs.length - 2;
          tabs.move(id, { index: id.index - 1 });
        },
        // moveRight
        tabsMoveRight() {
          // get id of current tab
          // does last tab wrap around to first or stay at end
          if (id.index == -1) index = tabs.length - 1;
          tabs.move(id, { index: id.index - 1 });
        },
        // moveToStart
        tabsMovetoStart() {
          // get id of current tab
          tabs.move(id, { index: 0 });
        },
        // moveToEnd
        tabsMoveToEnd() {
          // get id of current tab
          tabs.move(id, { index: -1 });
        },
        // toggleMute
        tabsToggleMute() {
          // get id of current tab
          // do we need to update reason?
          tabs.update(id, { muted: true });
        },
        // newTab
        tabsNewTab() {
          tabs.create();
        },
        // newWindow
        windowsNewWindow() {
          windows.create();
        },
        // newPrivateWindow
        windowsNewPrivateWindow() {
          windows.create({ incognito: true });
        },
        // nextTab
        tabsNextTab() {
          // get id of next tab
          tabs.update(id, { active: true });
        },
        // previousTab
        tabsPreviousTab() {
          // get id of previous tab
          tabs.update(id, { active: true });
        },
        // undoCloseTab
        tabUndoClose() {
          // browser-sets.inc:109
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.undoCloseTab();
        },
        // selectTab2
        tabsSelectTab2() {
          tabs.update(tabs.query({ index: 2 })[0].tab.id, { active: true });
        },
        // selectTab3
        tabsSelectTab3() {
          tabs.update(tabs.query({ index: 3 })[0].tab.id, { active: true });
        },
        // selectTab4
        tabsSelectTab4() {
          tabs.update(tabs.query({ index: 4 })[0].tab.id, { active: true });
        },
        // selectTab5
        tabsSelectTab5() {
          tabs.update(tabs.query({ index: 5 })[0].tab.id, { active: true });
        },
        // selectTab6
        tabsSelectTab6() {
          tabs.update(tabs.query({ index: 6 })[0].tab.id, { active: true });
        },
        // undoCloseWindow
        windowUndoClose() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.undoCloseWindow();
        },

        // HISTORY
        historySidebar() {
          // browser-sets.inc:131
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.SidebarUI.toggle('viewHistorySidebar');
        },
        historyLibraryWindow() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.PlacesCommandHook.showPlacesOrganizer('History');
        },
        historyClearRecent() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          Cc['@mozilla.org/browser/browserglue;1']
            .getService(Ci.nsIBrowserGlue).sanitize(window);
        },

        // BOOKMARKS
        bookmarksThisPage() {
          // browser-sets.inc:60
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.PlacesCommandHook.bookmarkCurrentPage(
            true, window.PlacesUtils.bookmarksMenuFolderId);
        },
        bookmarksSidebar() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.SidebarUI.toggle('viewBookmarksSidebar');
        },
        bookmarksLibraryWindow() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.PlacesCommandHook.showPlacesOrganizer('UnfiledBookmarks');
        },

        // TOOLS
        // downloads
        toolsDownloads() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserDownloadsUI();
        },
        // addons
        toolsAddons() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserOpenAddonsMgr();
        },
        // toggleDeveloperTools
        toolsToggleDeveloper() {
          // devtools-browser.js:267
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          // gDevToolsBrowser.onKeyShortcut not exposed in Nightly 57.0a1
          window.gDevToolsBrowser.toggleToolboxCommand(window.gBrowser);
        },
        // webConsole
        toolsWebConsole() {
          // panels from DevTools.jsm:26
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gDevToolsBrowser.selectToolCommand(window.gBrowser, "webconsole");
        },
        // inspector
        toolsInspector() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gDevToolsBrowser.selectToolCommand(window.gBrowser, "inspector");
        },
        // debugger
        toolsDebugger() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gDevToolsBrowser.selectToolCommand(window.gBrowser, "jsdebugger");
        },
        // styleEditor
        toolsStyleEditor() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gDevToolsBrowser.selectToolCommand(window.gBrowser, "styleeditor");
        },
        // profiler
        toolsProfiler() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gDevToolsBrowser.selectToolCommand(window.gBrowser, "performance");
        },
        // network
        toolsNetwork() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.gDevToolsBrowser.selectToolCommand(window.gBrowser, "netmonitor");
        },
        // undocumented shortcut for "storage" => shift+f9
        // developerToolbar
        toolsDeveloperToolbar() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          // gDevToolsBrowser.getDeveloperToolbar not exposed in Nightly 57.0a1
        },
        // responsiveDesignView
        toolsResponsiveDesignView() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.ResponsiveUI.ResponsiveUIManager.toggle(window,
                                                         window.gBrowser.selectedTab);
        },
        // scratchpad
        toolsScratchpad() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.Scratchpad.ScratchpadManager.openScratchpad();
        },
        // pageSource
        toolsPageSource() {
          // browser-sets.inc:43 Observes "canViewSource"
          // Do we need to set our own observer?
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserViewSource(window.gBrowser.selectedBrowser);
        },
        // browserConsole
        toolsBrowserConsole() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.HUDService.openBrowserConsoleOrFocus();
        },
        // pageInfo
        toolsPageInfo() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.BrowserPageInfo();
        },

        // MISC SHORTCUTS
        // toggleFullScreen
        toggleFullScreen() {
          // do we need to set .fullscreen if we resize by any other method?
          window.fullscreen = !window.fullscreen;
        },
        // toggleMenuBar
        toggleMenuBar() {
          // window.menubar is read-only
        },
        // toggleReaderMode
        toggleReaderMode() {
          // like view-source, just prefix with about:reader?url=
          // inspect enterReaderMode in resource://gre/modules/ReaderMode.jsm
        },
        // caretBrowsing
        // selectLocationBar
        selectLocationBar: function() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          // it is undocumented on MDN, but is defined in browser.js:2263
          // called in the same manner as below in ext-tabs.js:385
          window.focusAndSelectUrlBar();
        }
      }
    };
  }
}
