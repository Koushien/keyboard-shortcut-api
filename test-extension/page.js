"use strict";
function createButton(context, func, name, timeout = 0) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = name;
  button.onclick = (timeout > 0)
    ? () => { document.getElementById("lorem").focus(); window.setTimeout(() => { func() }, timeout) }
    : () => { func() };
  context.appendChild(button);
}

window.onload = function() {
  console.log(browser);
  console.log(browser.keyboard_shortcut);
  var shortcuts = Object.getOwnPropertyNames(browser.keyboard_shortcut);
  var category = "";
  for (var i = 0; i < shortcuts.length; i++) {
    let name = shortcuts[i].toString(), func = browser.keyboard_shortcut[name];
    let temp, timeout;
    if ((temp = name.match(/^[a-z]+/)[0]) !== category) {
      category = temp;
      document.body.appendChild(document.createElement("br"));
    }
    if (category === "edit") timeout = 2000;
    if (name === "toggleReaderMode") {
      func = () => {
        const url = prompt("URL (complete with scheme) to read.", "https://mozilla.org");
        if (url) {
           const tab = browser.tabs.create({'url':url});
           tab.then(window.setTimeout(() => { browser.keyboard_shortcut[name]() }, 4000));
        }
      }
    }
    createButton(document.body, func, name, timeout);
  };
  document.body.appendChild(document.createElement("br"));
  var textbox = document.createElement("textarea");
  textbox.id = "lorem";
  textbox.value = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a erat purus. Aliquam accumsan, nulla id consectetur condimentum, magna erat egestas dolor, id gravida dolor ex sed lorem. Pellentesque condimentum dictum placerat. Integer non elementum sapien. Nulla et fermentum nisl. Curabitur ac scelerisque odio. Quisque sed hendrerit purus. In nec ante ligula. Cras mollis metus turpis, et mollis velit semper ac. Praesent ultrices mauris nibh, a feugiat elit finibus vel. In aliquam, dolor quis porta dapibus, enim ipsum venenatis risus, in luctus odio sem vel dui."
  document.body.appendChild(textbox);
}
