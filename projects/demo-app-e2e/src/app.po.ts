import { browser, element, by } from 'protractor';

export type TagName = 'input'|'textarea'|'tinymce'|'div';

export class AngularMentionsPage {
  
  navigateTo() {
    return browser.get('/');
  }

  getHeadingText() {
    return element(by.css('app-root h1')).getText();
  }
  
  getSubHeadingText() {
    return element(by.css('app-root h3')).getText();
  }

  getValue(el, tagName: TagName) {
    if (tagName=='input' || tagName=='textarea') {    
      return el.getAttribute('value');
    }
    else if (tagName=='tinymce') {
      let iframe = browser.findElement(by.tagName('iframe'));
      return browser.switchTo().frame(iframe).then( () => {
        let el = browser.driver.findElement(by.id('tinymce'));
        let text = el.getText();
        return browser.switchTo().defaultContent().then(()=>{
          return browser.waitForAngular().then(()=>{return text});
        });
      });              
    }
    else {
      return el.getText();
    }
  }  
}
