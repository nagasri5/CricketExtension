let allMatches = [];

async function getMatchData() {
    const apiUrl = "https://api.cricapi.com/v1/currentMatches?apikey=b861669b-f545-4268-a083-7f43d3aeb3b3&offset=0";

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== "success") {
            throw new Error("Failed to fetch match data");
        }

        const matchesList = data.data;
        if (!matchesList) {
            throw new Error("No ongoing matches");
        }

        allMatches = matchesList;
        return matchesList;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function createMatchBox(match, index) {
    const matchBox = document.createElement("div");
    matchBox.className = "match-box";
    matchBox.id = `match${index + 1}`;

    const matchContent = document.createElement("p");
    matchContent.textContent = `${match.name}, ${match.status}`;

    matchBox.appendChild(matchContent);

    return matchBox;
}

function displayMatches(matches) {
    const matchesListElement = document.getElementById("matches-list");

    matchesListElement.innerHTML = "";
    
    matches.forEach((match, index) => {
        const matchBox = createMatchBox(match, index);
        matchesListElement.appendChild(matchBox);
    });
}

function searchMatches() {
    const searchInput = document.getElementById("search-input").value.toLowerCase().trim();

    if (searchInput === "") {
        displayMatches(allMatches);
    } else {
        const filteredMatches = allMatches.filter(match => match.name.toLowerCase().includes(searchInput));
        displayMatches(filteredMatches);
    }
}

async function refreshMatches() {
    const matches = await getMatchData();
    displayMatches(matches);
}

document.addEventListener("DOMContentLoaded", () => {
    getMatchData().then(matches => displayMatches(matches));

    document.getElementById("search-button").addEventListener("click", searchMatches);
    document.getElementById("search-input").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchMatches();
        }
    } );
} );
