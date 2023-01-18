/* TAB MENU */
const buttonlist = ["page-one","page-two"]; //Bei Änderungen auch die globale Variable in noreturn.pug anpassen
buttonlist.forEach(button => {
    on(`clicked:${button}`, function() {
        console.log(button);
        setAttrs({
            sheetTab: button
        });
    });
});

/* Rolltemplates */
const skilllist = [
    ['akrobatik','beweglichkeit'],
    ['astronomie','wissen'],
    ['akrobatik','beweglichkeit'],
    ['ausdauer','konstitution'],
    ['ausweichen','beweglichkeit'],
    ['basteln','handwerk'],
    ['blocken','beweglichkeit'],
    ['bodenfahrzeuge','geschick'],
    ['chemie','wissen'],
    ['computer','wissen'],
    ['dressieren','charisma'],
    ['einschuechtern','charisma'],
    ['einschuechtern','staerke'],
    ['elektronik','handwerk'],
    ['feuerwaffenbau','handwerk'],
    ['fluggeraete','geschick'],
    ['gassenwissen','wissen'],
    ['geschuetze','geschick'],
    ['grossraumschiff','wissen'],
    ['heimlichkeit','wahrnehmung'],
    ['inspiration','charisma'],
    ['klettern','beweglichkeit'],
    ['kunst','handwerk'],
    ['mechanik','handwerk'],
    ['medizin','wissen'],
    ['menschenkenntnis','charisma'],
    ['nachforschen','wahrnehmung'],
    ['nahkampf','beweglichkeit'],
    ['naturkunde','wissen'],
    ['orientierung','wahrnehmung'],
    ['projektilwaffen','geschick'],
    ['raumjaeger','geschick'],
    ['raumschiff','geschick'],
    ['reaktion','wahrnehmung'],
    ['reiten','beweglichkeit'],
    ['rennen','beweglichkeit'],
    ['robotik','handwerk'],
    ['ruestungsbau','handwerk'],
    ['sagen-mythen','wissen'],
    ['saufen','konstitution'],
    ['schaetzen','wahrnehmung'],
    ['schauspiel','charisma'],
    ['schiessen','geschick'],
    ['schwere-waffen','geschick'],
    ['schwimmen','beweglichkeit'],
    ['sicherheitstechnik','handwerk'],
    ['spezies','wissen'],
    ['springen','beweglichkeit'],
    ['spruehwaffen','geschick'],
    ['stemmen','staerke'],
    ['taschendiebstahl','geschick'],
    ['ueberreden','charisma'],
    ['verhandeln','charisma'],
    ['waffenbau','handwerk'],
    ['waffenkampf','beweglichkeit'],
    ['wasserfahrzeuge','geschick'],
    ['willenskraft','wissen'],
    ['wurfwaffen','geschick'],
    ['zero-g','beweglichkeit'],
];

skilllist.forEach(skills => {
    let skill = skills[0];
    let attribute = skills[1];
    on(`clicked:probe-${skill}`, function() {
        startRoll("&{template:probe_offen} {{fertigkeit="+getTranslationByKey(skill)+"}} {{attribut="+getTranslationByKey(attribute)+"}} {{mindestwurf=[[10]]}} {{hazard=[[?{"+getTranslationByKey("hazard-di")+"|1}d6!6]]}} {{wurf=[[?{"+getTranslationByKey("normale-wuerfel")+"|0}d6]]}} {{bonus=[[?{"+getTranslationByKey("bonus")+"|0}]]}} {{summe=[[0]]}}", (results) => {
            const hazard = results.results.hazard.result;
            const wurf = results.results.wurf.result;
            const bonus = results.results.bonus.result;

            let summe = hazard+wurf+bonus

            finishRoll(
                results.rollId,
                {
                    summe: summe,
                }
            );
            
        });
    });
});