/**
 * Rechazar el aviso de privacidad en ventana modal
 */
var privacy_accept_user_modal_cancel = function() {
    $('#id_privacy_accept').iCheck('uncheck');
};

/**
 * Aceptar el aviso de privacidad en ventana modal
 */
var privacy_accept_user_modal_confirm = function() {
    $('#id_privacy_accept').iCheck('check');
};

/**
 * Función auxiliar para determinar el estado del checkbox de política de privacidad
 */
var privacy_accept_validation = function() {
    if ($('#id_privacy_accept:checked').val() == "on") {
        return true;
    }
	return false;
};
