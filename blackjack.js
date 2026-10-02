const mazzo = {
    semi: ['Cuori', 'Quadri', 'Fiori', 'Picche'],
    carte: ['Asso', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Donna', 'Re']
};

function creaMazzo() {
    let mazzoCompleto = [];
    for (let seme of mazzo.semi) {
        for (let carta of mazzo.carte) {
            mazzoCompleto.push({ valore: carta, seme: seme });
        }
    }

    return mazzoCompleto;
}

const MazzoFinito = creaMazzo();
console.log(MazzoFinito);
console.log(MazzoFinito.length);