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

function pescaCarte(mazzo) {
    if (mazzo.length === 0) {
        throw new Error("Il mazzo è vuoto. Non ci sono più carte da pescare.");
    }
    const cartaPescata = mazzo.shift();
    console.log("Carta pescata:", cartaPescata);
    console.log("Carte rimanenti nel mazzo:", mazzo.length);
    return cartaPescata;
}

const manoGiocatore = [];
const manoDealer = [];

function distribuisciCarte(carte, mano, numeroCarte) {
    for (let i = 0; i < numeroCarte; i++) {
        mano.push(pescaCarte(carte));
    }
}
for (let i = 0; i < 2; i++) {
    distribuisciCarte(mazzo, manoGiocatore, 1);
    distribuisciCarte(mazzo, manoDealer, 1);
}

function calcolaValoreMano(mano) {
    let valoreTotale = 0;
    let numeroAssi = 0;
    for (const carta of mano) {
        if (carta.valore === 'Asso') {
            numeroAssi++;
            valoreTotale += 11;
        } else if (['Jack', 'Donna', 'Re'].includes(carta.valore)) {
            valoreTotale += 10;
        } else {
            valoreTotale += parseInt(carta.valore, 10);
        }
    }
    while (valoreTotale > 21 && numeroAssi > 0) {
        valoreTotale -= 10;
        numeroAssi--;
    }
    return valoreTotale;
}

function pescaDealer(mano, mazzo) {
    let valoreMano = calcolaValoreMano(mano);
    while (valoreMano < 17) {
        const cartaPescata = pescaCarte(mazzo);
        mano.push(cartaPescata);
        valoreMano = calcolaValoreMano(mano);
    }
    return valoreMano;
}

function haBlackjack(mano) {
    return mano.length === 2 && calcolaValoreMano(mano) === 21;
}

function determinaVincitore(manoDelGiocatore, manoDelDealer) {
    const valoreGiocatore = calcolaValoreMano(manoDelGiocatore);
    const valoreDealer = calcolaValoreMano(manoDelDealer);
    const blackjackGiocatore = haBlackjack(manoDelGiocatore);
    const blackjackDealer = haBlackjack(manoDelDealer);

    if (valoreGiocatore > 21) {
        return "Hai perso! Hai sballato.";
    }
    else if (blackjackGiocatore && blackjackDealer) {
        return "Pareggio! Entrambi avete un Blackjack!";
    }
    else if (blackjackGiocatore) {
        return "Hai vinto con un Blackjack!";
    }
    else if (blackjackDealer) {
        return "Hai perso! Il dealer ha un Blackjack.";
    }
    else if (valoreDealer > 21) {
        return "Hai vinto! Il dealer ha sballato.";
    }
    else if (valoreGiocatore > valoreDealer) {
        return "Hai vinto!";
    }
    else if (valoreGiocatore < valoreDealer) {
        return "Hai perso!";
    }
    else {
        return "Pareggio!";
    }
}

let partitaFinita = false;

function pescaGiocatore() {
    if (partitaFinita) {
        return null;
    }
    manoGiocatore.push(pescaCarte(mazzo));
    if (calcolaValoreMano(manoGiocatore) > 21) {
        partitaFinita = true;
        return determinaVincitore(manoGiocatore, manoDealer);
    }
    return null;
}

function stai() {
    if (partitaFinita) {
        return null;
    }
    pescaDealer(manoDealer, mazzo);
    partitaFinita = true;
    return determinaVincitore(manoGiocatore, manoDealer);
}

function nuovaPartita() {
    manoGiocatore.length = 0;
    manoDealer.length = 0;
    mazzo.length = 0;
    partitaFinita = false;
    mazzo.push(...creaMazzo());
    mescolaMazzo(mazzo);
    for (let i = 0; i < 2; i++) {
        distribuisciCarte(mazzo, manoGiocatore, 1);
        distribuisciCarte(mazzo, manoDealer, 1);
    }
    return {
        manoGiocatore: manoGiocatore,
        manoDealer: manoDealer
    };
}