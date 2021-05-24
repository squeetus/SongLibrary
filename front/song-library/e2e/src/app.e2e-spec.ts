import { browser, logging, element, by } from 'protractor';
import { AppPage } from './app.po';

describe('song-library App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display the page title', async () => {
    await page.navigateTo();
    expect(await page.getTitle()).toEqual('SONG LIBRARY');
  });

  it('should display Song data in the table', async () => {
    await page.navigateTo();
    expect(await page.getTableRows()).toEqual(6);
  });

  it('should open the add modal on click', async () => {
    await page.navigateTo();
    await element(by.css('app-root add-modal .btn-primary')).click();
    expect(await page.getOpenedAddModalHeader()).toEqual('Add a new Song');
  });

  it('should delete the first song in the table', async () => {
    await page.navigateTo();
    await element(by.css('app-root .mat-table delete-modal .btn-danger')).click();
    await element(by.css('.modal-dialog .modal-footer .btn-danger')).click();
    browser.driver.sleep(1000);
    browser.waitForAngular();
    expect(await page.getTableRows()).toEqual(5);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
