import { expect } from '@playwright/test';

async function countError(page, text){
    const error = page.locator(`small:has-text("${text}")`);
    const errorCount = await error.count();
    for (let i = 0; i < errorCount; i++) {
        const fieldValidation = error.nth(i);
        await expect(fieldValidation).toBeVisible();
    }
}

export { countError }
