import { browser, by, element } from 'protractor';

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  async getTitle(): Promise<string> {
    return element(by.css('app-root .headerBar h1')).getText();
  }

  async getTableRows(): Promise<number> {
    return element.all(by.css('app-root .mat-table tr')).then((rows) => {
      return rows.length;
    });
  }

  async getOpenedAddModalHeader(): Promise<string> {
    return element(by.css('.modal-dialog .modal-header h5')).getText();
  }
}
