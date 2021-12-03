/*   Appelé avant que le HTML soit chargé    */
console.log("js scripts here.");

/*   Appele une fois le HTML chargé    */
window.onload = actOnWindow;

function actOnWindow(){
    console.log('Lister dans cette fonction toute les fonctions qui peuvent agir sur la page HTML');
}

