"use strict";

const HDB_INFO_URL = "data/HDBCarparkInformation.json";
const CARPARK_API_URL = "https://api.data.gov.sg/v1/transport/carpark-availability";

let allData = [];


function makeSearchable(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


async function init() {
    const errorContainer = document.getElementById("errorMessage");
    
    try {
        const [infoRes, availRes] = await Promise.all([
            fetch(HDB_INFO_URL),
            fetch(CARPARK_API_URL)
        ]);

        if (!infoRes.ok || !availRes.ok) {
            throw new Error("Failed to fetch data sources.");
        }

        const info = await infoRes.json();
        const availabilityData = await availRes.json();
        const availability = availabilityData.items[0].carpark_data;

        allData = info.map(c => {
            const number = c.car_park_no.trim();
            const match = availability.find(a => a.carpark_number.trim() === number);
            const carLot = match ? match.carpark_info.find(x => x.lot_type === "C") : null;

            return {
                number: number,
                address: c.address,
                total: carLot ? carLot.total_lots : "N/A",
                available: carLot ? carLot.lots_available : "N/A",
                searchText: makeSearchable(number + " " + c.address)
            };
        });

        showTable(allData);
    } catch (error) {
        console.error("Error loading carpark data:", error);
        errorContainer.textContent = "Failed to load carpark data. Please try again later.";
        errorContainer.classList.remove("hidden");
    }
}

function showTable(data) {
    const body = document.getElementById("tableBody");
    const noResults = document.getElementById("noResults");
    
    body.innerHTML = "";

    if (data.length === 0) {
        noResults.classList.remove("hidden");
        return;
    }

    noResults.classList.add("hidden");

    const rows = data.map(i => `
        <tr>
            <td>${i.number}</td>
            <td>${i.address}</td>
            <td>${i.total}</td>
            <td>${i.available}</td>
        </tr>
    `).join("");

    body.innerHTML = rows;
}


function search() {
    const input = makeSearchable(document.getElementById("searchInput").value);
    const searchWords = input.split(" ");
    
    const filtered = allData.filter(item => 
        searchWords.every(word => item.searchText.includes(word))
    );
    
    showTable(filtered);
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    showTable(allData);
}

window.onload = init;