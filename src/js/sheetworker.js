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
        getAttrs([skill, skill+"_mod", attribute, attribute+"mod1", attribute+"mod2"], function(values) {
            let summeSkill = 0;
            let summeAttribut = 0;
            let summe = 0;
            let roll = ""

            summeSkill = parseInt(values[skill]|0) + parseInt(values[skill+"_mod"]|0);
            summeAttribut = parseInt(values[attribute]|0) + parseInt(values[attribute+"mod1"]|0) + parseInt(values[attribute+"mod2"]|0);
            summe = summeSkill + summeAttribut;

            roll = "&{template:probe_offen}"; //Das Rolltemplate festlegen
            roll = roll + "{{fertigkeit="+getTranslationByKey(skill)+"}}"; //Die Fertigkeit auf die gewürfelt wird
            roll = roll + "{{attribut="+getTranslationByKey(attribute)+"}}"; //Das Attribut auf das gewürfelt wird
            roll = roll + "{{mindestwurf=[[?{"+getTranslationByKey("mindestwurf")+"|10}]]}}"; //Der Mindestwurf der erreicht werden muss
            roll = roll + "{{hazard=[[?{"+getTranslationByKey("hazard-di")+"|1}d6!6]]}}"; //Der Hazard-Wurf            
            roll = roll + "{{wurf=[[("+summe+"-?{"+getTranslationByKey("hazard-di")+"})d6]]}}"; //Der normale Wurf
            roll = roll + "{{bonus=[[?{"+getTranslationByKey("bonus")+"|0}]]}}"; //Bonus abfragen
            roll = roll + "{{summe=[[0]]}}"; //Platzhalter für die Summe

            startRoll(roll, (results) => {
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
});