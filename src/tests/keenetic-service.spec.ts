import * as puppeteer from 'puppeteer';

export class KeeneticService {
  async ToogleVpnAndReturnPreviousState(
    host: string,
    user: string,
    password: string,
  ): Promise<boolean> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await this.login(page, host, user, password);
    const response = await page.waitForResponse((response) =>
      response.url().includes('rci/interface'),
    );
    const jsonResponse = await response.json();
    const previousState = jsonResponse.PPTP0.up;

    await page.waitForSelector('input#tunnel-PPTP0-toggle');
    await page.click('input#tunnel-PPTP0-toggle');

    await setTimeout(() => browser.close(), 300);
    return previousState;
  }

  async login(
    page: puppeteer.Page,
    host: string,
    user: string,
    password: string,
  ) {
    await page.goto(host, { waitUntil: 'networkidle2' });
    await page.type('input[name="loginLogin"]', user);
    await page.type('input[name="loginPassword"]', password);
    return page.click('button[type="submit"]');
  }
}
