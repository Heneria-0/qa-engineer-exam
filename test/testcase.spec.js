const { test, expect } = require('@playwright/test');

test('Login Page Title', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    const title = await page.title();
    expect(title).toContain('Laravel'); 
});

test('Login Page Elements Presence', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    await page.waitForSelector('input[name="email"]');
    await page.waitForSelector('input[name="password"]');
    await page.waitForSelector('button[type="submit"]');
});

test('Login Page Elements Values', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    const emailValue = await page.$eval('input[name="email"]', (input) => input.value);
    const passwordValue = await page.$eval('input[name="password"]', (input) => input.value);
    const buttonText = await page.textContent('button[type="submit"]');
    
    expect(emailValue).toBe('');
    expect(passwordValue).toBe('');
    expect(buttonText).toContain('Sign In');
});

test('Interacting With Form', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    await page.type('input[name="email"]', 'test@example.com');
    await page.type('input[name="password"]', 'secret');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://127.0.0.1:8000/login'); 
});

test('Login Failure With Non-Existent User', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    await page.type('input[name="email"]', 'nonexistent@example.com');
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://127.0.0.1:8000/login');
    await expect(page.locator('div.input-group.mb-3.text-danger.justify-content-center')).toContainText('These credentials do not match our records.');

});

test('Login Failure With Empty Fields', async ({ page }) => {
    
    await page.goto('http://127.0.0.1:8000/login');
    await page.click('button[type="submit"]');
    await page.waitForSelector('div.input-group.mb-3.text-danger.justify-content-center');
    await expect(page.locator('div:text("The email field is required.")')).toContainText('The email field is required.');
    await expect(page.locator('div:text("The password field is required.")')).toContainText('The password field is required.');
    
});

test('Login Failure With Only Password', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    await page.type('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://127.0.0.1:8000/login');
    await expect(page.locator('div.input-group.mb-3.text-danger.justify-content-center')).toHaveText('The email field is required.');
});

test('Login Failure With Only Email', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    await page.type('input[name="email"]', 'admin@admin.com');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://127.0.0.1:8000/login');
    await expect(page.locator('div.input-group.mb-3.text-danger.justify-content-center')).toHaveText('The password field is required.');

});

test('Assert If Not Check', async ({ page }) => {
    await page.goto('http://127.0.0.1:8000/login');
    const rememberMeChecked = await page.isChecked('input[name="remember"]');
    expect(rememberMeChecked).toBe(false);
});
