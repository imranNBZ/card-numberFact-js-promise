const favoriteNumber = 7; // Change this to your favorite number

// Step 1: Get a single fact
axios.get(`http://numbersapi.com/${favoriteNumber}?json`)
    .then(response => {
        document.getElementById("single-fact").textContent = response.data.text;
    })
    .catch(error => console.error("Error fetching single fact:", error));

// Step 2: Get facts on multiple numbers in one request
const numbers = [3, 7, 12, 20]; // Example numbers
axios.get(`http://numbersapi.com/${numbers}?json`)
    .then(response => {
        const multipleFactsList = document.getElementById("multiple-facts");
        for (let num in response.data) {
            const factItem = document.createElement("li");
            factItem.textContent = response.data[num];
            multipleFactsList.appendChild(factItem);
        }
    })
    .catch(error => console.error("Error fetching multiple facts:", error));

// Step 3: Get 4 facts about the favorite number (multiple requests)
const requests = [
    axios.get(`http://numbersapi.com/${favoriteNumber}?json`),
    axios.get(`http://numbersapi.com/${favoriteNumber}?json`),
    axios.get(`http://numbersapi.com/${favoriteNumber}?json`),
    axios.get(`http://numbersapi.com/${favoriteNumber}?json`)
];

axios.all(requests)
    .then(axios.spread((...responses) => {
        const favoriteFactsList = document.getElementById("favorite-facts");
        responses.forEach(response => {
            const factItem = document.createElement("li");
            factItem.textContent = response.data.text;
            favoriteFactsList.appendChild(factItem);
        });
    }))
    .catch(error => console.error("Error fetching favorite number facts:", error));
