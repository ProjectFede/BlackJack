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

function mescolaMazzo(mescolaCarte) {
    for (let i = mescolaCarte.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [mescolaCarte[i], mescolaCarte[j]] = [mescolaCarte[j], mescolaCarte[i]];
    }
    return mescolaCarte;
}

const mazzo = creaMazzo();
console.log(mazzo.length);

mescolaMazzo(mazzo);
console.log(mazzo.length);

