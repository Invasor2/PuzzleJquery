/* 
 * MODUL 6: Desenvolupament Web Entorn Client
 * 
 * Práctica: PROJECTE: PUZZLE CONTROLADO MEDIANTE EL TECLADO
 * Contenido del proyecto: 
 *      1) Directorio css: contiente la hoja de estilos.
 *      2) Directorio images: contiene la imagen que se utiliza para crear el slider.
 *      3) Directorio js Contiene el fichero JS que se encarga de la programación del Puzzle.
 * Autor: Jason Guatatoca
 * Curs: 2014-2015
 * Descripció: 
 * 
 *          ******* CREANDO EL TABLERO Y LAS PIEZAS *******
 *      Inicialmente en el html creo un DIV que será el contenedor del puzzle, llamado 'game_object'. 
 *      Sobre este elemento se crean las partes del puzzle.
 *      Luego mediante el selector de Jquery creo un DIV llamado 'board' que será el verdadero contenedor de las piezas del puzzle.
 *      Mediante el selector de Jquery también le definimos unas medidas al 'board' contenedor de las piezas.
 *      En este juego se han utilizado medidas fijas.
 *      Una vez creado el contenedor, ahora creamos las piezas.
 *      Para esto:
 *          - Nuestro puzzle será de 4x4.
 *          - Cada div dentro de board(las piezas) tiene de fondo la misma imagen, esto se hace mediante css.
 *          - Es decir todas las piezas tienen la misma imagen, pero mostrará solamente la parte que le corresponde segun la posición que ocupe en el 'board'.
 *          - Ahora cada div tendrá como fondo solo la parte que le corresponde dependiendo su posición en el tablero 'board'.
 *          - Con esto se consigue el efecto visual de haber troceado completamente la image.
 *       Tener en cuenta que:
 *          - En el momento de crear las piezas(div). 
 *            Tendremos que asignarles el nombres de las clases que necesitamos para que puedan ser interpretados por el CSS
 *            y podamos tener el efecto visual esperado.
 *                  * clase can_be_selected: lo tendrán todos los divs y mediante los selectores Jquery podemos manipularlos y trabajar con ellos.
 *                  * clase selected: solo lo tendrá la pieza activa. Visualmente será un borde rojo. También nos permitirá manipularlo mendiante Jquery.
 *      Ya lo tenemos casi todo, pero no podemos dejarnos la pieza en blanco.
 *      En este caso se ha elegido que sea el último div del board. Entonces mediante Jquery, le damos un fondo blanco a este div.
 *      
 *      Más:
 *          - Para acceder a los divs dentro del contenedor 'board' se ha utilizado 2 maneras:
 *              * se puede acceder mediante dos maneras:
 *                  1) $('#idContenedor').children("div:nth-child(" + index + ")") Es una pseudo-clase CSS.
 *                      Donde index: es el número de hijo que le corresponde a los hijos dentro de un contenedor padre. Se enumaran empezando por 1 hasta N(total nodos hijos).
 *                  2) $('#board div:eq(' + index + ')') DOM.
 *                      Donde index: es el numero de nodo que le corresponde respecto de su nodo padre. En este caso se empieza por 0.
 *          - Entonces dependiendo de la manera que queremos acceder a un div, los valores de index pueden ser diferentes.
 *              Por ejemplo para acceder la primera pieza con el metodo será 'index=1', con el método 2 sería 'index=0'
 *              
 *          - En esta aplicación se ha utilizado las dos maneras.
 *              
 *              
 *          ******* EVENTOS DEL TECLADO *******
 *      La interación del usuario con la aplicación será únicamente mediante el teclado:
 *          1) La navegación entre piezas se realiza mediante las teclas de dirección del teclado.
 *          2) Para mover una pieza tendrá que hacerce mediante la tecla 'enter'.
 *      Entonces la navegación por las piezas se hacen por teclado. Y la selección también.
 *
 *          ******* CONDICIONES PARA EL MOVIMIENTO *******
 *      Una pieza se moverá únicamente si está al lado de una pieza blanca. 
 *      Si no se encuentra al lado de una pieza en blanco, no sucederá el intercambio de posición de las piezas.
 *      
 *      
 *          ******* INTELIGENCIA PARA EL INTERCAMBIO DE PIEZAS *******
 *      Cuando el selector está situado en una pieza y se presiona enter, entonces se desencadena una serie de comprobaciones
 *      que finalmente resolverá si la pieza realiza algún desplazamiento o no.
 *      Para esto existe un método que realiza las comprovaciones. Esta se acciona con la tecla ENTER.
 *      
 *      funcion Move( clicked_square : elemento DOM, square_size : int )
 *      
 *      parámetros:
 *          clicked_square: es un div que contiene toda la información del elemento DOM, por ejemplo medidas, fondo, coordenadas dentro del tablero, etc.
 *          square_size   : es la medida que tienen todas las piezas. Es una constante.
 *          
 *      Para mover una pieza, siempre debemos tener localizado la pieza en blanco y obviamente la pieza actual.
 *      Para más detalle se explica linea a linea en el propio método. Si quieres leerlos, desplazate hasta el método.
 *      
 *          ******* OBSERVACIONES, COSAS QUE SE PUDO HACER *******
 *      - No se ha desordenado el puzzle.
 *      - Podría mostrarse un cronómetro y un contador de movimientos.
 *      - No se verifica cuando el usuario a completado el puzzle.    
 *    
 */

var square_size;
var listaPosiciones = [];
var totalDivs = 16;
var divBlanc = 15;
var index = 0;

var contador=0;

$(document).ready(function () {

    /**
     * Mi puzzle 
     * Primero necesito tener una array con la id de cada DIV que generaré más adelante.
     * @type Number
     */
    omplirArrayPosicions();
    var zi = 1;
    var EmptySquare = 16;

    $.fn.extend({fifteen:
                function (mida) {
                    square_size = mida;
                    var gameObjectElement = '#' + $(this).attr('id');
                    var boardSize = (square_size * 4) + 'px';//el tablero será 4 veces la medida de la pieza

                    $(gameObjectElement).html('<div id="board"></div>');//creamos el tablero 'board'

                    $('#board').css({position: 'absolute', width: boardSize, height: boardSize, border: '1px solid gray'});

                    // Populate the game board's HTML container with 15 squares
                    for (var i = 0; i < 16; i++) {
                        // A dirty way to create an arbitrary DIV and append it into HTML dynamically
                        // Notice each square uses the same image. It just uses a different x/y offset for each square
                        if (i !== 0)//la primera pieza debe aparecer seleccionada
                            $('#board').append("<div class=can_be_selected style='left: " + ((i % 4) * square_size) + "px; top: " + Math.floor(i / 4) * square_size + "px; width: " + square_size + "px; height: " + square_size + "px; background-position: " + (-(i % 4) * square_size) + "px " + -Math.floor(i / 4) * square_size + "px '></div>");
                        else//las demás piezas no aparecen seleccionados
                            $('#board').append("<div class= 'can_be_selected selected' style='left: " + ((i % 4) * square_size) + "px; top: " + Math.floor(i / 4) * square_size + "px; width: " + square_size + "px; height: " + square_size + "px; background-position: " + (-(i % 4) * square_size) + "px " + -Math.floor(i / 4) * square_size + "px '></div>");
                    }

                    //al último div le pintamos un fondo blanco
                    $('#board').children("div:nth-child(" + EmptySquare
                            + ")").css({backgroundImage: "", background: "#ffffff"});
                }
    });

    /********* EVENTOS DEL TECLADO ******* **/
    var filaActual = 0;
    var colActual = 0;
    var files = 4, columnes = 4;
    $(document).keydown(function (e) {
        //primero que todo quitamos el el efecto de seleccionado a la celda actual.
        $('#board div:eq(' + index + ')').removeClass('selected');
        switch (e.keyCode) {

            case 37:    // ←
                colActual = (colActual === 0) ? columnes - 1 : --colActual;
                break;
            case 38:    // ↑
                filaActual = (filaActual === 0) ? files - 1 : --filaActual;
                break;
            case 39:    // →
                colActual = (colActual === columnes - 1) ? 0 : ++colActual;
                break;
            case 40:    //↓
                filaActual = (filaActual === files - 1) ? 0 : ++filaActual;
                break;
            case 13:
                //MOVER PIEZA
                Move($('#board div:eq(' + index + ')'), square_size);
                break;
        }
        index = listaPosiciones[colActual + filaActual * columnes];
        $("#prova").text("fila =" + filaActual + "columna =" + colActual + " index = " + index);
        $('#board div:eq(' + index + ')').addClass('selected');
    });

    function Move(clicked_square, square_size) {

        var movable = false;//inicialmente ninguna pieza se puede mover

        //obtenemos las coordenadas de la pieza en blanco
        var oldx = $('#board').children("div:nth-child(" + EmptySquare + ")").css('left');
        var oldy = $('#board').children("div:nth-child(" + EmptySquare + ")").css('top');

        //obtenemos las coordenadas de la pieza que intenta moverse
        var newx = $(clicked_square).css('left');
        var newy = $(clicked_square).css('top');

        // comprovamos si se puede mover hacia arriba
        if (oldx === newx && newy === (parseInt(oldy) - square_size) + 'px')
            movable = true;

        // comprovamos si se puede mover hacia abajo
        if (oldx === newx && newy === (parseInt(oldy) + square_size) + 'px')
            movable = true;

        // comprovamos si se puede mover hacia la izquierda
        if ((parseInt(oldx) - square_size) + 'px' === newx && newy === oldy)
            movable = true;

        // comprovamos si se puede mover hacia la derecha
        if ((parseInt(oldx) + square_size) + 'px' === newx && newy === oldy)
            movable = true;

        if (movable) {// si se ha comprovado que se puede mover, entonces se procede a hacer los intercambios.
            //z-index es para asegurarnos que el fondo de la pieza actual es la capa más superior.
            $(clicked_square).css('z-index', zi++);
            
            
            //actualizamos la lista de la array de piezas
            var aux = listaPosiciones[divBlanc];
            listaPosiciones[divBlanc] = listaPosiciones[index];
            listaPosiciones[index] = aux;
            //también actualizamos la posición de la pieza en blanco y la pieza actual seleccionada
            aux = divBlanc;
            divBlanc = index;

            // finalmente intercambiamos de coordenada a las piezas.
            $(clicked_square).animate({left: oldx, top: oldy}, 200, function () {//a la vieja posición
                //a la nueva
                $('#board').children("div:nth-child(" + EmptySquare + ")").css('left', newx);
                $('#board').children("div:nth-child(" + EmptySquare + ")").css('top', newy);
                contador++;
                $('#contador').text(contador);
            });
        }
    }

    /**
     * Creo una lista con todas las piezas. Como los tengo ordenados, los tendré de 1 al total de piezas.
     * @returns {undefined}
     */
    function omplirArrayPosicions() {
        var i;
        for (i = 0; i < totalDivs; i++)
            listaPosiciones[i] = i;
    }


    // AHORA FINALMENTE YA PODEMOS INICIAR EL PUZZLE!!!
    // Creamos un juego con las piezas de 175px x 175px dentro del div "#game_object"
    $('#game_object').fifteen(175);
});