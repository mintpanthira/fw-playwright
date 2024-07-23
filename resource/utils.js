async function login(page, username, password){
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.locator('input[placeholder="Email or Phone number"], input[placeholder="อีเมลหรือหมายเลขโทรศัพท์"]').click();
    await page.locator('input[placeholder="Email or Phone number"], input[placeholder="อีเมลหรือหมายเลขโทรศัพท์"]').fill(username);
    await page.locator('input[placeholder="Email or Phone number"], input[placeholder="อีเมลหรือหมายเลขโทรศัพท์"]').press('Enter');
    await page.getByPlaceholder('รหัสผ่าน').click();
    await page.getByPlaceholder('รหัสผ่าน').fill(password);
    await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click({force : true});
    await page.waitForLoadState('networkidle')
}

async function logout(page) {
    const logoutButton = page.locator('[data-selenium="user-menu-panel.link.sign-out"]');
    if (await logoutButton.count() > 0) {
        await logoutButton.scrollIntoViewIfNeeded();
        await logoutButton.waitFor({ state: 'visible', timeout: 30000 });
        await logoutButton.click({ force: true });
    }
}

async function chatPage(page, name) {
    await page.click('[data-selenium="navigation-bar.button.chat-notification"]');
    await page.waitForTimeout(5000);
    await page.locator(`div >> text="${name}"`).nth(0).click({force:true}); 
}

async function acceptCookie(page){
    const acceptAllButton = page.locator('button:has-text("ยินยอมทั้งหมด")');
    if (await acceptAllButton.count() > 0) {
        await acceptAllButton.waitFor({ state: 'visible', timeout: 30000 });
        await acceptAllButton.click({ force: true });
    }
}
export {login, logout, chatPage, acceptCookie}