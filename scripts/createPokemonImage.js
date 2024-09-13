//Rajoute le type du Pokémon
const { createCanvas, loadImage } = require('canvas'),
fs = require('fs');

module.exports = async function createPokemonImage(pokemonUrl, typeUrls, outputPath) {
    try {        
        const pokemonImage = await loadImage(pokemonUrl);
        const typeImages = await Promise.all(typeUrls.map(url => loadImage(url)));
        // Diviser les dimensions du sprite du Pokémon par 2
        const pokemonWidth = Math.floor(pokemonImage.width / 1.5);
        const pokemonHeight = Math.floor(pokemonImage.height / 1.5);

        // La largeur totale est la plus grande entre la largeur du Pokémon réduit et la largeur totale des types
        const canvasWidth = 316
        const canvasHeight = 340

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        // Dessiner l'image du Pokémon réduit
        ctx.drawImage(pokemonImage, (canvasWidth - pokemonWidth) / 2, 0, pokemonWidth, pokemonHeight);
        // Dessiner les images des types en dessous
        let xOffset = Math.floor(canvasWidth / (typeUrls.length * 3.5));
        typeImages.forEach((img) => {
            ctx.drawImage(img, xOffset, pokemonHeight);
            xOffset += img.width;
        });

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
    } catch (error) {
        console.error('Erreur lors de la création de l\'image:', error);
    }
}