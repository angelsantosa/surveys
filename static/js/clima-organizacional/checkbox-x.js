// Funciones para el manejo de checbox superior de tres estados (ALL, NONE, SEMI) y control de checbox dependientes
// checkbox-x.js
// Depende de bootstrap-checkbox-x

/**
 * Notas de implementación final:
 *
 * Se tuvo que realizar una implementación manejando tres checkbox, cada uno representando el estado ALL, NONE, SEMI.
 * Esto se llevo a cabo debido a problemas con el funcionamiento del evento checkboxX("refresh"), cuando se
 * manejaba la llamada desde el control superior, se aplicaba el cambio, pero cuando se volvia a invocar el control
 * inferior realizaba una especie de bloqueo y su valor ya no cambiaba. Se intentarón múltiples pruebas
 * utilizando incluso checkboxX("reset") y estableciendo el valor, pero llegaba a pesentarse el mismo efecto.
 *
 * Se decidio utilizar tres elementos, que se ocultan y presentan dependiendo de la acción elegida.
 * Estos elementos ejecutan las acciones en el onChange, manipulando las opciones de los checkbox dependientes.
 *
 * Se mantiene el uso del plugin bootstrap checkbox-x debido a que permite la representación del estado indeterminado.
 * Permite establecer el icono que se presenta en cada estado.
 *
 */

/* DEMO

    <!-- Agregar el archivo de estilo bootstrap-checkbox-x -->
    <link rel="stylesheet" href="plugins/bootstrap-checkbox-x/css/checkbox-x.min.css">

    <!-- Agregar tres checkbox superiores -->

    <!-- Se requiere el uso de tres checkbox, donde cada uno represente un estado, debido a problemas con el plugin. Veáse checkbox-x.js -->
    <div id="checkbox_select_all_container">
        <!-- Initializing plugin on checkbox inputs enclosed in labels. Trap change event for parsing output. -->
        <label class="cbx-label">
            <input type='checkbox' id="checkbox_select_all" data-toggle="checkbox-x" data-enclosed-label="true"/>
            ALL
        </label>
    </div>
    <div id="checkbox_select_none_container">
        <label class="cbx-label">
            <input type='checkbox' id="checkbox_select_none" data-toggle="checkbox-x" data-enclosed-label="true"/>
            NONE
        </label>
    </div>
    <div id="checkbox_select_semi_container">
        <label class="cbx-label">
            <input type='checkbox' id="checkbox_select_semi" data-toggle="checkbox-x" data-enclosed-label="true"/>
            SEMI
        </label>
    </div>

    <!-- Agregar cada checkbox dependiente la clase "checkbox_participant" -->
    <div class="checkbox">
        <input type='checkbox' id="tall-1" class='checkbox_participant'/>
        <label for="tall-1">Smurfs</label>
    </div>
    <div class="checkbox">
         <input type='checkbox' id="tall-2" class='checkbox_participant'/>
         <label for="tall-2">Mushrooms</label>
    </div>
    <div class="checkbox">
         <input type='checkbox' id="tall-3" class='checkbox_participant'/>
         <label for="tall-3">One Sandwich</label>
    </div>

    <!-- Agregar el archivo de javascript bootstrap-checkbox-x y clima-organizacional-checkbox-x -->
    <script src="js/clima-organizacional/checkbox-x.js"></script>
    <script src="plugins/bootstrap-checkbox-x/js/checkbox-x.min.js"></script>

    <!-- Inicializar checkboxAllHandler y checkboxHandler -->
    <script>
        jQuery(document).ready(function() {
            // Visualización y comportamiento de los checkbox superior
            checkboxAllHandler();
            // Visualización y comportamiento de los checkbox dependientes
            checkboxHandler();
        });
    </script>

*/

// Propiedad para depurar el código JavaScript
// Colocar en true, para activar mensajes de consola
var __JSDEBUG = false

/*
 * Este handler permite establecer el comportamiento
 * de los checkbox dependientes cuando cambia el checkbox ALL.
 * Establece dos estados:
 *     - Checked ALL
 *     - Unchecked ALL
 */
checkboxAllHandler = function checkboxAllHandler(){
    // DEBUG: Nombre de la función invocada
    if (__JSDEBUG === true) console.log('checkboxAllHandler()');

    // Inicializa los checkbox
    $('#checkbox_select_all').checkboxX({
        threeState: false,
        size:'sm',
        iconChecked: '<i class="glyphicon glyphicon-ok"></i>',
        iconUnchecked: '<i class="glyphicon glyphicon-ok"></i>',
        iconNull: '<i class="glyphicon glyphicon-ok"></i>',
    });
    $('#checkbox_select_none').checkboxX({
        threeState: false,
        size:'sm',
        iconChecked: '',
        iconUnchecked: '',
        iconNull: '',
    });
    $('#checkbox_select_semi').checkboxX({
        threeState: false,
        size:'sm',
        iconChecked: '<i class="glyphicon glyphicon-minus"></i>',
        iconUnchecked: '<i class="glyphicon glyphicon-minus"></i>',
        iconNull: '<i class="glyphicon glyphicon-minus"></i>',
    });

    // Iniciaiza con el checkbox NONE
    checkboxNone();

    // Establecer que el selector ALL desmarque todos los checkbox
    $('#checkbox_select_all').change(function () {
        if (__JSDEBUG === true) console.log('ALL checkboxAllHandler():change');

        // DEBUG: ¿Cuál componente invoca la llamada?
        if (__JSDEBUG === true) console.log('checkbox_select_all: ' + $(this));
        if (__JSDEBUG === true) console.log('checkbox_select_all: ' + $(this).prop('checked'));
        if (__JSDEBUG === true) console.log('checkbox_select_all: ' + $(this).val());

        // Al presionar ALL, apaga los checkbox dependientes y cambia por NONE
        $('.checkbox_participant').checkboxX("reset");
        $('.checkbox_participant').val(0).checkboxX("refresh");
        checkboxNone();
    });

    // Establecer que el selector NONE marque todos los checkbox
    $('#checkbox_select_none').change(function () {
        if (__JSDEBUG === true) console.log('NONE checkboxAllHandler():change');

        // DEBUG: ¿Cuál componente invoca la llamada?
        if (__JSDEBUG === true) console.log('checkbox_select_none: ' + $(this));
        if (__JSDEBUG === true) console.log('checkbox_select_none: ' + $(this).prop('checked'));
        if (__JSDEBUG === true) console.log('checkbox_select_none: ' + $(this).val());

        // Al presionar NONE, enciende los checkbox dependientes y cambia por ALL
        $('.checkbox_participant').checkboxX("reset");
        $('.checkbox_participant').val(1).checkboxX("refresh");
        checkboxAll();
    });

    // Establecer que el selector SEMI regrese el control a ALL
    $('#checkbox_select_semi').change(function () {
        if (__JSDEBUG === true) console.log('SEMI checkboxAllHandler():change');

        // DEBUG: ¿Cuál componente invoca la llamada?
        if (__JSDEBUG === true) console.log('checkbox_select_semi: ' + $(this));
        if (__JSDEBUG === true) console.log('checkbox_select_semi: ' + $(this).prop('checked'));
        if (__JSDEBUG === true) console.log('checkbox_select_semi: ' + $(this).val());

        // Al presionar SEMI, enciende los checkbox dependientes y cambia por ALL
        $('.checkbox_participant').checkboxX("reset");
        $('.checkbox_participant').val(1).checkboxX("refresh");
        checkboxAll();
    });
};

/*
 * Este handler permite establecer el comportamiento
 * del checkbox ALL.
 * Establece tres estados:
 *     - Checked            ALL
 *     - Unchecked          NONE
 *     - Indeterminate      SEMI
 */
checkboxHandler = function checkboxHandler(){
    // DEBUG: Nombre de la función invocada
    if (__JSDEBUG === true) console.log('checkboxHandler()');

    $('.checkbox_participant').checkboxX({threeState: false, size:'sm',});

    // Reiniciar el estado del checkbox NONE
    checkboxNone();

    $('.checkbox_participant').change(function () {
        if (__JSDEBUG === true) console.log('checkboxHandler():change');

        // DEBUG: ¿Cuál componente invoca la llamada?
        if (__JSDEBUG === true) console.log('checkbox_participant: ' + $(this));
        if (__JSDEBUG === true) console.log('checkbox_participant: ' + $(this).val());

        // Se establece cuando ningún checkbox queda por deshabilitar
        // state: NONE
        if ($('.checkbox_participant:not([value=0])').length === 0) {

            // Presenta el checkbox NONE
            checkboxNone();

        }
        // Se establece cuando todos los checkbox están habilitados
        // state: ALL
        else if ($('.checkbox_participant:not([value=1])').length === 0) {

            // Presenta el checkbox ALL
            checkboxAll();

        }
        // Se establece cuando aún hay checkbox que no están habilitados
        // state: SEMI
        else {

            // Presenta el checkbox SEMI
            checkboxSemi();

        }

    });

};

/*
 * Esta es una función auxiliar, que permite mostrar
 * el checkbox ALL.
 * Establece tres estados:
 *     - Checked            ALL
 */
checkboxAll = function checkboxAll(){
    $('#checkbox_select_none_container').hide();
    $('#checkbox_select_semi_container').hide();

    $('#checkbox_select_all_container').show();
};

/*
 * Esta es una función auxiliar, que permite mostrar
 * el checkbox NONE.
 * Establece tres estados:
 *     - Unchecked          NONE
 */
checkboxNone = function checkboxNone(){
    $('#checkbox_select_all_container').hide();
    $('#checkbox_select_semi_container').hide();

    $('#checkbox_select_none_container').show();
};

/*
 * Esta es una función auxiliar, que permite mostrar
 * el checkbox SEMI.
 * Establece tres estados:
 *     - Indeterminate      SEMI
 */
checkboxSemi = function checkboxSemi(){
    $('#checkbox_select_all_container').hide();
    $('#checkbox_select_none_container').hide();

    $('#checkbox_select_semi_container').show();
};
