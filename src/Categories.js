const CATEGORIES = {
    'WEB'       : 0,
    'DESKTOP'   : 1,
    'MOBILE'    : 2,
    'CONSOLE'   : 3
}

export function getCategoriesString(category){
    switch(category){
        case CATEGORIES.WEB:
            return "Web";
        case CATEGORIES.DESKTOP:
            return "Desktop";
        case CATEGORIES.MOBILE:
            return "Mobile";
        case CATEGORIES.CONSOLE:
            return "Console";
        default: 
            return "No Category";
    }
}

export default CATEGORIES;