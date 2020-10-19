import fs from 'fs';
import { remote } from 'electron';
import { handleOSTheme } from './theme';
import { initStorage } from '../storage';

function relaunch() {
  remote.app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
  remote.app.quit();
}

const storage = initStorage(remote.app, remote.systemPreferences);
const { preferencesStorage } = storage;

window.__setAccentColor = (newColor?: AccentColor) => {
  const preferences = preferencesStorage.get();
  const accentColor = newColor || preferences.accentColor;

  document.documentElement.setAttribute('data-accent-color', accentColor);

  if (newColor) {
    preferencesStorage.save({
      ...preferences,
      accentColor
    });
  }
};

window.__setTitleBar = (newTitleBar?: TitleBar, shouldRelaunch?: boolean) => {
  const preferences = preferencesStorage.get();
  const titleBar = newTitleBar || preferences.titleBar;
  document.documentElement.setAttribute('data-title-bar', titleBar);
  if (titleBar) {
    preferencesStorage.save({
      ...preferences,
      titleBar
    });

    if (shouldRelaunch) {
      relaunch();
    }
  }
};

Object.assign(window, storage);

window.platform = process.platform;
window.getCurrentWindow = remote.getCurrentWindow;
window.openExternal = remote.shell.openExternal;
window.logout = () => fs.unlinkSync(storage.TOKEN_PATH);

process.once('loaded', () => {
  handleOSTheme();
});
