/**
 * AsyncPopup.js (Dark-Mode Enabled)
 * A lightweight, non-blocking, zero-dependency replacement for alert, confirm, and prompt.
 * Automatically adapts to system Light/Dark mode preferences.
 */

class AsyncPopupManager {
  constructor() {
    this.containerId = 'async-popup-container';
    this.container = null;
    this._injectStyles();
  }

  /**
   * Dynamically injects the framework styles into the <head>
   * Uses CSS variables to handle light/dark themes seamlessly.
   */
  _injectStyles() {
    if (document.getElementById('async-popup-styles')) return;

    const style = document.createElement('style');
    style.id = 'async-popup-styles';
    style.textContent = `
      :root {
        --ap-bg: #ffffff;
        --ap-title-color: #1a1a1a;
        --ap-msg-color: #4a4a4a;
        --ap-border: #cccccc;
        --ap-input-bg: #ffffff;
        --ap-input-text: #1a1a1a;
        --ap-btn-sec-bg: #eaeaea;
        --ap-btn-sec-text: #333333;
        --ap-btn-sec-hover: #dddddd;
        --ap-btn-prim-bg: #007aff;
        --ap-btn-prim-text: #ffffff;
        --ap-btn-prim-hover: #0062cc;
        --ap-overlay-bg: rgba(0, 0, 0, 0.4);
      }

      /* Native System Dark Mode Override */
      @media (prefers-color-scheme: dark) {
        :root {
          --ap-bg: #1c1c1e;
          --ap-title-color: #f2f2f7;
          --ap-msg-color: #aeaeae;
          --ap-border: #3a3a3c;
          --ap-input-bg: #2c2c2e;
          --ap-input-text: #ffffff;
          --ap-btn-sec-bg: #2c2c2e;
          --ap-btn-sec-text: #f2f2f7;
          --ap-btn-sec-hover: #3a3a3c;
          --ap-btn-prim-bg: #0a84ff;
          --ap-btn-prim-hover: #0066cc;
          --ap-overlay-bg: rgba(0, 0, 0, 0.6);
        }
      }

      #${this.containerId} {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .ap-overlay {
        position: fixed;
        inset: 0;
        background: var(--ap-overlay-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        animation: ap-fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        backdrop-filter: blur(4px);
      }
      .ap-box {
        background: var(--ap-bg);
        padding: 24px;
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 420px;
        width: 90%;
        box-sizing: border-box;
        border: 1px solid var(--ap-border);
        animation: ap-scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .ap-title {
        margin: 0 0 10px 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--ap-title-color);
      }
      .ap-message {
        margin: 0 0 20px 0;
        font-size: 0.95rem;
        line-height: 1.5;
        color: var(--ap-msg-color);
      }
      .ap-input {
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 20px;
        border: 1px solid var(--ap-border);
        background: var(--ap-input-bg);
        color: var(--ap-input-text);
        border-radius: 8px;
        font-size: 0.95rem;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s, background-color 0.2s;
      }
      .ap-input:focus {
        border-color: var(--ap-btn-prim-bg);
      }
      .ap-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .ap-btn {
        padding: 10px 18px;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }
      .ap-btn-secondary {
        background: var(--ap-btn-sec-bg);
        color: var(--ap-btn-sec-text);
      }
      .ap-btn-secondary:hover { background: var(--ap-btn-sec-hover); }
      
      .ap-btn-primary {
        background: var(--ap-btn-prim-bg);
        color: var(--ap-btn-prim-text);
      }
      .ap-btn-primary:hover { background: var(--ap-btn-prim-hover); }

      @keyframes ap-fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes ap-scaleUp { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(style);
  }

  /**
   * Lazily initializes the container element inside the DOM body
   */
  _initContainer() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      document.body.appendChild(this.container);
    }
  }

  /**
   * The core layout execution engine
   */
  _render({ title, message, type, placeholder = '' }) {
    this._initContainer();

    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'ap-overlay';

      const isPrompt = type === 'prompt';
      const isAlert = type === 'alert';

      overlay.innerHTML = `
        <div class="ap-box">
          ${title ? `<h3 class="ap-title">${title}</h3>` : ''}
          <p class="ap-message">${message}</p>
          ${isPrompt ? `<input type="text" class="ap-input" placeholder="${placeholder}" id="ap-field" autocomplete="off">` : ''}
          <div class="ap-actions">
            ${!isAlert ? `<button class="ap-btn ap-btn-secondary" id="ap-btn-cancel">Cancel</button>` : ''}
            <button class="ap-btn ap-btn-primary" id="ap-btn-ok">${isAlert ? 'OK' : 'Confirm'}</button>
          </div>
        </div>
      `;

      this.container.appendChild(overlay);

      const inputField = overlay.querySelector('#ap-field');
      if (isPrompt && inputField) {
        setTimeout(() => inputField.focus(), 50);
      }

      const closePopup = (returnValue) => {
        overlay.remove();
        resolve(returnValue);
      };

      // Event Bindings
      overlay.querySelector('#ap-btn-ok').addEventListener('click', () => {
        if (isPrompt) {
          closePopup(inputField.value);
        } else {
          closePopup(true);
        }
      });

      if (!isAlert) {
        overlay.querySelector('#ap-btn-cancel').addEventListener('click', () => {
          closePopup(isPrompt ? null : false);
        });
      }

      // Keyboard Accessibility
      const keyHandler = (e) => {
        if (e.key === 'Escape' && !isAlert) {
          document.removeEventListener('keydown', keyHandler);
          closePopup(isPrompt ? null : false);
        } else if (e.key === 'Enter') {
          document.removeEventListener('keydown', keyHandler);
          if (isPrompt) {
            closePopup(inputField.value);
          } else {
            closePopup(true);
          }
        }
      };
      document.addEventListener('keydown', keyHandler);
    });
  }

  // --- Exposed Developer API ---

  async alert(message, title = 'Notification') {
    return this._render({ title, message, type: 'alert' });
  }

  async confirm(message, title = 'Are you sure?') {
    return this._render({ title, message, type: 'confirm' });
  }

  async prompt(message, placeholder = '', title = 'Input Required') {
    return this._render({ title, message, type: 'prompt', placeholder });
  }
}

// Export global instance
const AsyncPop = new AsyncPopupManager();