"use strict";

let mallData = [];

const tableBody = document.getElementById('tableBody');
const carparkTable = document.getElementById('carparkTable');
const noResultsMessage = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const errorMessage = document.getElementById('errorMessage');

/**
 * Renders the mall data into the HTML table.
 * @param {Array} dataToRender - The array of mall objects to display.
 */
function renderTable(dataToRender) {
    tableBody.innerHTML = ''; 

    if (dataToRender.length === 0) {
        carparkTable.classList.add('hidden');
        noResultsMessage.classList.remove('hidden');
        return;
    }

    carparkTable.classList.remove('hidden');
    noResultsMessage.classList.add('hidden');

    dataToRender.forEach(mall => {
        const row = document.createElement('tr');
        const totalLotsDisplay = mall.total_carpark_lots !== null ? mall.total_carpark_lots : "N/A";
        row.innerHTML = `
            <td><strong>${mall.mall_name}</strong></td>
            <td>${totalLotsDisplay}</td>
            <td>${mall.pricing.weekdays_before_5pm}</td>
            <td>${mall.pricing.weekdays_after_5pm}</td>
            <td>${mall.pricing.saturdays}</td>
            <td>${mall.pricing.sundays_and_ph}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Filters the table based on the user's search input.
 */
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filteredData = mallData.filter(mall => 
        mall.mall_name.toLowerCase().includes(query)
    );
    renderTable(filteredData);
}

searchBtn.addEventListener('click', handleSearch);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderTable(mallData);
});

/**
 * Fetches the mall carpark pricing data from the local JSON file.
 */
async function loadMallData() {
    try {
        const response = await fetch('data/all_singapore_shopping_malls_carpark.json');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        mallData = await response.json();
        renderTable(mallData);

    } catch (error) {
        console.error("Failed to fetch mall data:", error);
        // Provide clear textual feedback for errors to the user
        errorMessage.textContent = "Failed to load mall pricing data. Please try again.";
        errorMessage.classList.remove('hidden');
        carparkTable.classList.add('hidden');
    }
}

window.onload = loadMallData;