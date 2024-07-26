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
    console.log(number)
    const today = DateTime.now();
    const tomorrow = today.plus({ days: 1 });
    const todayFormatted = today.toFormat('cccc, MMMM d, yyyy');
    const tomorrowFormatted = tomorrow.toFormat('cccc, MMMM d, yyyy');
    console.log(todayFormatted)
    console.log(tomorrowFormatted)

    const expectToday = today.toFormat('dd/MM/yyyy');
    const expectTomorrow = tomorrow.toFormat('dd/MM/yyyy');

    await page.locator(`input[name="startDate[${number}]"]`).click({ force: true });
    await page.locator('.day-range-picker__float-calendar').waitFor({state: 'attached'})
    await page.getByLabel(`Choose ${todayFormatted} as your check-in date. It’s available.`).dispatchEvent("click");
    await page.getByLabel(`Choose ${tomorrowFormatted}`).dispatchEvent("click")
  
    const stDateValue = await page.locator(`input[name="startDate[${number}]"]`).inputValue();
    const endDateValue = await page.locator(`input[name="endDate[${number}]"]`).inputValue();

    console.log(stDateValue)
    console.log(endDateValue)
}

async function inputFormDetail(page, addRound) {
    
    const plusBut = page.getByRole('button', { name: 'ใบเสนอราคา Order ID :' }).getByRole('button').nth(1);
    if(addRound != 0){
        for(let i = 0; i< addRound; i++){
            await plusBut.click({ force: true });
        }
    }
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