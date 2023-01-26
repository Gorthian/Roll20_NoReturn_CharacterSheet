/*
    CREATED by          Gorthian
    Letzte Änderung		2023-01-26
*/


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
    let attribut = skills[1];
    on(`clicked:probe-${skill}`, function() {        
        getAttrs([skill, skill+"_mod", attribut, attribut+"mod1", attribut+"mod2"], function(values) {
            let summeSkill = 0;
            let summeAttribut = 0;
            let summe = 0;
            let roll = ""

            summeSkill = parseInt(values[skill])|0 + parseInt(values[skill+"_mod"])|0;
            summeAttribut = parseInt(values[attribut])|0 + parseInt(values[attribut+"mod1"])|0 + parseInt(values[attribut+"mod2"])|0;
            summe = summeSkill + summeAttribut;

            setAttrs({
                "probe_summe_wuerfel"       : summe,
                "probe_standard_wuerfel"    : summe-1,
                "probe_hazard_wuerfel"      : 1,
                "probe_bonus_wuerfel"       : 0,
                "probe_bonus"               : 0,
                "probe_skill"               : getTranslationByKey(skill),
                "probe_attribut"            : getTranslationByKey(attribut)
            });
        });        
    });
});

on("clicked:wirf-probe",function(){

    getAttrs(["probe_summe_wuerfel","probe_standard_wuerfel","probe_hazard_wuerfel","probe_bonus_wuerfel","probe_bonus"], function(values) {
        let summe = parseInt(values["probe_summe_wuerfel"])|0;
        let standard = parseInt(values["probe_standard_wuerfel"])|0;
        let hazard = parseInt(values["probe_hazard_wuerfel"])|1;
        let bonuswuerfel = parseInt(values["probe_bonus_wuerfel"])|0;
        let bonus = parseInt(values["probe_bonus"])|0;
        let roll = ""

        roll = "&{template:probe_offen}"; //Das Rolltemplate festlegen
        roll = roll + "{{fertigkeit=SKILL}}"; //Die Fertigkeit auf die gewürfelt wird
        roll = roll + "{{attribut=ATTRIBUT}}"; //Das Attribut auf das gewürfelt wird
        roll = roll + "{{hazard=[["+hazard+"d6!6]]}}"; //Der Hazard-Wurf            
        roll = roll + "{{wurf=[["+standard+"d6]]}}"; //Der normale Wurf
        roll = roll + "{{bonuswurf=[["+bonuswuerfel+"d6]]}}"; //Die Bonuswürfel
        roll = roll + "{{bonus=[["+bonus+"]]}}"; //Bonus abfragen
        roll = roll + "{{summe=[["+summe+"]]}}"; //Platzhalter für die Summe

        startRoll(roll, (results) => {
            const hazard = results.results.hazard.result;                
            const wurf = results.results.wurf.result;  
            const bonuswurf = results.results.bonuswurf.result;              
            const bonus = results.results.bonus.result;

            let summe = hazard+wurf+bonuswurf+bonus;

            let hazard_wuerfel = "";
            for (const n of results.results.hazard.dice) {
                hazard_wuerfel = hazard_wuerfel + " "+n+" ";
            }

            let wurf_wuerfel = "";
            for (const n of results.results.wurf.dice) {
                wurf_wuerfel = wurf_wuerfel + " "+n+" ";
            }

            let wurf_bonus = "";
            for (const n of results.results.bonuswurf.dice) {
                wurf_bonus = wurf_bonus + " "+n+" ";
            }

            finishRoll(
                results.rollId,
                {
                    summe: summe,
                    hazard: hazard_wuerfel,                
                    wurf: wurf_wuerfel,
                    bonuswurf: wurf_bonus
                }
            );                
        });
    });        
});

on("change:probe_hazard_wuerfel", function(){
    getAttrs(["probe_summe_wuerfel","probe_standard_wuerfel","probe_hazard_wuerfel"], function(values) {
        let summe = parseInt(values["probe_summe_wuerfel"])|0;
        let standard = parseInt(values["probe_standard_wuerfel"])|0;
        let hazard = parseInt(values["probe_hazard_wuerfel"])|1;

        if(hazard > summe) {hazard = summe}
        if(hazard < 1) {hazard = 1}
        standard = summe - hazard;
        
        setAttrs({
            "probe_summe_wuerfel"       : summe,
            "probe_standard_wuerfel"    : standard,
            "probe_hazard_wuerfel"      : hazard
        });
    });
});