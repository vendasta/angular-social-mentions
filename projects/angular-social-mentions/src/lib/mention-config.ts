// configuration structure, backwards compatible with earlier versions

export interface MentionConfig extends Mentions {
  // nested config
  mentions?:Mentions[];

  // option to disable encapsulated styles so global styles can be used instead
  disableStyle?:boolean;

  // option to only use config in mentions array and discard outer config
  useNestedConfig?:boolean;
}

export interface Mentions {
  // an array of strings or objects to suggest
  items?:any[];

  // the character that will trigger the menu behavior
  triggerChar?:string;

  // option to specify the field in the objects to be used as the item label
  labelKey?:string;

  // option to limit the number of items shown in the pop-up menu
  maxItems?:number;

  // option to disable sorting
  disableSort?:boolean;

  // option to disable internal filtering. can be used to show the full list returned
  // from an async operation
  disableSearch?:boolean;

  // display menu above text instead of below
  dropUp?:boolean;

  // whether to allow space while mentioning or not
  allowSpace?:boolean;

  // option to include the trigger char in the searchTerm event
  returnTrigger?:boolean;

  // optional function to format the selected item before inserting the text
  mentionSelect?:(item: any, triggerChar?:string) => (string);

  // use data from [mention] directive instead of items
  useMention?: boolean;

  // option to disable usage of [mentionTemplate]
  disableTemplate?: boolean;

  // option to set item list to [] after drop down closes
  emptyItemsOnClose?: boolean;

  tabs?: MentionsTab[];

  // optional function to customize the search implementation
  mentionFilter?:(searchString:string, items?:any) => (any[]);
}

export interface MentionsTab {
  label: string;

  img?: string;

  value: string;
}
