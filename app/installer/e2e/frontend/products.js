import { By } from 'selenium-webdriver';
import { after, describe, it } from 'selenium-webdriver/testing';
import driver from 'nodium/lib/driver';
import utils from 'nodium/lib/driver/utils';
import chai, { expect } from 'chai';

chai.use(require('chai-as-promised'));
chai.use(require('chai-webdriver')(driver));

describe('Products', function () { // eslint-disable-line func-names
    this.timeout(15000);

    it('user should see the product list', () => {
        driver.get('http://localhost:8081/#/products');
        utils(driver).waitForElementVisible(By.css('.product-item'));
        expect('.product-item').dom.to.have.count(3);
    });

    it('user should see the product details', () => {
        driver.get('http://localhost:8081/#/products/1');
        utils(driver).waitForElementVisible(By.css('.product-details'));
        expect('.product-details').dom.to.be.visible();
        expect('.img-thumbnail').dom.to.be.visible();
        expect('.img-thumbnail').dom.to.have.attribute('src', 'http://lorempixel.com/400/400/');
        expect('h2').dom.to.have.text('abc');
        expect('.description').dom.to.have.text('John the zoo');
        expect('.price').dom.to.have.text('Price: $3.40');
    });

    after(() => {
        driver.quit();
    });
});
