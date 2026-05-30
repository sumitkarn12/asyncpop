# 🚀 AsyncPop

An ultra-lightweight, zero-dependency, non-blocking asynchronous replacement for browser native `alert()`, `confirm()`, and `prompt()` functions. 

Automatically matches system light/dark mode configurations out-of-the-box.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🔥 Why AsyncPop?

The browser's native window popups (`alert`, `confirm`, `prompt`) are relics of an older web. They have a massive architectural flaw: **they are synchronous and completely freeze the browser UI main thread.** **AsyncPop** fixes this by mimicking the exact linear syntax of native dialogs but leverages JavaScript Promises to make them entirely **non-blocking**.

* **📦 Zero Dependencies:** Written in raw, optimized Vanilla JS.
* **💅 Hands-off Styling:** Automatically injects beautiful, non-clashing CSS on the fly.
* **🌙 Native Dark Mode:** Automatically adapts dynamically based on user OS `prefers-color-scheme`.
* **⌨️ Keyboard Accessible:** Full support out-of-the-box for `Enter` (Submit) and `Escape` (Dismiss) keys.

---

## 🚀 Quick Start

No installation, compilation, or styling files needed. Just drop it into your page and go.

```html
<script src="https://cdn.jsdelivr.net/gh/sumitkarn12/asyncpop/dist/asyncpop.min.js"></script>

<script>
  async function initApp() {
    // 1. Non-blocking Alert
    await AsyncPop.alert("Welcome to the dashboard!", "Hello!");

    // 2. Non-blocking Confirm
    const deleteAccount = await AsyncPop.confirm("Are you sure you want to delete this?");
    
    if (deleteAccount) {
      // 3. Non-blocking Prompt
      const input = await AsyncPop.prompt("Type 'CONFIRM' to execute:", "Type here...");
      console.log("User Input:", input);
    }
  }
</script>
```

## 🛠️ API Reference
`AsyncPop.alert(message, title)`
Returns a `Promise<true>`. Resolves when the user clicks "OK" or presses Enter.

`AsyncPop.confirm(message, title)`
Returns a `Promise<boolean>`. Resolves to true on confirmation, false on cancel/escape.

`AsyncPop.prompt(message, placeholder, title)`
Returns a `Promise<string | null>`. Resolves to the text input string on submission, or `null` if cancelled.

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.