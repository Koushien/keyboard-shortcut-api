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
        // goDownAScreen
        pageGoDownAScreen() {
          // http://searchfox.org/mozilla-central/source/dom/xbl/builtin/mac/platformHTMLBindings.xml
          // along those lines, as in browser.js:2115
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollPageDown");
        },
        // goUpAScreen
        pageGoUpAScreen() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollPageUp");
        },

        // goToBottomOfPage
        pageGoToBottom() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollBottom");
        },
        // goToTopOfPage
        pageGoToTop() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_scrollTop");
        },
        // moveToNextFrame
        pageMoveToNextFrame() {
          // EventStateManager.cpp:~2930
          const fm = nsIFocusManager;
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          fm.moveFocus(window, null, fm.MOVEFOCUS_FORWARDDOC, fm.FLAG_BYKEY);
        },
        // moveToPreviousFrame
        pageMoveToPreviousFrame() {
          const fm = nsIFocusManager;
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          fm.moveFocus(window, null, fm.MOVEFOCUS_BACKWARDDOC, fm.FLAG_BYKEY);
        },
        // print
        pagePrint() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          // ext-tabs.js:~771
          // PrintUtils.printWindow(getTabOrActive(null).linkedBrowser.outerWindowID,
          //                        getTabOrActive.linkedBrowser);
          // browser.js:~2066
          // Not the same as ctrl+p (why?), this is equivalent to menu -> print
          window.PrintUtils.printWindow(window.gBrowser.selectedBrowser.outerWindowID,
                                        window.gBrowser.selectedBrowser);
        },
        // savePageAs
        pageSaveAs() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          // browser.js:~2070
          window.saveBrowser(window.gBrowser.selectedBrowser);
        },
        // zoomIn
        pageZoomIn() {
          // browser-sets.inc:~85
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.FullZoom.enlarge();
        },
        // zoomOut
        pageZoomOut() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.FullZoom.reduce();
        },
        // zoomReset
        pageZoomReset() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.FullZoom.reset();
        },

        // EDITING SHORTCUTS
        // copy
        editCopy() {
          // as noted in editMenuOverlay.xul
          //   <!-- These key nodes are here only for show. The real bindings
          //   come from XBL, in platformHTMLBindings.xml. See bugs 57078 and 71779. -->
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_copy");
        },
        // cut
        editCut() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_cut");
        },
        // delete
        editDelete() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_delete");
        },
        // paste
        editPaste() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_paste");
        },
        // pasteAsPlainText
        editPasteAsPlainText() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_pasteNoFormatting");
        },
        // redo
        editRedo() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_redo");
        },
        // selectAll
        editSelectAll() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_selectAll");
        },
        // undo
        editUndo() {
          const window = nsIWindowMediator.getMostRecentWindow('navigator:browser');
          window.goDoCommand("cmd_undo");
        },

        // SEARCH SHORTCUTS
        // find
        searchFind(target) {
          // search.find() is non-standard
          // and generally seen as substandard
          // https://bugzilla.mozilla.org/show_bug.cgi?id=672395
          // full object parameters
          // https://developer.mozilla.org/en-US/docs/Web/API/search/find

          // if we can't get this implemented, consider regex on DOM contents
        },
        // findAgain
        searchFindAgain() {
          // consider binding this to previous find
        },
        // findPrevious
        searchFindPrevious() {
          // window.find does have a "aBackwards" flag,
          // but overall not very useful to us
        },
        // quickFindLinksOnly
        // quickFind
        // closeFind

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
        // selectTab1
        tabsSelectTab1() {
          tabs.update(tabs.query({ index: 1 })[0].tab.id, { active: true });
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
        // selectTab7
        tabsSelectTab7() {
          tabs.update(tabs.query({ index: 7 })[0].tab.id, { active: true });
        },
        // selectTab8
        tabsSelectTab8() {
          tabs.update(tabs.query({ index: 8 })[0].tab.id, { active: true });
        },
        // selectLastTab
        tabsSelectLastTab() {
          // Is there a better way to get the number of tabs in a window?
          allTabs = tabs.query({ currentWindow: true });
          tabs.update(allTabs[allTabs.length - 1].tab.id, { active: true });
        },

        // undoCloseTab
        // undoCloseWindow

        // historySidebar
        // bookmarksSidebar
        // possibly relevant:
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/user_interface/Sidebars

        // libraryWindowHistory
        // clearRecentHistory

        // bookmarkThisPage
        bookmarksBookMarkThisPage() {
          // get name, location of current window
          browser.bookmarks.create({
            title: window.name,
            url: window.location
          },)
        },
        // libraryWindowBookmarks

        // downloads
        tabsDownloads() {
          // read tabsAddons below
          tabs.create({ url: 'about:downloads' });
        },
        // addons
        tabsAddons() {
          // open about:addons in new tab
          // since about:addons is a privileged URL, we cannot open it this way
          // granting such permission in web extensions is being discussed in
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1269456
          // if needed, we can try manually constructing a URL object
          // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
          tabs.create({ url: 'about:addons' });
        },

        // toggleDeveloperTools
        // webConsole
        // inspector
        // debugger
        // styleEditor
        // profiler
        // network
        // developerToolbar
        // responsiveDesignView
        // scratchpad

        // pageSource
        toolsPageSource() {
          // opens view-source:#CURRENTURL in new tab
          // it is likely most straight forward to prefix and open
          // however there may be mechanisms to get the source from current page
          // (opening the page itself might create a new request)
          // browser.js:2180 Bug 1167797: For view source, always skip cache on RELOADS
        },

        // browserConsole
        // pageInfo

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
