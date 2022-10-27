/* TAB MENU */
const buttonlist = ["page-one","page-two"];
buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        console.log(button);
        setAttrs({
            sheetTab: button
        });
    });
});