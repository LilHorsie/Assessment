
let mallData = [];

const tableBody = document.getElementById('tableBody');
const carparkTable = document.getElementById('carparkTable');
const noResultsMessage = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

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

async function loadMallData() {
    try {
        const response = await fetch('all_singapore_shopping_malls_carpark.json');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        mallData = await response.json();

        renderTable(mallData);

    } catch (error) {
        console.error("Failed to fetch mall data:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #e74c3c; font-weight: bold;">
                    Error loading data. Check your console.<br>
                    (Note: You must use a local web server to read JSON files, simply double-clicking the HTML file will cause a CORS error).
                </td>
            </tr>
        `;
    }
}

loadMallData();