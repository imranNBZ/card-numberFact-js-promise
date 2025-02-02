let deckId = null; // Store the deck ID

// Step 1: Draw a single card from a newly shuffled deck and log it
axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => {
        deckId = response.data.deck_id; // Save the deck ID for future use
        return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    })
    .then(response => {
        const card = response.data.cards[0];
        console.log(`${card.value} of ${card.suit}`);
    })
    .catch(error => console.error("Error drawing a card:", error));

// Step 2: Draw two cards from the same deck
axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => {
        deckId = response.data.deck_id;
        return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    })
    .then(response => {
        const firstCard = response.data.cards[0];
        console.log(`${firstCard.value} of ${firstCard.suit}`);

        // Draw another card from the same deck
        return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    })
    .then(response => {
        const secondCard = response.data.cards[0];
        console.log(`${secondCard.value} of ${secondCard.suit}`);
    })
    .catch(error => console.error("Error drawing two cards:", error));

// Step 3: Draw cards from a deck on button click
document.addEventListener("DOMContentLoaded", () => {
    const drawCardBtn = document.getElementById("draw-card-btn");
    const cardInfo = document.getElementById("card-info");
    const cardContainer = document.getElementById("card-container");

    // Fetch a new deck when the page loads
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(response => {
            deckId = response.data.deck_id;
        })
        .catch(error => console.error("Error fetching new deck:", error));

    // Draw a card when the button is clicked
    drawCardBtn.addEventListener("click", () => {
        if (!deckId) {
            console.error("No deck available.");
            return;
        }

        axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
            .then(response => {
                if (response.data.remaining === 0) {
                    drawCardBtn.disabled = true;
                    drawCardBtn.textContent = "No More Cards";
                }

                const card = response.data.cards[0];
                cardInfo.textContent = `${card.value} of ${card.suit}`;
                
                // Show card image
                const cardImage = document.createElement("img");
                cardImage.src = card.image;
                cardContainer.appendChild(cardImage);
            })
            .catch(error => console.error("Error drawing a card:", error));
    });
});
