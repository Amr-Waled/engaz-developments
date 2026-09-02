import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const chromePath = chromeCandidates.find(existsSync);
if (!chromePath) throw new Error('Chrome/Chromium was not found. Set CHROME_PATH.');

const profile = mkdtempSync(join(tmpdir(), 'engaz-mobile-audit-'));
const port = 9300 + Math.floor(Math.random() * 300);
const firstUrl = pathToFileURL(resolve('index.html')).href;
const browser = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=' + port,
  '--user-data-dir=' + profile,
  firstUrl,
], { stdio: 'ignore', windowsHide: true });

const delay = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds));
let socket;

async function getPageTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch('http://127.0.0.1:' + port + '/json').then((response) => response.json());
      const page = targets.find((target) => target.type === 'page');
      if (page) return page;
    } catch { /* Chrome is still starting. */ }
    await delay(100);
  }
  throw new Error('Could not connect to the Chrome debugging endpoint.');
}

function connect(webSocketUrl) {
  return new Promise((resolveSocket, reject) => {
    const ws = new WebSocket(webSocketUrl);
    ws.addEventListener('open', () => resolveSocket(ws), { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
}

let commandId = 0;
const pending = new Map();
function send(method, params = {}) {
  commandId += 1;
  const id = commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolveCommand, rejectCommand) => pending.set(id, { resolveCommand, rejectCommand }));
}

async function waitForPage() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const state = await send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
      if (state.result.result.value === 'complete') break;
    } catch { /* A navigation can temporarily replace the execution context. */ }
    await delay(100);
  }
  await send('Runtime.evaluate', {
    expression: 'document.fonts.ready.then(() => new Promise((done) => setTimeout(done, 250)))',
    awaitPromise: true,
  });
}

const pageNames = ['index.html', 'projects.html', 'portfolio.html', 'about.html', 'testimonials.html', 'contact.html', 'privacy.html'];
const widths = [320, 360, 375, 390, 430, 768, 1024, 1440];
const results = [];

try {
  const target = await getPageTarget();
  socket = await connect(target.webSocketDebuggerUrl);
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const handlers = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) handlers.rejectCommand(new Error(message.error.message));
    else handlers.resolveCommand(message);
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__engazAuditErrors = [];
      addEventListener('error', (event) => window.__engazAuditErrors.push(event.message || 'window error'));
      addEventListener('unhandledrejection', (event) => window.__engazAuditErrors.push(String(event.reason || 'unhandled rejection')));`,
  });

  for (const page of pageNames) {
    for (const width of widths) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: width >= 768 ? 900 : 844,
        deviceScaleFactor: 1,
        mobile: true,
        screenWidth: width,
        screenHeight: width >= 768 ? 900 : 844,
      });
      await send('Page.navigate', { url: pathToFileURL(resolve(page)).href });
      await waitForPage();
      const measurement = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const root = document.documentElement;
          const buttons = [...document.querySelectorAll('a, button, input, select, textarea')]
            .filter((node) => {
              const style = getComputedStyle(node);
              const rect = node.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
            });
          const smallTargets = buttons
            .filter((node) => {
              const rect = node.getBoundingClientRect();
              return rect.width < 44 || rect.height < 44;
            })
            .slice(0, 8)
            .map((node) => ({ tag: node.tagName, text: (node.textContent || node.getAttribute('aria-label') || '').trim().slice(0, 40), rect: node.getBoundingClientRect().toJSON() }));
          return {
            viewport: root.clientWidth,
            scrollWidth: root.scrollWidth,
            horizontalOverflow: root.scrollWidth > root.clientWidth,
            h1: document.querySelector('h1')?.textContent.trim(),
            missingIcons: [...document.querySelectorAll('i[data-lucide]')].map((node) => node.dataset.lucide),
            runtimeErrors: window.__engazAuditErrors || [],
            smallTargets
          };
        })()`,
      });
      results.push({ page, width, ...measurement.result.result.value });

      if (page === 'index.html' && width === 390) {
        await send('Runtime.evaluate', {
          expression: "document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'))",
        });
        await delay(100);
        const metrics = await send('Page.getLayoutMetrics');
        const height = Math.min(Math.ceil(metrics.result.cssContentSize.height), 14000);
        const screenshot = await send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: true,
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width, height, scale: 1 },
        });
        const output = join(tmpdir(), 'engaz-home-mobile-full.png');
        writeFileSync(output, Buffer.from(screenshot.result.data, 'base64'));
        console.log('Mobile screenshot: ' + output);
      }
    }
  }

  const interactionFailures = [];
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: 390,
    screenHeight: 844,
  });

  await send('Page.navigate', { url: pathToFileURL(resolve('index.html')).href });
  await waitForPage();
  await send('Runtime.evaluate', { expression: "document.querySelector('[data-menu-button]').click()" });
  await delay(350);
  const openMenu = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const menu = document.querySelector('[data-mobile-menu]');
      const panel = document.querySelector('[data-menu-panel]');
      return {
        expanded: document.querySelector('[data-menu-button]').getAttribute('aria-expanded'),
        hidden: menu.classList.contains('hidden'),
        bodyLocked: document.body.classList.contains('menu-open'),
        focusedInside: panel.contains(document.activeElement),
        panelRight: Math.round(panel.getBoundingClientRect().right),
      };
    })()`,
  });
  const openState = openMenu.result.result.value;
  if (openState.expanded !== 'true' || openState.hidden || !openState.bodyLocked || !openState.focusedInside || openState.panelRight !== 390) {
    interactionFailures.push('mobile navigation did not open accessibly: ' + JSON.stringify(openState));
  }
  await send('Runtime.evaluate', {
    expression: "document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))",
  });
  await delay(300);
  const closedMenu = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `({
      expanded: document.querySelector('[data-menu-button]').getAttribute('aria-expanded'),
      hidden: document.querySelector('[data-mobile-menu]').classList.contains('hidden'),
      bodyLocked: document.body.classList.contains('menu-open')
    })`,
  });
  const closedState = closedMenu.result.result.value;
  if (closedState.expanded !== 'false' || !closedState.hidden || closedState.bodyLocked) {
    interactionFailures.push('mobile navigation did not close correctly: ' + JSON.stringify(closedState));
  }

  await send('Page.navigate', { url: pathToFileURL(resolve('projects.html')).href });
  await waitForPage();
  const filterState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      document.querySelector('[data-filter="administrative"]').click();
      const visibleAfterFilter = [...document.querySelectorAll('[data-project-card]')].filter((card) => !card.classList.contains('hidden')).length;
      const search = document.querySelector('[data-project-search]');
      document.querySelector('[data-filter="all"]').click();
      search.value = 'H165';
      search.dispatchEvent(new Event('input', { bubbles: true }));
      const visibleAfterSearch = [...document.querySelectorAll('[data-project-card]')].filter((card) => !card.classList.contains('hidden')).length;
      return { visibleAfterFilter, visibleAfterSearch };
    })()`,
  });
  const projectState = filterState.result.result.value;
  if (projectState.visibleAfterFilter !== 2 || projectState.visibleAfterSearch !== 1) {
    interactionFailures.push('project filtering/search returned unexpected results: ' + JSON.stringify(projectState));
  }

  await send('Page.navigate', { url: pathToFileURL(resolve('portfolio.html')).href });
  await waitForPage();
  const compareState = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const root = document.querySelector('[data-before-after]');
      const range = root.querySelector('input[type="range"]');
      range.value = '75';
      range.dispatchEvent(new Event('input', { bubbles: true }));
      return {
        clip: root.querySelector('[data-after]').style.clipPath,
        divider: root.querySelector('[data-divider]').style.left
      };
    })()`,
  });
  const comparison = compareState.result.result.value;
  if (comparison.clip !== 'inset(0px 25% 0px 0px)' && comparison.clip !== 'inset(0 25% 0 0)') {
    interactionFailures.push('before/after control did not update: ' + JSON.stringify(comparison));
  }

  const failures = results.filter((result) => result.horizontalOverflow || !result.h1 || result.missingIcons.length || result.runtimeErrors.length);
  console.table(results.map(({ page, width, viewport, scrollWidth, missingIcons, runtimeErrors, smallTargets }) => ({
    page,
    width,
    viewport,
    scrollWidth,
    missingIcons: missingIcons.length,
    runtimeErrors: runtimeErrors.length,
    smallTargets: smallTargets.length,
  })));
  if (failures.length || interactionFailures.length) {
    if (failures.length) console.error('Responsive rendering failures:', failures);
    if (interactionFailures.length) console.error('Interaction failures:', interactionFailures);
    process.exitCode = 1;
  } else {
    const targetSamples = results.flatMap((result) => result.smallTargets.map((target) => target.text)).filter(Boolean);
    const uniqueTargetSamples = [...new Set(targetSamples)].slice(0, 12);
    if (uniqueTargetSamples.length) console.log('Small inline/link target samples (reviewed, informational):', uniqueTargetSamples);
    console.log('Responsive audit passed: no overflow, missing icons, or runtime errors across ' + results.length + ' page/viewport combinations.');
  }
} finally {
  socket?.close();
  browser.kill();
  const tempRoot = resolve(tmpdir()) + sep;
  if (resolve(profile).startsWith(tempRoot) && profile.includes('engaz-mobile-audit-')) {
    await delay(150);
    try { rmSync(profile, { recursive: true, force: true }); } catch { /* Chrome can release files shortly after exit. */ }
  }
}
