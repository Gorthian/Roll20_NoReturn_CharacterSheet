/*
    CREATED by          Gorthian
    Letzte Änderung		2023-04-23
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

/* Konstanten */

// Die Attribute
const attributeslist = [
    "geschick","staerke","konstitution","beweglichkeit","wahrnehmung","wissen","charisma","handwerk"
];

// Die Fertigkeiten. Anpassungen müssen auch in noreturn.pug übernommen werden
const skilllist = [
    ['akrobatik','beweglichkeit'],
    ['astronomie','wissen'],
    ['ausdauer','konstitution'],
    ['ausweichen','beweglichkeit'],
    ['basteln','handwerk'],
    ['blocken','konstitution'],
    ['bodenfahrzeuge','geschick'],
    ['chemie','wissen'],
    ['computer','wissen'],
    ['dressieren','charisma'],
    ['einschuechtern_ch','charisma'],
    ['einschuechtern_st','staerke'],
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

/* Hilfsfunktionen */

//Befüllen des Dicebots
function setDicebot(skill,attribut,summe,skillNotiz,hazard=1,biomechanik=0) {
    if (summe < 1) {summe = 1} // Man hat immer mindestens einen Würfel

    setAttrs({
        "probe_skill"                       : skill,
        "probe_attribut"                    : attribut,
        "probe_summe_wuerfel"               : summe,
        "probe_skill_notiz"                 : skillNotiz,
        "probe_original_hazard_wuerfel"     : hazard,
        "probe_hazard_wuerfel"              : hazard,
        "probe_original_standard_wuerfel"   : summe-hazard,
        "probe_standard_wuerfel"            : summe-hazard,               
        "probe_bonus_wuerfel"               : 0,
        "probe_bonus"                       : 0,
        "probe_biomechanik"                 : biomechanik
    });
}

/* Rolltemplates */

// Skillproben
skilllist.forEach(skills => {
    let skill = skills[0];
    let attribut = skills[1];
    on(`clicked:probe-${skill}-${attribut}`, function() {        
        getAttrs([skill, skill+"_mod", skill+"_biomechanik", skill+"_modifikatoren", attribut, attribut+"-mod1", attribut+"-mod2"], function(values) {
            let summeSkill = 0;
            let summeAttribut = 0;
            let summe = 0;
            let hazard = 1;
            let skillNotiz = values[skill+"_mod"];
            let biomechanik = parseInt(values[skill+"_biomechanik"])|0;
            let modifikatoren = parseInt(values[skill+"_modifikatoren"])|0;
            let attributWert = parseInt(values[attribut])|0;
            let attributMod1 = parseInt(values[attribut+"-mod1"])|0;
            let attributMod2 = parseInt(values[attribut+"-mod2"])|0;            
    
            summeSkill = parseInt(values[skill]);
            if (modifikatoren==0) { //Prüfen ob die Attributsmodifikatoren automatisch mit eingerechnet werden sollen
                summeAttribut = attributWert;
            } else {
                summeAttribut = attributWert + attributMod1 + attributMod2;
            }            
            summe = summeSkill + summeAttribut;

            if (summeSkill==0) {summe = summe -2} //Ist die Fertigkeitsstufe 0, bekommt die Probe einen Malus von 2

            if(biomechanik==1) { //Hat die Fertigkeit Biomechanik werden alle Würfel zu Hazard-Di
                hazard = summe;
            }

            setDicebot(getTranslationByKey(skill),getTranslationByKey(attribut),summe,skillNotiz,hazard,biomechanik);
        });
    });
});

// Attributsproben
// ...mit Modifikatoren
attributeslist.forEach(attribut => {    
    on(`clicked:probe-${attribut}`, function() {        
        getAttrs([attribut, attribut+"-mod1", attribut+"-mod2"], function(values) {
            let summe = 0;
            let wert = parseInt(values[attribut])|0;
            let mod1 = parseInt(values[attribut+"-mod1"])|0;
            let mod2 = parseInt(values[attribut+"-mod2"])|0;
            console.log(getTranslationByKey("attributsprobe") + ":" + wert + "/" + mod1 + "/" + mod2);
            
            summe = wert + mod1 + mod2;
            console.log("Summe :" + summe);
            setDicebot(getTranslationByKey("attributsprobe"),getTranslationByKey(attribut),summe," ");
        });
    });
});

// ...ohne Modifikatoren
attributeslist.forEach(attribut => {    
    on(`clicked:probe-ohne-mod-${attribut}`, function() {        
        getAttrs([attribut], function(values) {
            let summe = 0;
    
            summe = parseInt(values[attribut])|0;
            setDicebot(getTranslationByKey("attributsprobe"),getTranslationByKey(attribut),summe," ");
        });
    });
});


// Proben auf Besondere Fertigkeiten
on("clicked:repeating_besondere-fertigkeiten:probe", function(eventInfo) {
    getAttrs(["repeating_besondere-fertigkeiten_besondere-fertigkeit-name", "repeating_besondere-fertigkeiten_besondere-fertigkeit-stufe", "repeating_besondere-fertigkeiten_besondere-fertigkeit-attribut"], function(values) {
        let skillName = values["repeating_besondere-fertigkeiten_besondere-fertigkeit-name"];
        let skillStufe = parseInt(values["repeating_besondere-fertigkeiten_besondere-fertigkeit-stufe"])|0;
        let attributName = values["repeating_besondere-fertigkeiten_besondere-fertigkeit-attribut"];

        getAttrs([attributName, attributName+"mod1", attributName+"mod2"], function(values) {
            let summeAttribut = 0;
            let summe = 0;

            summeAttribut = parseInt(values[attributName])|0 + parseInt(values[attributName+"mod1"])|0 + parseInt(values[attributName+"mod2"])|0;
            summe = skillStufe + summeAttribut;
            setDicebot(skillName,getTranslationByKey(attributName),summe," ");
        });
    });
});

// Probe auf Infektionsresistenz
on("clicked:infektionsresistenz",function(){
    getAttrs(["character_name","infektionsresistenz_wuerfel","infektionsresistenz_bonus"], function(values) {
        let wuerfel = parseInt(values["infektionsresistenz_wuerfel"]);
        let bonus = parseInt(values["infektionsresistenz_bonus"]);
        let charaktername = values["character_name"];
        let roll = ""

        roll = "&{template:infektionsresistenz}"; //Das Rolltemplate festlegen
        roll = roll + "{{charaktername="+charaktername+"}}"; //Den Charakternamen mitgeben
        roll = roll + "{{wurf=[["+wuerfel+"d6]]}}"; 
        roll = roll + "{{bonus=[["+bonus+"]]}}";
        roll = roll + "{{summe=[[0]]}}";
        
        startRoll(roll, (results) => {
            const wurf = results.results.wurf.result;  
            const bonus = results.results.bonus.result;

            let summe = wurf + bonus;
            console.log(wurf + " " + bonus + " " + summe);
            let wurf_wuerfel = "";
            for (const n of results.results.wurf.dice) {
                wurf_wuerfel = wurf_wuerfel + ""+n+"";
            }
            
            finishRoll(
                results.rollId,
                {
                    summe: summe,
                    wurf: wurf_wuerfel
                }
            );
        });
    });
});

on("clicked:wirf-probe",function(){
    getAttrs(["character_name","probe_summe_wuerfel","probe_standard_wuerfel","probe_original_standard_wuerfel","probe_hazard_wuerfel","probe_original_hazard_wuerfel","probe_bonus_wuerfel","probe_bonus","probe_skill","probe_attribut","probe_biomechanik"], function(values) {
        let summe = parseInt(values["probe_summe_wuerfel"]);
        let standard = parseInt(values["probe_standard_wuerfel"]);
        let standard_orig = parseInt(values["probe_original_standard_wuerfel"]);
        let hazard = parseInt(values["probe_hazard_wuerfel"]);
        let hazard_orig = parseInt(values["probe_original_hazard_wuerfel"]);
        let bonuswuerfel = parseInt(values["probe_bonus_wuerfel"]);
        let bonus = parseInt(values["probe_bonus"]);
        let skill = values["probe_skill"];
        let attribut = values["probe_attribut"];
        let charaktername = values["character_name"];
        let roll = "";
        let modifiziert = "";
        let biomechanik = parseInt(values["probe_biomechanik"]);
        if (biomechanik==0) {biomechanik=""};

        //Bei negativen Bonuswürfeln die Anzahl an Würfeln reduzieren
        if (bonuswuerfel <0 )
        {
            if(biomechanik==1) { 
                //Bei einem Biomechanik-Wurf die Hazard-Würfel reduzieren
                hazard = hazard + bonuswuerfel;
                if (hazard<1) {hazard=1} //Mindestens ein Hazard-würfel bleibt immer übrig
            } else {
                //Bei einem normalen Wurf die Standard-Würfel reduzieren
                standard = standard + bonuswuerfel;
            }
        }

        if(standard_orig != standard || hazard_orig != hazard) {modifiziert=1;}
        if(skill == "Undefined") {skill="";}
        if(attribut == "Undefined") {attribut="";}

        roll = "&{template:probe_offen}"; //Das Rolltemplate festlegen
        roll = roll + "{{charaktername="+charaktername+"}}"; //Den Charakternamen mitgeben
        roll = roll + "{{fertigkeit="+skill+"}}"; //Die Fertigkeit auf die gewürfelt wird
        roll = roll + "{{attribut="+attribut+"}}"; //Das Attribut auf das gewürfelt wird
        roll = roll + "{{hazard=[["+hazard+"d6!6]]}}"; //Der Hazard-Wurf            
        roll = roll + "{{wurf=[["+standard+"d6]]}}"; //Der normale Wurf
        roll = roll + "{{bonuswurf=[["+bonuswuerfel+"d6]]}}"; //Die Bonuswürfel
        roll = roll + "{{bonus=[["+bonus+"]]}}"; //Bonus abfragen
        roll = roll + "{{summe=[["+summe+"]]}}"; //Platzhalter für die Summe
        roll = roll + "{{modifiziert="+modifiziert+"}}"; //Schalter um modifizierte Würfe anzuzeigen
        roll = roll + "{{biomechanik="+biomechanik+"}}"; //Schalter um Biomechanikürfe anzuzeigen

        startRoll(roll, (results) => {
            const hazard = results.results.hazard.result;                
            const wurf = results.results.wurf.result;  
            const bonuswurf = results.results.bonuswurf.result;              
            const bonus = results.results.bonus.result;

            let summe = hazard+wurf+bonuswurf+bonus;

            let hazard_wuerfel = "";
            for (const n of results.results.hazard.dice) {
                hazard_wuerfel = hazard_wuerfel + ""+n+"";
            }

            let wurf_wuerfel = "";
            for (const n of results.results.wurf.dice) {
                wurf_wuerfel = wurf_wuerfel + ""+n+"";
            }

            let wurf_bonus = "";
            for (const n of results.results.bonuswurf.dice) {
                wurf_bonus = wurf_bonus + ""+n+"";
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

on("clicked:trefferzone",function(){
    roll = "&{template:trefferzone}"; //Das Rolltemplate festlegen
    roll = roll + "{{zone=[[2d6]]}}"; //Die Zone auswürfeln    

    startRoll(roll, (results) => {
        const zone=results.results.zone.result;
        let zoneText=getTranslationByKey("trefferzone-"+zone);
        
        finishRoll(
            results.rollId,
            {
                zone: zoneText,                
            }
        );                
    });
});

on("change:probe_hazard_wuerfel", function(){
    getAttrs(["probe_summe_wuerfel","probe_standard_wuerfel","probe_hazard_wuerfel"], function(values) {
        let summe = parseInt(values["probe_summe_wuerfel"]);
        let standard = parseInt(values["probe_standard_wuerfel"]);
        let hazard = parseInt(values["probe_hazard_wuerfel"]);

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