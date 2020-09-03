# Angular Mentions
Forked from https://github.com/dmacfarlane/angular-mentions.

Simple Angular mentions inspired by [Ment.io](https://github.com/jeff-collins/ment.io).

[Click here for a Demo](http://dmacfarlane.github.io/angular-mentions/)

Provides auto-complete suggestions for @mentions in text input fields, text areas,
and content editable fields. Not fully browser tested and comes without warranty!

The installation and usage are still the same.
The instructions below are still the same as in dmacfarlane/angular-mentions.
The differences are in the additional optional config.

To install and start the demo application:

    git clone https://github.com/crystalyutiamco/angular-social-mentions.git
    cd angular-social-mentions
    npm install
    ng serve

### Usage

Add the package as a dependency to your project using:

    npm install angular-social-mentions

Add the module to your app.module imports:

```typescript
import { MentionModule } from 'angular-social-mentions';
...

@NgModule({
    imports: [ MentionModule ],
    ...
})
```

Add the `[mention]` directive to your input element:

```html
<input type="text" [mention]="items">
```

Where `items` is a string array of the items to suggest. For example:

```typescript
items: string[] = ["Noah", "Liam", "Mason", "Jacob", ...
```

#### Configuration Options

The following optional configuration items can be used.

| Option        | Default  | Description |
| ---           | ---      | ---         |
| items         |          | An array of strings or objects to suggest. |
| triggerChar   | @        | The character that will trigger the menu behavior. |
| labelKey      | label    | The field to be used as the item label (when the items are objects). |
| disableSort   | false    | Disable sorting of suggested items. |
| disableSearch | false    | Disable internal filtering (only useful if async search is used). |
| dropUp        | false    | Show the menu above the cursor instead of below. |
| maxItems      | ∞        | Limit the number of items shown in the text. The default is no limit. |
| mentionSelect |          | A function to format the selected item before inserting the text. |
| allowSpace    | false    | Allow spaces while mentioning. |
| returnTrigger | false    | Include the trigger char in the searchTerm event. |
| useMention | false    | Specify true if you want to use data from [mention] property instead of items array in this config. |
| disableTemplate | false    | Option to disable usage of [mentionTemplate] for this config. |
| emptyItemsOnClose | false    | Option to set the item list to [] after drop down closes. |
| tabs |     | An array of tabs to show on top of the dropdown. Layout is currently static. |

For Example: 

```html
<input type="text" [mention]="items" [mentionConfig]="{triggerChar:'#',maxItems:10,labelKey:'name'}">
```

#### Output Events

The following output events can be used.

| Output        | Description |
| ---           | ---         |
| `@Output() serchTerm EventEmitter<string>` | Event that is emitted whenever the search term changes. Can be used to trigger async search.
| `@Output() opened EventEmitter<void>`  | Event that is emitted when the mentions panel is opened.
| `@Output() closed EventEmitter<void>`  | Event that is emitted when the mentions panel is closed.
| `@Output() mentionsTabSelected EventEmitter<void>`  | Event that is emitted when the a tab is selected.

### Alternative Usage

The component can also be used by only specifying the mentionConfig object:

```html
<input type="text" [mentionConfig]="mentionConfig">
```

With the following structure:

```javascript
let mentionConfig = {
    items: [ "Noah", "Liam", "Mason", "Jacob", ... ],
    triggerChar: "@",
    ...
}
```

In this way, multiple config objects can be used:

```javascript
let mentionConfig = {
    mentions: [
        {
            items: [ "Noah", "Liam", "Mason", "Jacob", ... ],
            triggerChar: '@'
        },
        {
            items: [ "Red", "Yellow", "Green", ... ],
            triggerChar: '#'
        },
    }]
}
```
This allows different lists and trigger characters to be configured.

Note that because objects are mutable, changes to the items within the config will not be picked up unless a new mentionConfig object is created.

#### Mention Prompt

Instead of displaying a list, you can show a prompt containing a message in the dropdown instead.
The following inputs can be used to do so.

| Input        | Description |
| ---           | ---         |
| `@Input() mentionPromptTemplate: TemplateRef<any>` | Mention prompt template. This is helpful when you want to show a message when a list is empty instead or if you want to show some generic message instead.
| `@Input() showMentionPrompt: boolean`  | Set this to true if you want to show the message prompt instead of the list.

Sample usage of Mention Prompt:

```html
<input class="form-control" type="text"
  [mentionConfig]="mentionConfig"
  [showMentionPrompt]="showMessageTemplate$ | async"
  [mentionPromptTemplate]="messageTemplate">

<ng-template #messageTemplate>
  <div>
    <span>Sample Mention Prompt</span>
    <a (mousedown)="onClickThisClick($event);$event.preventDefault()">Click Here</a>
  </div>
</ng-template>
```



