import { test, expect } from '@playwright/test';
import { log } from 'console';
import exp from 'constants';
import { login, logout, chatPage, acceptCookie } from '../resource/utils';

const usernameBuyer = 'qacbuyer';
const usernameFreelancer = 'qafw02'
const password = 'fwUAT@2023'

async function disablePhoneModal(page) {
    const phoneModal = page.getByRole('img', { name: 'feature-guide' });
    if (await phoneModal.isVisible()){
        await phoneModal.click();
    }
}

async function buyerChatToFreelancer(page) {
    const productName = page.locator('.search-page-card-list .title');
    const panelUsername = page.locator('.panel-user-menu ._fw-500')
    await login(page, usernameBuyer, password)
    await page.click('[data-selenium="navigation-bar.button.user-menu"]');
    await expect(panelUsername).toContainText(usernameBuyer);
    await page.click('[class="layout-home"]')
    await page.getByRole('main').getByPlaceholder('ค้นหาฟรีแลนซ์').click();
    await page.getByRole('main').getByPlaceholder('ค้นหาฟรีแลนซ์').fill('งานโลโก้ มินิมอล รับแบ่งชำระ สำหรับงานใหญ่');
    await page.getByRole('button', { name: 'ค้นหา' }).click();
    await expect(productName).toContainText('งานโลโก้ มินิมอล รับแบ่งชำระ สำหรับงานใหญ่');
    await productName.click();
    
    const pagePromise = page.waitForEvent('popup');
    const productPage = await pagePromise;
    const headingProduct = page.getByRole('heading', { name: 'งานโลโก้ มินิมอล รับแบ่งชำระ สำหรับงานใหญ่', exact: true });
    const userProfileLink = productPage.locator('[data-selenium="chat-header.user-profile.name.link"]');

    await productPage.waitForLoadState('networkidle');
    await expect(headingProduct).toBeVisible();
    await productPage.click('[data-selenium="product-detail.button.select-package1"]');
    await productPage.waitForLoadState('networkidle');
    await productPage.waitForSelector('[data-selenium="chat-header.user-profile.name.link"]');
    await expect(userProfileLink.locator('div')).toHaveText('qafw02');
    await productPage.getByRole('img', { name: 'feature-guide' }).click();
    await productPage.getByPlaceholder('พิมพ์ข้อความที่นี่').click();
    await productPage.getByPlaceholder('พิมพ์ข้อความที่นี่').fill('เปลี่ยนเป็น 4 งวด');
    await productPage.getByPlaceholder('พิมพ์ข้อความที่นี่').press('Enter');
}

async function dateLocator(page, number) {
    const { DateTime } = require('luxon');
    const today = DateTime.now();
    const tomorrow = today.plus({ days: 1 });
    const todayFormatted = today.toFormat('cccc, MMMM d, yyyy');
    const tomorrowFormatted = tomorrow.toFormat('cccc, MMMM d, yyyy');

    await page.locator(`input[name="startDate\\[${number}\\]"]`).click({ force: true });
    await page.getByLabel(`Choose ${todayFormatted}`).click({ force: true });
    const startDateValue = await page.locator(`input[name="startDate\\[${number}\\]"]`).inputValue();
    if (!startDateValue) {
        throw new Error('Start date not set');
    }

    await page.locator(`input[name="endDate\\[${number}\\]"]`).click({ force: true });
    await page.getByLabel(`Choose ${tomorrowFormatted}`).click({ force: true });
    const endDateValue = await page.locator(`input[name="endDate\\[${number}\\]"]`).inputValue();
    if (!endDateValue) {
        throw new Error('End date not set');
    }
}

async function paymentInstallment(page) {

    await page.waitForLoadState('networkidle');
    await chatPage(page, 'qacbuyer')
    await page.getByText('เสนอราคาแบบแบ่งชำระ').click({ force: true });
    await page.waitForTimeout(5000)
    await disablePhoneModal(page)
    await page.getByPlaceholder('ระบุชื่องานเพื่อให้จดจำได้ง่าย').click();
    await page.getByPlaceholder('ระบุชื่องานเพื่อให้จดจำได้ง่าย').fill('Test')
    await page.getByPlaceholder('เช่น ออกแบบโมเดลสินค้าประเภทขวด ให้แบรนด์ Fastwork ทั้งหมด 3 ไซส์ (500ml, 1L, 5L)').click();
    await page.getByPlaceholder('เช่น ออกแบบโมเดลสินค้าประเภทขวด ให้แบรนด์ Fastwork ทั้งหมด 3 ไซส์ (500ml, 1L, 5L)').fill('Test Detail of work');
    await page.getByRole('button', { name: 'ถัดไป', exact: true }).click();
    await page.getByRole('button', { name: 'ใบเสนอราคา Order ID :' }).getByRole('button').nth(1).click();
    await page.getByRole('button', { name: 'ใบเสนอราคา Order ID :' }).getByRole('button').nth(1).click();
    await page.locator('input[name="price\\[0\\]"]').click({ force: true });
    await page.locator('input[name="price\\[0\\]"]').fill('5000');
    await dateLocator(page,0)
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(0).click({ force: true });
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(0).fill('Test: สิ่งที่ลูกค้าจะได้รับ 1');
    await page.locator('input[name="price\\[1\\]"]').click({ force: true });
    await page.locator('input[name="price\\[1\\]"]').fill('5000');
    await dateLocator(page,1)
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(1).click({ force: true });
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(1).fill('Test: สิ่งที่ลูกค้าจะได้รับ 2');
    await page.locator('input[name="price\\[2\\]"]').click({ force: true });
    await page.locator('input[name="price\\[2\\]"]').fill('5000');
    await dateLocator(page,2)
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(2).click({ force: true });
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(2).fill('Test: สิ่งที่ลูกค้าจะได้รับ 3');
    await page.locator('input[name="price\\[3\\]"]').click({ force: true });
    await page.locator('input[name="price\\[3\\]"]').fill('5000');
    await dateLocator(page,3)
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(3).click({ force: true });
    await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(3).fill('Test: สิ่งที่ลูกค้าจะได้รับ 4');
    await page.getByRole('button', { name: 'ถัดไป', exact: true }).click();
    await page.waitForTimeout(5000)
    await page.getByLabel('ฉันยอมรับข้อตกลงและเงื่อนไข').check();
    await page.getByRole('button', { name: 'ยืนยัน', exact: true }).click();
    await page.waitForTimeout(5000)
    await page.getByRole('button', { name: 'กลับหน้าแชท', exact: true }).click();
}

async function waitForProcessingToFinish(page) {
    const processingLocator = page.locator('text="กำลังดำเนินการ... กรุณาอย่าปิดหน้าจอ จนกว่าจะสำเร็จ"');
    await page.waitForTimeout(5000)
    await expect(processingLocator).toBeHidden();
}

async function creditCardPayment(page) {
    const paymentMethodPanel = page.locator('[class="payment-method-panel"]');
    //await page.getByText('ชำระเงิน', { exact: true }).first().click({force:true})
    await page.click('[data-selenium="chat.quick-action-buyer.purchase"]')
    await page.waitForLoadState('networkidle')
    await expect(paymentMethodPanel).toBeVisible()
    await waitForProcessingToFinish(page);
    await disablePhoneModal(page)
    const creditMethod = page.locator('.tab .tab-item .text', { hasText: 'บัตรเครดิต' });
    await creditMethod.waitFor({ state: 'visible', timeout: 30000 });
    await creditMethod.click({ force: true });
    await page.getByPlaceholder('Card Number').click({ force: true });
    await page.getByPlaceholder('Card Number').fill('4242424242424242');
    await page.getByPlaceholder('Card Holder Name').click({ force: true });
    await page.getByPlaceholder('Card Holder Name').fill('Test Test');
    await page.getByPlaceholder('MM/YY').click({ force: true });
    await page.getByPlaceholder('MM/YY').fill('12/24');
    await page.getByPlaceholder('CVC').click({ force: true });
    await page.getByPlaceholder('CVC').fill('123');
    await page.getByRole('button', { name: 'ชำระจำนวน 5,170.00 บาท', exact: true }).click();
    await page.waitForProcessingToFinish(page)
}
async function freelanceSendWork(page) {
    await login(page, usernameFreelancer, password)
    await chatPage(page, 'qacbuyer')
    await page.getByText('ส่งงาน', { exact: true }).click();
    await page.getByPlaceholder('URL').click();
    await page.getByPlaceholder('URL').fill('https://chat-staging.fastwork.co/');
    await page.getByLabel('ฉันยอมรับเงื่อนไขการส่งงาน').check();
    await page.getByRole('button', { name: 'ยืนยันการส่งงาน', exact: true }).click();
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('ฟรีแลนซ์ส่งงานให้ตรวจสอบและอนุมัติ')).toBeVisible();
}
test.describe('e2e 4 round payment', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://staging.fastwork.co/');
        await page.locator('._cs-pt > .fal').click();
        await acceptCookie(page)
    });
    test('Buyer hire and request for quoation', async ({ page }) => {
        await buyerChatToFreelancer(page)
    });
    test('Freelancer create 4-round payment installation quotation', async ({ page }) => {
        await login(page, usernameFreelancer, password);
        await chatPage(page, 'qacbuyer');
        await disablePhoneModal(page)
        await paymentInstallment(page);
    });
    test('Buyer pay to freelancer', async ({ page }) => {
        await login(page, usernameBuyer, password);
        await chatPage(page, 'qafw02');
        await page.reload();
        await page.waitForLoadState('networkidle');
        await disablePhoneModal(page)
        await page.getByText('ชำระเงิน', { exact: true }).first().click({force:true})
        await page.getByLabel('ฉันได้ตรวจสอบใบเสนอราคาและเงื่อนไขข้อตกลงเรียบร้อยแล้ว').check();
        await page.getByRole('button', { name: 'ยืนยันใบเสนอราคา', exact: true }).click();
        await disablePhoneModal(page);
        await page.waitForSelector('text=ราคาที่ต้องชำระในงวดปัจจุบัน', { timeout: 30000 });
        await page.locator('button.trb-button.is-fluid', { hasText: 'ชำระเงิน' }).click({ force: true });
        await page.waitForTimeout(5000)
        await page.reload();
        await page.waitForLoadState('networkidle')
        await page.waitForSelector('[data-selenium="chat.quick-action-buyer.purchase"]')
        await creditCardPayment(page);
        await page.waitForTimeout(20000);
        await page.reload()
        await page.waitForLoadState('networkidle')
        await expect(page.getByRole('heading', { name: 'ใบเสร็จรับเงิน งวดที่ ' })).toBeVisible();
    });
    test('Buyer accept work and start a new round', async ({ page }) => {
        await freelanceSendWork(page);
        await logout(page)
        await page.waitForTimeout(5000)
        await login(page, usernameBuyer, password)
        await chatPage(page, 'qafw02')
        await disablePhoneModal(page)
        await page.getByText('อนุมัติงาน', { exact: true }).click({ force: true });
        await page.getByRole('button', { name: 'อนุมัติงาน' }).click({ force: true });
        await expect(page.locator('p').filter({ hasText: 'ยินดีด้วย! ผู้ว่าจ้างอนุมัติงานแล้ว (ระบบจะทำการโอนเงินให้กับฟรีแลนซ์ ตามรอบโอนเงินของ Fastwork ต่อไป' })).toBeVisible();
        await page.getByText('เริ่มงานรอบถัดไป', { exact: true }).click({ force: true });
        await page.locator('text="ดูแชทรอบงานอื่น"').click({force:true})
        await page.locator('.mile-stone-option').nth(1).click({force:true});
        await creditCardPayment(page)
        await waitForProcessingToFinish(page);
        await page.reload()
        await page.waitForLoadState('networkidle')
        await expect(page.getByRole('heading', { name: 'ใบเสร็จรับเงิน งวดที่ ' })).toBeVisible();
    });
    test('Buyer terminate a job', async ({ page }) => {
        await freelanceSendWork(page);
        await logout(page)
        await page.waitForTimeout(5000)
        await login(page, usernameBuyer, password)
        await chatPage(page, 'qafw02')
        await page.getByText('อนุมัติงาน', { exact: true }).click({ force: true });
        await page.locator('button.swal2-confirm.trb-button.is-variant-primary', { hasText: 'อนุมัติงาน' }).click({ force: true });
        await page.reload();
        await page.waitForLoadState('networkidle')
        await disablePhoneModal(page)
        await page.getByText('ยุติการจ้างงาน', { exact: true }).first().click();
        await page.waitForSelector('text=บอกเราหน่อยว่าทำไมคุณถึงต้องการเลิกจ้างฟรีแลนซ์คนนี้?');
        const terminateReason = page.locator('textarea[placeholder="ฟรีแลนซ์ทำงานได้ดี แต่ผลลัพธ์ยังไม่ตรงใจเท่าไหร่ คิดว่าหาคนใหม่ที่ตรงกว่านี้ดีกว่า"]');
        await terminateReason.fill('ฟรีแลนซ์ทำงานได้ดี แต่ผลลัพธ์ยังไม่ตรงใจเท่าไหร่ คิดว่าหาคนใหม่ที่ตรงกว่านี้ดีกว่าค่ะ');
        await page.getByRole('button', { name: 'ยืนยันยุติการจ้างงาน', exact: true }).click({force:true});
        await page.waitForLoadState('networkidle')
        await expect(page.locator('p').filter({ hasText: 'การจ้างงานถูกยุติ ฟรีแลนซ์สามารถสอบถามรายละเอียดการยุติการจ้างงานจากผู้ว่าจ้างได้โดยตรง' })).toBeVisible();
    });
});
