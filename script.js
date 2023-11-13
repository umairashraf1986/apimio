"use strict";

document.addEventListener('DOMContentLoaded', function () {
    let isSelectionMode = false;
    let selectedElements = [];
    let interactedElements = [];

    // Check the selection mode status
    checkSelectionMode();

    function checkSelectionMode() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                isSelectionMode = data.settings.selectionMode;
                if (isSelectionMode) {
                    startSelection();
                } else {
                    endSelection();
                }
            }
        };
        xhr.open('GET', 'http://localhost:3000/selection-mode', true);
        xhr.send();
    }

    function startSelection() {
        isSelectionMode = true;

        document.querySelectorAll('.interactive-element').forEach(element => {
            if(element.tagName === 'SELECT') {
                element.addEventListener('change', simulateEvent);
            } else {
                element.addEventListener('click', simulateEvent);
            }
        });
    }

    function endSelection() {
        isSelectionMode = false;

        document.querySelectorAll('.interactive-element').forEach(element => {
            element.removeEventListener('click', simulateEvent);
        });
    }

    function simulateEvent(event) {
        const selectedElement = event.target;
        interactedElements.push({
            label: selectedElement.getAttribute('data-label'),
            type: selectedElement.getAttribute('data-element-type')
        });
        selectedElement.classList.toggle('selected');

        if (selectedElement.classList.contains('selected')) {
            selectedElements.push({
                label: selectedElement.getAttribute('data-label'),
                type: selectedElement.getAttribute('data-element-type')
            });
        } else {
            selectedElements = selectedElements.filter(element => element.label !== selectedElement.label);
        }

        updateDashboard();

        const eventType = selectedElement.getAttribute('data-element-type');
        const eventLabel = selectedElement.getAttribute('data-label');

        // Simulate AJAX call to mock GTM endpoint
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log(`Event sent to GTM: Type - ${eventType}, Label - ${eventLabel}`);
                } else {
                    console.error(`Failed to send event to GTM: Type - ${eventType}, Label - ${eventLabel}`);
                }
            }
        };

        // In a real scenario, replace the URL with the actual GTM endpoint
        xhr.open('GET', `http://localhost:3000/mock-gtm-event?type=${eventType}&label=${eventLabel}`, true);
        xhr.send();
    }

    function updateDashboard() {
        const dashboard = document.getElementById('selectedElements');
        dashboard.innerHTML = "<h2>Selected Elements</h2>";
        let alreadyRead = [];
        interactedElements.forEach(element => {
            const count = interactedElements.filter(e => e.label === element.label).length;
            if(!alreadyRead.includes(element.label)) {
                dashboard.innerHTML += `<p>${element.label} (${element.type}) (${count} interactions)</p>`;
                alreadyRead.push(element.label);
            }
        });
    }

    document.getElementById('close').addEventListener('click', function() {
        document.getElementById('dashboard').classList.toggle('open');
    });
});
