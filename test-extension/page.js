function createButton(context, func, name) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = name;
  button.onclick = function() { func() };
  context.appendChild(button);
}

window.onload = function() {
  console.log(browser);
  console.log(browser.keyboard_shortcut);
  var shortcuts = Object.getOwnPropertyNames(browser.keyboard_shortcut);
  var category = "";
  for (var i = 0; i < shortcuts.length; i++) { 
    let fun = shortcuts[i].toString(), temp;
    if ((temp = fun.match(/^[a-z]+/)[0]) !== category) {
      category = temp;
      document.body.appendChild(document.createElement("br"));
    }
    createButton(document.body, browser.keyboard_shortcut[fun], fun);
  };
}
