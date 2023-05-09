import { element, by, protractor } from 'protractor';

import { AngularMentionsPage } from './app.po';
import { TagName } from './app.po';

describe('angular-social-mentions app', function() {
  let page: AngularMentionsPage;

  beforeEach(() => {
    page = new AngularMentionsPage();
  })

  it('test mentions text field', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.css('input')).first();
    testMentions(el, 'input');
  });

  it('test mentions text area', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.css('textarea')).first();
    testMentions(el, 'textarea');
  });

  it('test mentions div', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.css('div')).first();
    testMentions(el, 'div');
  });

  it('test mentions iframe', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Mentions');
    let el = element.all(by.css('editor iframe'));
    // iframe testing workaround - sendKeys is not working unless menu is opened first
    // this wasn't needed in previous versions of angular/protractor
    // el.click();
    // el.sendKeys('@');
    // el.sendKeys(protractor.Key.BACK_SPACE);
    // end iframe testing workaround
    testMentions(el, 'tinymce');
  });

  function testMentions(el, tagName: TagName){
    let menu = element(by.css('.dropdown-menu'));
    el.click();
    expect(page.getValue(el, tagName)).toEqual('');

    // test for git issue #59
    el.sendKeys('@');
    expect(menu.isDisplayed()).toBe(true);
    el.sendKeys(protractor.Key.BACK_SPACE);
    expect(menu.isDisplayed()).toBe(false);
    el.sendKeys('xa');
    expect(menu.isDisplayed()).toBe(false);
    el.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
    expect(page.getValue(el, tagName)).toEqual('');

    // another variation of issue #59
    el.sendKeys('xx @');
    expect(menu.isDisplayed()).toBe(true);
    el.sendKeys(protractor.Key.BACK_SPACE);
    expect(menu.isDisplayed()).toBe(false);
    el.sendKeys('xa');
    expect(menu.isDisplayed()).toBe(false);
    // el.clear(); // clear does not work for tinymce
    el.sendKeys((new Array(6)).fill(protractor.Key.BACK_SPACE).join(''));
    expect(page.getValue(el, tagName)).toEqual('');

    // popup menu
    el.sendKeys('Hello @');
    expect(menu.isDisplayed()).toBe(true);
    expect(page.getValue(el, tagName)).toEqual('Hello @');

    // select mention using arrow keys and pressing enter
    // el.sendKeys(protractor.Key.ARROW_DOWN, protractor.Key.ENTER);

    // select mention by clicking mouse on second item in menu
    element(by.css('.dropdown-menu li:nth-child(2) a')).click();
    expect(menu.isDisplayed()).toBe(false);
    expect(page.getValue(el, tagName)).toEqual('Hello @Aaron');

    // select another mention
    el.sendKeys(' and @gav', protractor.Key.ENTER);
    expect(menu.isDisplayed()).toBe(false);
    expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin');

    // start another mention (with no values)
    el.sendKeys(' and @u');
    expect(menu.isDisplayed()).toBe(false);
    expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @u');

    // remove the mention
    el.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
    expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and ');

    // start another mention
    el.sendKeys('@');
    expect(menu.isDisplayed()).toBe(true);
    expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @');

    // continue the mention
    el.sendKeys('e');
    expect(menu.isDisplayed()).toBe(true);
    expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @e');

    // but press escape instead
    el.sendKeys(protractor.Key.ESCAPE);
    expect(menu.isDisplayed()).toBe(false);
    expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @e');

    // these are failing for content editable after chrome update (unable to reproduce manually)
    if (tagName!='div') {
      // remove the escaped entry
      el.sendKeys('!!', protractor.Key.ARROW_LEFT, protractor.Key.ARROW_LEFT);
      el.sendKeys(protractor.Key.BACK_SPACE, protractor.Key.BACK_SPACE);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and !!');

      // and insert another mention
      el.sendKeys('@HE', protractor.Key.ENTER);
      expect(menu.isDisplayed()).toBe(false);
      expect(page.getValue(el, tagName)).toEqual('Hello @Aaron and @Gavin and @Henry!!');
    }

    // multi-line tests apply to all tags except input
    if (tagName!='input') {
      clear(el, tagName);
      testMultiLine(el, tagName);
    }
  }

  function testMultiLine(el, tagName: TagName){
    let menu = element(by.css('.dropdown-menu'));
    el.click();
    expect(page.getValue(el, tagName)).toEqual('');

    // first line
    el.sendKeys('Hello @He');
    expect(menu.isDisplayed()).toBe(true);
    expect(page.getValue(el, tagName)).toEqual('Hello @He');
    el.sendKeys(protractor.Key.ENTER);
    expect(menu.isDisplayed()).toBe(false);
    expect(page.getValue(el, tagName)).toEqual('Hello @Henry');

    el.sendKeys(protractor.Key.ENTER); // new line
    // expect(page.getValue(el, tagName)).toEqual('Hello @Henry\n'); // \n not returned from tinymce

    // second line
    el.sendKeys('Bye @Bl');
    expect(menu.isDisplayed()).toBe(true);
    expect(page.getValue(el, tagName)).toEqual('Hello @Henry\nBye @Bl');
    el.sendKeys(protractor.Key.ENTER);
    expect(menu.isDisplayed()).toBe(false);
    expect(page.getValue(el, tagName)).toEqual('Hello @Henry\nBye @Blake');

    clear(el, tagName);

    // first line
    el.sendKeys('No @One');
    expect(menu.isDisplayed()).toBe(false);
    expect(page.getValue(el, tagName)).toEqual('No @One');
    expect(menu.isDisplayed()).toBe(false);
    el.sendKeys(protractor.Key.ENTER);
    el.sendKeys('Two');
    expect(page.getValue(el, tagName)).toEqual('No @One\nTwo');
  }

  function clear(el, tagName: "input"|"textarea"|"tinymce"|"div") {
    if (tagName=='tinymce') {
      el.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a"));
      el.sendKeys(protractor.Key.chord(protractor.Key.COMMAND, "a"));
      el.sendKeys(protractor.Key.DELETE);
    }
    else {
      el.clear();
    }
    expect(page.getValue(el, tagName)).toEqual("");
  }

});
