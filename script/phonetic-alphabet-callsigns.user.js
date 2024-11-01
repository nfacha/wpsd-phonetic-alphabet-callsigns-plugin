// ==UserScript==
// @name         WPSD: Phonetic Alphabet Callsigns with Pin Feature
// @namespace    http://facha.dev/
// @version      1.1
// @description  Show phonetic alphabet for callsigns on WPSD and pin highlighted callsigns
// @author       CS8ACT
// @match        *://*/*
// @grant        none
// @downloadURL  https://facha.dev/userscripts/ham-radio/phonetic-alphabet-callsigns.user.js
// @updateURL    https://facha.dev/userscripts/ham-radio/phonetic-alphabet-callsigns.user.js
// ==/UserScript==

/*
 Changelog for version 1.1:
 - Added a feature to pin the phonetic representation of a callsign.
 - The pinned section is displayed below the header and includes the callsign, phonetic label, and timestamp.
 - Clicking on the pinned section will remove the pin.
*/

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

    let pinnedElement = null;
    let pinSection = null;

    function getPhonetic(callsign) {
        return callsign.split('').map(char => phoneticAlphabet[char.toUpperCase()] || char).join(' ');
    }

    function addPhoneticLabels() {
        document.querySelectorAll('.divTableCellMono a').forEach(callsignLink => {
            const callsign = callsignLink.textContent.trim();
            if (callsign && !callsignLink.nextElementSibling) {
                const phonetic = getPhonetic(callsign);
                const phoneticElement = document.createElement('div');
                phoneticElement.classList.add('phonetic-label');
                phoneticElement.style.fontSize = '1em';
                phoneticElement.style.color = '#555';
                phoneticElement.style.textAlign = 'center';
                phoneticElement.innerHTML = phonetic.split(' ').map(word => `<span style="color: #0000FF;">${word[0]}</span>${word.slice(1)}`).join(' ');

                phoneticElement.addEventListener('click', () => {
                    if (pinnedElement === phoneticElement) {
                        // Unpin if already pinned
                        pinSection.remove();
                        pinnedElement = null;
                        pinSection = null;
                    } else {
                        // Pin the clicked element
                        if (pinnedElement) {
                            pinSection.remove();
                        }
                        pinnedElement = phoneticElement.cloneNode(true);
                        pinnedElement.style.fontSize = '2em';
                        pinnedElement.style.border = '2px solid #008000';
                        pinnedElement.style.marginTop = '10px';

                        const callsignElement = document.createElement('div');
                        callsignElement.style.fontSize = '4em';
                        callsignElement.style.fontWeight = 'bold';
                        callsignElement.style.color = '#ffffff';
                        callsignElement.style.backgroundColor = '#008000';
                        callsignElement.style.padding = '10px';
                        callsignElement.style.textAlign = 'center';
                        callsignElement.textContent = callsign;

                        const timestampElement = document.createElement('div');
                        timestampElement.style.fontSize = '2em';
                        timestampElement.style.color = '#ffffff';
                        timestampElement.style.textAlign = 'center';
                        const currentTime = new Date().toLocaleString();
                        timestampElement.textContent = `Pinned at: ${currentTime}`;

                        pinSection = document.createElement('div');
                        pinSection.id = 'pin-section';
                        pinSection.style.backgroundColor = '#008000';
                        pinSection.style.padding = '20px';
                        pinSection.style.marginTop = '10px';
                        pinSection.style.textAlign = 'center';
                        pinSection.style.cursor = 'pointer';
                        pinSection.appendChild(callsignElement);
                        pinSection.appendChild(pinnedElement);
                        pinSection.appendChild(timestampElement);

                        pinSection.addEventListener('click', () => {
                            pinSection.remove();
                            pinnedElement = null;
                            pinSection = null;
                        });

                        header.insertAdjacentElement('afterend', pinSection);
                    }
                });

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
