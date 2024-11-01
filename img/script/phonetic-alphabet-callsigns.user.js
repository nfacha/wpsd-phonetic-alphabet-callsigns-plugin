// ==UserScript==
// @name         WPSD: Phonetic Alphabet Callsigns
// @namespace    http://facha.dev/
// @version      1.0
// @description  Show phonetic alphabet for callsigns on WPSD
// @author       CS8ACT
// @match        *://*/*
// @grant        none
// @downloadURL  https://facha.dev/userscripts/ham-radio/phonetic-alphabet-callsigns.user.js
// @updateURL    https://facha.dev/userscripts/ham-radio/phonetic-alphabet-callsigns.user.js
// ==/UserScript==

(function() {
    'use strict';

    const phoneticAlphabet = {
        'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot',
        'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet', 'K': 'Kilo', 'L': 'Lima',
        'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo',
        'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray',
        'Y': 'Yankee', 'Z': 'Zulu',
        '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
        '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine'
    };

    function getPhonetic(callsign) {
        return callsign.split('').map(char => phoneticAlphabet[char.toUpperCase()] || char).join(' ');
    }

    function addPhoneticLabels() {
        document.querySelectorAll('.divTableCellMono a').forEach(callsignLink => {
            const callsign = callsignLink.textContent.trim();
            if (callsign && !callsignLink.nextElementSibling) {
                const phonetic = getPhonetic(callsign);
                const phoneticElement = document.createElement('div');
                phoneticElement.style.fontSize = '0.6em';
                phoneticElement.style.color = '#555';
                phoneticElement.innerHTML = phonetic.split(' ').map(word => `<span style="color: #0000FF;">${word[0]}</span>${word.slice(1)}`).join(' ');
                callsignLink.parentElement.appendChild(phoneticElement);
            }
        });
    }

    // Check if the page contains the specific header before running the script
    const header = document.querySelector('h1');
    if (header && header.textContent.includes('WPSD Dashboard')) {
        // Run the function initially and also detect changes to the document.
        addPhoneticLabels();

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    addPhoneticLabels();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        console.log('Phonetic Alphabet Callsigns script disabled: WPSD Dashboard header not found.');
    }
})();
