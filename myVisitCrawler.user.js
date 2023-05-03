// ==UserScript==
// @name         My Visit Crawler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search for a free passport renewal appointment
// @author       Hadas Shveky-Teman
// @match        https://*.myvisit.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

// ------ USER DATA -----

  const ID = 'XXXXXXXXX';                   //The ID of the person requesting the appointment
  const PHONE_NUMBER = 'XXXXXXXXXX';        //The phone number of the person requesting the appointment

  const LOCATION_NUM_TO_CHECK = 20;         //Number of locations to scan
  const LOCATION_SKIP_LIST = [];            //List of locations indexes to skip (0-based) - for example [13,20]
  const MONTHS_SKIP_LIST = ['Nov','Dec'];   //List of months to skip when looking for an appointment

//-----------------------

const sleep = (milliseconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

const waitForElement = async (elementSelector, numOfTrials) => {
    let trials = 0
    console.log('waiting for ',elementSelector);
    while (!document.querySelector(elementSelector)){
        if (numOfTrials && trials >= numOfTrials) break;
        trials++
        await sleep(1000);
    }
    console.log('found ',elementSelector);
}

const searchSpot = async (id, phoneNum, skipStart) => {
    const SERVICE_INDEX = 0;
    const START_FROM_LOCATION = 0;

    if (!skipStart){
        //goverment services
        document.querySelectorAll('li.icon-button-hvr-shrink')[2].click();

        await waitForElement('li.provider-tile');

        //interior office
        document.querySelectorAll('li.provider-tile')[SERVICE_INDEX].click();
    }

    await waitForElement('input#ID_KEYPAD');

    //fill up id
    const idInput = document.querySelector('input#ID_KEYPAD');
    let idLastValue = idInput.value;
    idInput.value = id;
    let idEvent = new Event("input", { bubbles: true });
    idEvent.simulated = true;
    // hack React16/Angular
    let idTracker = idInput._valueTracker;
    if (idTracker) {
        idTracker.setValue(idLastValue);
    }
    idInput.dispatchEvent(idEvent);

    //continue btn
    document.querySelector('button.actionButton').click();

    await waitForElement('input#PHONE_KEYPAD');

    //fill up phone number
    const phoneInput = document.querySelector('input#PHONE_KEYPAD');
    let phoneLastValue = phoneInput.value;
    phoneInput.value = phoneNum;
    let phoneEvent = new Event("input", { bubbles: true });
    phoneEvent.simulated = true;
    // hack React16/Angular
    let phoneTracker = phoneInput._valueTracker;
    if (phoneTracker) {
        phoneTracker.setValue(phoneLastValue);
    }
    phoneInput.dispatchEvent(phoneEvent);

    //continue btn
    document.querySelector('button.actionButton').click();

    await waitForElement('div.list-item-body');

    //biometric documentation
    document.querySelectorAll('div.list-item-body')[0].click();

    await waitForElement('div.list-item-body.with-2icons');

    for (let index=START_FROM_LOCATION; index<LOCATION_NUM_TO_CHECK; index++){
        //get location
        const locationDiv = document.querySelectorAll('div.list-item-body.with-2icons')[index]
        const locationName = locationDiv.querySelector('div span').innerText

        //some locations are for locals only, need to skip them
        if (LOCATION_SKIP_LIST.includes(index)){
            console.log(`*** Skipping location ${locationName}`);
            continue;
        }

        locationDiv.click();

        await waitForElement('li.list-item > button');
        await sleep(4000);

        //biometric passport
        document.querySelector('li.list-item > button').click();

        await waitForElement('li.radioButton-container');

        //biometric passport renew
        document.querySelectorAll('li.radioButton-container')[2].click();

        //waiting for 'Available Dates' title
        await waitForElement('div.picker-title-content.ng-binding');

        //waiting for 'Not Available Dates' title
        await waitForElement('#mCSB_5_container div span', 5);

        const availDay = document.querySelector('li button.calendarDay div.font-medium');
        const availMonth = document.querySelectorAll('li button.calendarDay div.font-medium')[1];
        const availDate = document.querySelector('li button.calendarDay div.font-xlarge');

        if (availMonth && !MONTHS_SKIP_LIST.includes(availMonth.innerText)){
            console.log(`*** Found an open spot in ${locationName} at ${availDay.innerText} ${availDate.innerText} ${availMonth.innerText}`);
            const stop = confirm(`Found a spot!\nIn ${locationName} \nAt ${availDay.innerText} ${availDate.innerText} ${availMonth.innerText}\n\nWould you like to book it?\n\nIf yes, click OK and book manually, to continue searching click Cancel`)
            if (stop){
                break;
            }
        } else {
            console.log(`*** No available date found in ${locationName}`);
        }

        //click on back button
        document.querySelector('.appHeaderContent .pull-right.ng-isolate-scope .appHeader-button button').click();

        await sleep(8000);
    }
}

window.addEventListener('load', async function(){
  //The basterds are doing redirect to another url that causes the script to reload...
  //So if thats the case - identify it and start from middle of script
    if (window.location.host.includes('piba')){
        searchSpot(ID, PHONE_NUMBER, true)
    } else {
        const BTN_PLACEMENT_SELECTOR = '.appHeader';

        let btn = document.createElement('button');
        btn.innerHTML = 'Find my spot!';
        btn.style = 'margin-left: 20px; position:relative;'
        btn.onclick = () => searchSpot(ID, PHONE_NUMBER);

        await waitForElement('li.icon-button-hvr-shrink');

        setTimeout(() => {
            let div = document.querySelector(BTN_PLACEMENT_SELECTOR);
            div.appendChild(btn);
        },2000);
    }
});
