//Ce script permet de mettre en majuscule la première lettre d'un String
module.exports = function capitalizeFirstLetter(string){
    if(typeof string !== "string") throw new TypeError(`La fonction capitalizeFirstLetter nécéssite un "string". "${typeof string}" reçu.`)
    return string.charAt(0).toUpperCase() + string.slice(1);
}