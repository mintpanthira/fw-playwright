import { expect } from '@playwright/test';
const { DateTime } = require('luxon');

async function login(page, username, password) {
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).waitFor({ state: 'visible' });
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.locator('input[placeholder="Email or Phone number"], input[placeholder="อีเมลหรือหมายเลขโทรศัพท์"]').click();
    await page.locator('input[placeholder="Email or Phone number"], input[placeholder="อีเมลหรือหมายเลขโทรศัพท์"]').fill(username);
    await page.locator('input[placeholder="Email or Phone number"], input[placeholder="อีเมลหรือหมายเลขโทรศัพท์"]').press('Enter');
    await page.getByPlaceholder('รหัสผ่าน').click();
    await page.getByPlaceholder('รหัสผ่าน').fill(password);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click({ force: true });
}

async function logout(page) {
    const logoutButton = page.locator('[data-selenium="user-menu-panel.link.sign-out"]');
    await page.click('[data-selenium="navigation-bar.button.user-menu"]', { force: true });
    await logoutButton.waitFor({ state: 'visible' });
    await logoutButton.click({ force: true });
    // if (await logoutButton.count() > 0) {
    //     await logoutButton.scrollIntoViewIfNeeded();
    //     await logoutButton.click({ force: true });
    // }
}

async function goToChatPage(page, name) {
    await page.waitForSelector('[data-selenium="navigation-bar.button.chat-notification"]')
    await page.click('[data-selenium="navigation-bar.button.chat-notification"]');
    await page.locator(`div >> text="${name}"`).nth(0).waitFor({state: 'visible'})
    await page.locator(`div >> text="${name}"`).nth(0).click({ force: true });
}

async function acceptCookie(page) {
    const acceptAllButton = page.locator('button:has-text("ยินยอมทั้งหมด")');
    if (await acceptAllButton.count() > 0) {
        await acceptAllButton.waitFor({ state: 'visible', timeout: 30000 });
        await acceptAllButton.click({ force: true });
    }
}

async function disablePhoneModal(page) {
    const phoneModal = page.getByRole('img', { name: 'feature-guide' });
    if (await phoneModal.isVisible()) {
        await phoneModal.click();
    }
}

async function dateLocator(page, number) {
    const today = DateTime.now();
    const tomorrow = today.plus({ days: 1 });
    const todayFormatted = today.toFormat('cccc, MMMM d, yyyy');
    const tomorrowFormatted = tomorrow.toFormat('cccc, MMMM d, yyyy');

    await page.locator(`input[name="startDate[${number}]"]`).click({ force: true });
    await page.getByLabel(`Choose ${todayFormatted}`).click({ force: true });
    const startDateValue = await page.locator(`input[name="startDate\\[${number}\\]"]`).inputValue();
    if (!startDateValue) {
        throw new Error('Start date not set');
    }
    await page.getByLabel(`Choose ${tomorrowFormatted}`).click({ force: true });
}

async function inputFormDetail(page) {
    const price = page.locator('label:has-text("ราคางาน")');
    const countPrice = await price.count();
    for (let i = 0; i < countPrice; i++) {
        await page.locator(`input[name="price\\[${i}\\]"]`).click({ force: true });
        await page.locator(`input[name="price\\[${i}\\]"]`).fill('5000');

        await dateLocator(page, i);

        await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(i).click({ force: true });
        await page.getByPlaceholder('สิ่งที่ลูกค้าจะได้รับในแต่ละงวด').nth(i).fill(`Test: สิ่งที่ลูกค้าจะได้รับ ${i + 1}`);
    }
}

export {
    login,
    logout,
    goToChatPage,
    acceptCookie,
    disablePhoneModal,
    dateLocator,
    inputFormDetail
}