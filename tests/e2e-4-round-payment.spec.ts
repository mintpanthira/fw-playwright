import { test, expect } from '@playwright/test';
import { 
        login, 
        logout, 
        goToChatPage, 
        acceptCookie, 
        disablePhoneModal, 
        inputFormDetail } 
from '../resource/utils';
import {usernameBuyer, usernameFreelancer, password} from '../resource/test_data/user.json'

async function paymentInstallment(page) {

    await goToChatPage(page, 'qacbuyer')
    await page.getByText('เสนอราคาแบบแบ่งชำระ').click({ force: true });
    await disablePhoneModal(page)
    await page.getByPlaceholder('ระบุชื่องานเพื่อให้จดจำได้ง่าย').click();
    await page.getByPlaceholder('ระบุชื่องานเพื่อให้จดจำได้ง่าย').fill('Test')
    await page.getByPlaceholder('เช่น ออกแบบโมเดลสินค้าประเภทขวด ให้แบรนด์ Fastwork ทั้งหมด 3 ไซส์ (500ml, 1L, 5L)').click();
    await page.getByPlaceholder('เช่น ออกแบบโมเดลสินค้าประเภทขวด ให้แบรนด์ Fastwork ทั้งหมด 3 ไซส์ (500ml, 1L, 5L)').fill('Test Detail of work');
    await page.getByRole('button', { name: 'ถัดไป', exact: true }).click();
    await page.locator('.progress-step .active').nth(1).waitFor({state: 'attached'});
    await inputFormDetail(page, 2)
    await page.getByRole('button', { name: 'ถัดไป', exact: true }).click({force: true});
    await page.getByLabel('ฉันยอมรับข้อตกลงและเงื่อนไข').check();
    await page.getByRole('button', { name: 'ยืนยัน', exact: true }).click();
    await page.getByRole('button', { name: 'กลับหน้าแชท', exact: true }).click();
}

async function waitForProcessingToFinish(page) {
    const processingLocator = page.locator('text="กำลังดำเนินการ... กรุณาอย่าปิดหน้าจอ จนกว่าจะสำเร็จ"');
    await expect(processingLocator).toBeHidden();
}

async function creditCardPayment(page) {
    const paymentMethodPanel = page.locator('[class="payment-method-panel"]');
    await page.click('[data-selenium="chat.quick-action-buyer.purchase"]')
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
    const processingLocator = page.locator('text="กำลังดำเนินการ... กรุณาอย่าปิดหน้าจอ จนกว่าจะสำเร็จ"');
    await expect(processingLocator).toBeHidden();

}

async function freelanceSendWork(page) {
    await goToChatPage(page, 'qacbuyer')
    await page.getByText('ส่งงาน', { exact: true }).click();
    await page.getByPlaceholder('URL').click();
    await page.getByPlaceholder('URL').fill('https://chat-staging.fastwork.co/');
    await page.getByLabel('ฉันยอมรับเงื่อนไขการส่งงาน').check();
    await page.getByRole('button', { name: 'ยืนยันการส่งงาน', exact: true }).click();
    await page.reload()
    await expect(page.getByText('ฟรีแลนซ์ส่งงานให้ตรวจสอบและอนุมัติ')).toBeVisible();
}

test.describe('e2e 4 round payment', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://staging.fastwork.co/');
        await page.locator('._cs-pt > .fal').click();
        await acceptCookie(page)
    });

    test('Buyer hire and request for quoation', async ({ page }) => {
        test.slow()

        const panelUsername = page.locator('.panel-user-menu ._fw-500')
        await login(page, usernameBuyer, password)
        await page.click('[data-selenium="navigation-bar.button.user-menu"]');
        await expect(panelUsername).toContainText(usernameBuyer);

        const productName = page.locator('.search-page-card-list .title');
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
        
        //buyerChatToFreelancer
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
        await logout(productPage);

        //create quotation
        await login(productPage, usernameFreelancer, password);
        await goToChatPage(productPage, 'qacbuyer');
        await disablePhoneModal(productPage)
        await paymentInstallment(productPage);
        await logout(productPage);

        //pay to freelancer
        await login(productPage, usernameBuyer, password);
        await goToChatPage(productPage, 'qafw02');
        await disablePhoneModal(productPage);
        await productPage.locator('[data-selenium="chat.quick-action-buyer.purchase"]').first().click({force:true});
        await productPage.getByLabel('ฉันได้ตรวจสอบใบเสนอราคาและเงื่อนไขข้อตกลงเรียบร้อยแล้ว').check();
        await productPage.getByRole('button', { name: 'ยืนยันใบเสนอราคา', exact: true }).click();
        await disablePhoneModal(productPage);
        await productPage.waitForSelector('text=ราคาที่ต้องชำระในงวดปัจจุบัน', { timeout: 30000 });
        await productPage.locator('button.trb-button.is-fluid', { hasText: 'ชำระเงิน' }).click({ force: true });
        await productPage.reload();
        await productPage.waitForSelector('[data-selenium="chat.quick-action-buyer.purchase"]')
        await creditCardPayment(productPage);
        await productPage.reload()
        await productPage.locator(`div >> text="qafw02"`).nth(0).waitFor({state: 'visible'});
        await productPage.locator(`div >> text="qafw02"`).nth(0).click({ force: true });
        await expect(productPage.getByRole('heading', { name: 'ใบเสร็จรับเงิน งวดที่ ' })).toBeVisible();
        await logout(productPage)

        //freelancer send a work
        await login(productPage, usernameFreelancer, password)
        await freelanceSendWork(productPage);
        await logout(productPage)
        await login(productPage, usernameBuyer, password)
        await goToChatPage(productPage, 'qafw02')
        await disablePhoneModal(productPage)
        await productPage.getByText('อนุมัติงาน', { exact: true }).click({ force: true });
        await productPage.getByRole('button', { name: 'อนุมัติงาน' }).click({ force: true });
        await expect(productPage.locator('p').filter({ hasText: 'ยินดีด้วย! ผู้ว่าจ้างอนุมัติงานแล้ว (ระบบจะทำการโอนเงินให้กับฟรีแลนซ์ ตามรอบโอนเงินของ Fastwork ต่อไป' })).toBeVisible();
        await productPage.getByText('เริ่มงานรอบถัดไป', { exact: true }).click({ force: true });
        await productPage.locator('text="ดูแชทรอบงานอื่น"').click({force:true})
        await productPage.locator('.mile-stone-option').nth(1).click({force:true});
        await creditCardPayment(productPage)
        await waitForProcessingToFinish(productPage);
        await productPage.reload()
        await productPage.locator(`div >> text="qafw02"`).nth(0).waitFor({state: 'visible'});
        await productPage.locator(`div >> text="qafw02"`).nth(0).click({ force: true });
        await expect(productPage.getByRole('heading', { name: 'ใบเสร็จรับเงิน งวดที่ ' })).toBeVisible();
        await logout(productPage)
    
        //terminate a job
        await login(productPage, usernameFreelancer, password)
        await freelanceSendWork(productPage);
        await logout(productPage)
        await login(productPage, usernameBuyer, password)
        await goToChatPage(productPage, 'qafw02')
        await productPage.getByText('อนุมัติงาน', { exact: true }).click({ force: true });
        await productPage.locator('button.swal2-confirm.trb-button.is-variant-primary', { hasText: 'อนุมัติงาน' }).click({ force: true });
        await productPage.reload();
        await disablePhoneModal(productPage)
        await productPage.getByText('ยุติการจ้างงาน', { exact: true }).first().click();
        await productPage.waitForSelector('text=บอกเราหน่อยว่าทำไมคุณถึงต้องการเลิกจ้างฟรีแลนซ์คนนี้?');
        const terminateReason = page.locator('textarea[placeholder="ฟรีแลนซ์ทำงานได้ดี แต่ผลลัพธ์ยังไม่ตรงใจเท่าไหร่ คิดว่าหาคนใหม่ที่ตรงกว่านี้ดีกว่า"]');
        await terminateReason.fill('ฟรีแลนซ์ทำงานได้ดี แต่ผลลัพธ์ยังไม่ตรงใจเท่าไหร่ คิดว่าหาคนใหม่ที่ตรงกว่านี้ดีกว่าค่ะ');
        await productPage.getByRole('button', { name: 'ยืนยันยุติการจ้างงาน', exact: true }).click({force:true});
        await expect(productPage.locator('p').filter({ hasText: 'การจ้างงานถูกยุติ ฟรีแลนซ์สามารถสอบถามรายละเอียดการยุติการจ้างงานจากผู้ว่าจ้างได้โดยตรง' })).toBeVisible();
    });
});
