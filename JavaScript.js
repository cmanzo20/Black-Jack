let totalCash = 1000;   //starting cash value $1000
let playerSum = 0;  //player card total
let dealerSum = 0;  //dealer card total
let playerAceCount = 0;
let dealerAceCount = 0;
let deck = buildDeck();  //deck of cards
let hiddenCard = 0;
let isMyTurn = true;

//when window loads...
window.onload = function(){
    shuffle(deck);
    updateMaxBet();
}

function buildDeck() {  //returns deck of cards
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    let suit = ["C", "D", "H", "S"];    //club, diamond, heart, spade
    let deck = [];  //empty deck array

    for(let i = 0; i < suit.length; i++){
        for(let j = 0; j < values.length; j++){
            deck.push(values[j] + "-" + suit[i]);   //appends "SUIT-VALUE"
        }
    }

    return deck;    //returns fully built deck of cards
}

function shuffle(deck){
    for(let i = 0; i<deck.length; i++){
        let randomIndex = Math.floor(Math.random()*deck.length);
        let temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}

function getCardValue(card){    //returns cards numerical value
    let value_PNG = card.split("-");
    if(isNaN(value_PNG[0])){  //face card
        if(value_PNG[0]== 'A')
            return 11;
        else    //non Ace face card
            return 10;
    }
    return(parseInt(value_PNG[0]));
}

function resetGame(){
    playerSum = 0;
    dealerSum = 0;
    playerAceCount = 0;
    dealerAceCount = 0;
    subtractBet();  
    removeCards();
    updateMaxBet();
    isMyTurn = true;
}

function updateMaxBet(){    //updates max bet value to remaining balance
    let maxBet = document.getElementById('betAmount');
    maxBet.setAttribute("max", totalCash);  //max bet amount is what balance remains
}

function subtractBet(){ //deduct bet from total cash
    betAmount = document.getElementById("betAmount").value;
    totalCash -= betAmount;
}

function removeCards(){ //removes cards from screen
    let DealerCards = document.getElementById("DealerCards");
    let PlayerCards = document.getElementById("PlayerCards");
    DealerCards.textContent = "";
    PlayerCards.textContent = "";
}

function displayCard(card, displayLocation){    //display card on webpage
    let CardDisplayLocation = document.getElementById(displayLocation);
    let img = document.createElement('img');
    img.src = '/Cards/'+ card+'.png';
    displayLocation.appendChild(img);
}

function dealPlayerCard(){
    playerSum += getCardValue(deck[deck.length - 1]);
    if(getCardValue(deck[deck.length - 1]) == 11)   //if ace
        playerAceCount+=1;
    displayCard(deck[deck.length - 1], PlayerCards);
    deck.pop();
}

function dealDealerCard(){
    dealerSum += getCardValue(deck[deck.length-1]); //deal 2nd card to dealer
    if(getCardValue(deck[deck.length - 1]) == 11)   //if ace
        dealerAceCount+=1;
    displayCard(deck[deck.length-1], DealerCards);
    deck.pop();
}

function dealCards(){
    hiddenCard = deck[deck.length-1];   //save hidden card
    dealerSum += getCardValue(deck[deck.length-1]); //deal 1st card to dealer
    if(getCardValue(deck[deck.length - 1]) == 11)   //if ace
        dealerAceCount+=1;
    displayCard("BACK", DealerCards);   //Does not display first card
    deck.pop();
    dealPlayerCard();
    dealDealerCard();
    dealPlayerCard();
}

function flipHiddenCard(newCard) {
    const hidden = document.querySelector("#DealerCards img:first-of-type");
    hidden.src = "/Cards/"+newCard+".png";
}

function handleStand(){
    if(isMyTurn){
        alert("You decided to stand with a total of: " + playerSum);
        flipHiddenCard(hiddenCard);
        isMyTurn = false;

        while(dealerSum < 17){   //dealer draws until 17+
            dealDealerCard();
            //maybe add sleep function to display cards slowly/1 at a time
        }
    }
}

function handleHit(){
    console.log("Hit has been pressed");
    if(isMyTurn){
        if (playerSum < 21) {
            dealPlayerCard();
            if (playerSum == 21) {
                alert("Blackjack!");
                isMyTurn = false;
            }
            else if (playerSum > 21){
                if(playerAceCount > 0){
                    playerAceCount-=1;
                    playerSum -=10;
                    alert("FYI- your ace is now a 1");
                }
                else{
                    alert("BUST");
                    isMyTurn = false;
                }
            }
        }
    }
}

function Gamble(event){
    event.preventDefault(); //prevent page reload
    resetGame();
    dealCards();

    let hit = document.getElementById("Hit");
    let stand = document.getElementById("Stand");
      
    hit.addEventListener('click', handleHit); 
    stand.addEventListener('click', handleStand); 
}