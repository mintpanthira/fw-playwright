import { test, expect } from '@playwright/test';
import { 
    login, 
    logout, 
    goToChatPage, 
    acceptCookie, 
    disablePhoneModal, 
    inputFormDetail } from '../resource/utils';
import {countError} from '../resource/validate-utils'
import {usernameBuyer, usernameFreelancer, password} from '../resource/test_data/user.json'

const errorDetail = "กรุณากรอกข้อมูล";
const errorDate = "กรุณาระบุวันที่ให้ถูกต้อง";

test.describe('validate-field-quatation-form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://staging.fastwork.co/');
        await page.locator('._cs-pt > .fal').click();
        await acceptCookie(page)
    });
    test('Validate Quotation', async ({ page }) => {
        test.slow()

        await login(page, usernameBuyer, password);     
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
        
        //Freelancer create quotation (validate)
        await login(productPage, usernameFreelancer, password);
        await goToChatPage(productPage, 'qacbuyer');
        await disablePhoneModal(productPage);
        await goToChatPage(productPage, 'qacbuyer');
        await disablePhoneModal(productPage);
        await productPage.getByText('เสนอราคาแบบแบ่งชำระ').click({ force: true });
        await productPage.getByRole('button', { name: 'ถัดไป', exact: true }).waitFor({state: 'visible'});
        await productPage.getByRole('button', { name: 'ถัดไป', exact: true }).click({ force: true });
        await productPage.waitForSelector('small:has-text("กรุณากรอกข้อมูล")');
        await countError(productPage,errorDetail);
        await productPage.getByPlaceholder('ระบุชื่องานเพื่อให้จดจำได้ง่าย').fill('Test');
        await productPage.getByPlaceholder('เช่น ออกแบบโมเดลสินค้าประเภทขวด ให้แบรนด์ Fastwork ทั้งหมด 3 ไซส์ (500ml, 1L, 5L)').click({ force: true });
        await productPage.getByPlaceholder('เช่น ออกแบบโมเดลสินค้าประเภทขวด ให้แบรนด์ Fastwork ทั้งหมด 3 ไซส์ (500ml, 1L, 5L)').fill('Test Detail of work');
        await productPage.getByRole('button', { name: 'ถัดไป', exact: true }).click({ force: true });
        await productPage.locator('.progress-step .active').nth(1).waitFor({state: 'attached'});
        await productPage.getByRole('button', { name: 'ถัดไป', exact: true }).click({ force: true });
        await productPage.locator('small:has-text("กรุณากรอกข้อมูล")').nth(0).waitFor({state: 'visible'});
        await countError(productPage,errorDetail);
        await countError(productPage,errorDate);
        await inputFormDetail(productPage,0);
        await productPage.getByRole('button', { name: 'ถัดไป', exact: true }).click();
        const confirmButton = productPage.getByRole('button', { name: 'ยืนยัน', exact: true });
        await expect(confirmButton).toBeDisabled();
    });
});
