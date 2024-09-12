import * as puppeteer from 'puppeteer';

export class KeeneticService {
  private static async login(
    page: puppeteer.Page,
    host: string,
    user: string,
    password: string,
  ): Promise<void> {
    await page.goto(host);

    await page.waitForSelector('input[name="loginLogin"]');
    await page.waitForSelector('input[name="loginPassword"]');
    await page.waitForSelector('button[type="submit"]');

    await page.type('input[name="loginLogin"]', user);
    await page.type('input[name="loginPassword"]', password);

    return page.click('button[type="submit"]');
  }

  public static async toggleVpnAndReturnPreviousState(
    host: string,
    user: string,
    password: string,
  ): Promise<boolean> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await KeeneticService.login(page, host, user, password);
    const response = await page.waitForResponse((response) =>
      response.url().includes('rci/interface'),
    );
    const jsonResponse = await response.json();

    const previousState = jsonResponse.PPTP0.up;

    await page.waitForSelector('input#tunnel-PPTP0-toggle');
    await page.click('input#tunnel-PPTP0-toggle');

    await new Promise((resolve) => setTimeout(resolve, 300));

    await browser.close();
    return previousState;
  }
}
