// Propiedad para depurar el código JavaScript
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

    // Establecer que el selector ALL marque todos los checkbox
    $('#checkbox_select_all').change (function () {
        // DEBUG: ¿Cuál componente invoca la llamada?
        if (__JSDEBUG === true) console.log('checkbox_select_all: ' + $(this));
        if (__JSDEBUG === true) console.log('checkbox_select_all: ' + $(this).prop('checked'));

        $('.checkbox_participant').prop('checked', $(this).prop('checked'));
    });
};

/*
 * Este handler permite establecer el comportamiento
 * del checkbox ALL.
 * Establece tres estados:
 *     - Checked
 *     - Unchecked
 *     - Indeterminate
 */
checkboxHandler = function checkboxHandler(){
    // DEBUG: Nombre de la función invocada
    if (__JSDEBUG === true) console.log('checkboxHandler()');

    // Reiniciar el estado del checkbox ALL
    $('#checkbox_select_all').
        prop("indeterminate", false).
        prop('checked', false);

    $('.checkbox_participant').change (function () {
        // DEBUG: ¿Cuál componente invoca la llamada?
        if (__JSDEBUG === true) console.log('checkbox_participant: ' + $(this));
        if (__JSDEBUG === true) console.log('checkbox_participant: ' + $(this).val());

        // Se establece cuando ningún checkbox queda por deshabilitar
        if ($('.checkbox_participant:checked').length === 0) {
            $('#checkbox_select_all').
                prop("indeterminate", false).
                prop('checked', false);

        // Se establece cuando todos los checkbox están habilitados
        } else if ($('.checkbox_participant:not(:checked)').length === 0) {
            $('#checkbox_select_all').
                prop("indeterminate", false).
                prop('checked', true);

        // Se establece cuando aún hay checkbox que no están habilitados
        } else {
            $('#checkbox_select_all').
                prop("indeterminate", true);
        }
    });     
};
