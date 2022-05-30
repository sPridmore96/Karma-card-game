
const createDeckItems = (deckLength) => {
    deckLength.forEach(cardListItem => {
        cardListItem =
            `<li>
            <section class="card card--back" value="">
                <div class="card__inner card__inner--centered">
                    <div class="card__column">
                        <div class="card__symbol"></div>
                        <div class="card__symbol"></div>
                    </div>
                </div>
            </section>
    </li>`
    });
    return cardListItem
}

console.log(createDeckItems(5)); 
