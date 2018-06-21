export class Menu{
  constructor(private menuId:string,
              private menuLabel:string,
              private isActivated:boolean,
              private menuUrl:string,
              private subMenu:Menu[],
              public selected:boolean=false){}


    get isSelected():boolean{
      return this.selected;
    }

    get id():string{
      return this.menuId;
    }

    get label():string{
      return this.menuLabel;
    }

    get isActive():boolean{
      return this.isActivated;
    }

    get url():string{
      return this.menuUrl;
    }

    get childMenuItems():Menu[]{
      return this.subMenu;
    }

    set childMenuItems(menuItms:Menu[]){
      this.subMenu=menuItms;
    }
}
