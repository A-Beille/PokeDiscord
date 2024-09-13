//Supprime les accents d'un string
module.exports = function removeAccents(string){
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}