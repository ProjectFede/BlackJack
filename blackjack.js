const composizioneMazzo = {
    semi: ['Cuori', 'Quadri', 'Fiori', 'Picche'],
    valori: ['Asso', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Donna', 'Re']
};

function creaMazzo() {
    const carte = [];
    for (const seme of composizioneMazzo.semi) {
        for (const valore of composizioneMazzo.valori) {
            carte.push({ valore: valore, seme: seme });
        }
    }
    return carte;
}

function mescolaMazzo(carteMescolate) {
    for (let i = carteMescolate.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [carteMescolate[i], carteMescolate[j]] = [carteMescolate[j], carteMescolate[i]];
    }
    return carteMescolate;
}

const mazzo = creaMazzo();
console.log(mazzo.length);

mescolaMazzo(mazzo);
console.log(mazzo.length);

function pescaCarta(mazzo) {
    if (mazzo.length === 0) {
        throw new Error("Il mazzo è vuoto. Non ci sono più carte da pescare.");
    }
        const cartaPescata = mazzo.shift();
        console.log("Carta pescata:", cartaPescata);
        console.log("Carte rimanenti nel mazzo:", mazzo.length);
    return cartaPescata;
}

