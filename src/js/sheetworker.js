/* TAB MENU */
const buttonlist = ["page-one","page-two"]; //Bei Änderungen auch doe globale Variable in noreturn.pug anpassen
buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        console.log(button);
        setAttrs({
            sheetTab: button
        });
    });
});