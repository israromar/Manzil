import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const stylesPath = path.join(projectRoot, 'android/app/src/main/res/values/styles.xml');
const resRoot = path.join(projectRoot, 'android/app/src/main/res');
const sourceImage = path.join(projectRoot, 'assets/images/splash-bg.jpg');

const splashStyle = `  <style name="Theme.App.SplashScreen" parent="Theme.AppCompat.DayNight.NoActionBar">
    <item name="android:windowBackground">@drawable/splashscreen_full</item>
    <item name="android:statusBarColor">#141414</item>
    <item name="android:navigationBarColor">#141414</item>
    <item name="android:windowLightStatusBar">false</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
  </style>`;

fs.mkdirSync(path.join(resRoot, 'drawable-nodpi'), { recursive: true });
fs.mkdirSync(path.join(resRoot, 'drawable'), { recursive: true });
fs.copyFileSync(sourceImage, path.join(resRoot, 'drawable-nodpi/splashscreen_background.jpg'));

const drawableXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item>
    <bitmap android:gravity="fill" android:src="@drawable/splashscreen_background" />
  </item>
</layer-list>
`;
fs.writeFileSync(path.join(resRoot, 'drawable/splashscreen_full.xml'), drawableXml);

if (!fs.existsSync(stylesPath)) {
  console.warn('Android styles.xml not found, skipping splash patch');
  process.exit(0);
}

let xml = fs.readFileSync(stylesPath, 'utf8');
if (xml.includes('splashscreen_full')) {
  console.log('Android splash styles already patched');
  process.exit(0);
}

xml = xml.replace(/\s*<style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>/, `\n${splashStyle}`);
fs.writeFileSync(stylesPath, xml);
console.log('Patched Android fullscreen splash styles');
