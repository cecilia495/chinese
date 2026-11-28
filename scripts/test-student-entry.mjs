import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM || '/usr/bin/chromium',args:['--no-sandbox']});
try {
 const base=process.env.STUDENT_TEST_URL || 'http://127.0.0.1:3748/chinese';
 for (const width of [375,1280]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto(base+'/');
  assert.equal(await page.locator('main a.button').count(),1);
  await page.getByText('先选语言和程度',{exact:true}).click();
  await page.locator('.home-setup form select').first().selectOption('ar');
  await page.locator('.home-setup form select').nth(1).selectOption('2');
  await page.getByRole('button',{name:'保存选择'}).click();
  await page.waitForFunction(()=>document.documentElement.dir==='rtl');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('link',{name:'ابدأ التحدّث بالصينية',exact:true}).click();
  await page.waitForURL('**/learn/2/');
  await page.getByRole('button',{name:'متابعة',exact:true}).click();
  await page.getByRole('button',{name:'استمع بالماندرين',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.lesson-panel audio')?.currentTime>.1);
  await page.goto(base+'/');
  await page.getByRole('link',{name:'تابع التمرين',exact:true}).click();
  await page.getByRole('heading',{name:'استمع إلى الحوار',exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  await page.close();
  console.log(width+'px: setup, Arabic RTL, HSK 2, audio, and session resume passed');
 }
 const direct=await browser.newPage();
 await direct.goto(base+'/');
 await direct.getByRole('link',{name:'开始说中文',exact:true}).click();
 await direct.waitForURL('**/learn/1/');
 console.log('First visit can enter HSK 1 without setup');
} finally {await browser.close();}
