$(document).ready(function() {
    $('#id_has_privacy_accept').focus();
    $('#user_account_privacy_accept_submit').addClass('disabled');

    /**
     * Acciones si se acepta el aviso de privacidad

       - Habilitar el botón de envío
       - Notificar que se acepto el aviso de privacidad
    */
    $('#id_has_privacy_accept').on('ifChecked', function(event){
        toastr.info(gettext('user-account-has-privacy-accept'));
        $('#user_account_privacy_accept_submit').removeClass('disabled');
    });

    /**
     * Acciones si se rechaza el aviso de privacidad

       - Deshabilitar el botón de envío
       - Notificar que se rechazó el aviso de privacidad
    */
    $('#id_has_privacy_accept').on('ifUnchecked', function(event){
        toastr.warning(gettext('user-account-has-privacy-cancel'));
        $('#user_account_privacy_accept_submit').addClass('disabled');
    });

    // Inicializar la configuración de los mensajes Toastr
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
});
