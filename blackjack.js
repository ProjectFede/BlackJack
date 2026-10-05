const PUNTEGGIO_MASSIMO = 21;
const SOGLIA_DEALER = 17; 
const FIGURE = ['Jack', 'Donna', 'Re'];

const composizioneMazzo = {
    semi: ['Cuori', 'Quadri', 'Fiori', 'Picche'],
    valori: ['Asso', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Donna', 'Re']
};

const mazzo = [];
const manoGiocatore = [];
const manoDealer = [];
let partitaFinita = false;

const elementi = {
    carteGiocatore: document.getElementById('carte-giocatore'),
    carteDealer: document.getElementById('carte-dealer'),
    totaleGiocatore: document.getElementById('totale-giocatore'),
    totaleDealer: document.getElementById('totale-dealer'),
    risultato: document.getElementById('risultato'),
    pulsantePesca: document.getElementById('pulsante-pesca'),
    pulsanteStai: document.getElementById('pulsante-stai'),
    pulsanteNuovaPartita: document.getElementById('nuova-partita')
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

function mescolaMazzo(carte) {
    for (let i = carte.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [carte[i], carte[j]] = [carte[j], carte[i]];
    }
    return carte;
}

function pescaCarte(carte) {
    if (carte.length === 0) {
        throw new Error("Il mazzo è vuoto. Non ci sono più carte da pescare.");
    }
    return carte.shift();
}

function distribuisciCarte(carte, mano, numeroCarte) {
    for (let i = 0; i < numeroCarte; i++) {
        mano.push(pescaCarte(carte));
    }
}

function calcolaValoreMano(mano) {
    let valoreTotale = 0;
    let numeroAssi = 0;
    for (const carta of mano) {
        if (carta.valore === 'Asso') {
            numeroAssi++;
            valoreTotale += 11;
        } else if (FIGURE.includes(carta.valore)) {
            valoreTotale += 10;
        } else {
            valoreTotale += parseInt(carta.valore, 10);
        }
    }
    while (valoreTotale > PUNTEGGIO_MASSIMO && numeroAssi > 0) {
        valoreTotale -= 10;
        numeroAssi--;
    }
    return valoreTotale;
}

function haBlackjack(mano) {
    return mano.length === 2 && calcolaValoreMano(mano) === PUNTEGGIO_MASSIMO;
}

function determinaVincitore(manoDelGiocatore, manoDelDealer) {
    const valoreGiocatore = calcolaValoreMano(manoDelGiocatore);
    const valoreDealer = calcolaValoreMano(manoDelDealer);
    const blackjackGiocatore = haBlackjack(manoDelGiocatore);
    const blackjackDealer = haBlackjack(manoDelDealer);

    if (valoreGiocatore > PUNTEGGIO_MASSIMO) {
        return "Hai perso! Hai sballato.";
    } else if (blackjackGiocatore && blackjackDealer) {
        return "Pareggio! Entrambi avete un Blackjack!";
    } else if (blackjackGiocatore) {
        return "Hai vinto con un Blackjack!";
    } else if (blackjackDealer) {
        return "Hai perso! Il dealer ha un Blackjack.";
    } else if (valoreDealer > PUNTEGGIO_MASSIMO) {
        return "Hai vinto! Il dealer ha sballato.";
    } else if (valoreGiocatore > valoreDealer) {
        return "Hai vinto!";
    } else if (valoreGiocatore < valoreDealer) {
        return "Hai perso!";
    } else {
        return "Pareggio!";
    }
}

function pescaDealer(mano, carte) {
    let valoreMano = calcolaValoreMano(mano);
    while (valoreMano < SOGLIA_DEALER) {
        mano.push(pescaCarte(carte));
        valoreMano = calcolaValoreMano(mano);
    }
    return valoreMano;
}

function pescaGiocatore() {
    if (partitaFinita) {
        return null;
    }
    manoGiocatore.push(pescaCarte(mazzo));
    let risultato = '';
    if (calcolaValoreMano(manoGiocatore) > PUNTEGGIO_MASSIMO) {
        partitaFinita = true;
        risultato = determinaVincitore(manoGiocatore, manoDealer);
    }
    aggiornaSchermata(risultato);
    return risultato || null;
}

function stai() {
    if (partitaFinita) {
        return null;
    }
    pescaDealer(manoDealer, mazzo);
    partitaFinita = true;
    const risultato = determinaVincitore(manoGiocatore, manoDealer);
    aggiornaSchermata(risultato);
    return risultato;
}

function nuovaPartita() {
    manoGiocatore.length = 0;
    manoDealer.length = 0;
    mazzo.length = 0;
    mazzo.push(...creaMazzo());
    mescolaMazzo(mazzo);
    for (let i = 0; i < 2; i++) {
        distribuisciCarte(mazzo, manoGiocatore, 1);
        distribuisciCarte(mazzo, manoDealer, 1);
    }
    partitaFinita = haBlackjack(manoGiocatore) || haBlackjack(manoDealer);
    aggiornaSchermata(partitaFinita ? determinaVincitore(manoGiocatore, manoDealer) : '');
}

function mostraMano(elemento, mano, copriSeconda = false) {
    elemento.textContent = '';
    for (let i = 0; i < mano.length; i++) {
        const elementoCarta = document.createElement('span');
        if (copriSeconda && i === 1) {
            elementoCarta.className = 'carta coperta';
            elementoCarta.textContent = 'Carta coperta';
        } else {
            elementoCarta.className = 'carta';
            elementoCarta.textContent = `${mano[i].valore} di ${mano[i].seme}`;
        }
        elemento.append(elementoCarta);
    }
}

function aggiornaPulsanti() {
    if (partitaFinita) {
        elementi.pulsantePesca.style.display = 'none';
        elementi.pulsanteStai.style.display = 'none';
    } else {
        elementi.pulsantePesca.style.display = '';
        elementi.pulsanteStai.style.display = '';
    }
}

function aggiornaSchermata(messaggio = '') {
    mostraMano(elementi.carteGiocatore, manoGiocatore);
    mostraMano(elementi.carteDealer, manoDealer, !partitaFinita);
    elementi.totaleGiocatore.textContent = calcolaValoreMano(manoGiocatore);
    const manoVisibileDealer = partitaFinita ? manoDealer : manoDealer.slice(0, 1);
    elementi.totaleDealer.textContent = calcolaValoreMano(manoVisibileDealer);
    elementi.risultato.textContent = messaggio;
    aggiornaPulsanti();
}

elementi.pulsantePesca.addEventListener('click', pescaGiocatore);
elementi.pulsanteStai.addEventListener('click', stai);
elementi.pulsanteNuovaPartita.addEventListener('click', nuovaPartita);

nuovaPartita();