/*
 * Función auxiliar para enviar el formulario al presionar la tecla Enter
 */
var isEnter = function (event, idButton) {
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    //13 corresponde al intro
    if (keyCode == 13) {
        $('#'+idButton).click();
    }
}

var SHOW_LIST_ON_MOVE = true;
