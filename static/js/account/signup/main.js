$(document).ready(function() {
    Signup.init();
    $('#id_contact_name').focus();

    if (privacy_accept_validation() == false) {
        $('#user_account_signup_submit').addClass('disabled');
    }

    /**
     * Acciones si se acepta el aviso de privacidad

       - Habilitar el botón de envío
       - Notificar que se acepto el aviso de privacidad
    */
    $('#id_privacy_accept').on('ifChecked', function(event){
        toastr.info(gettext('user-account-signup-privacy-accept'));
        $('#user_account_signup_submit').removeClass('disabled');
    });

    /**
     * Acciones si se rechaza el aviso de privacidad

       - Deshabilitar el botón de envío
       - Notificar que se rechazó el aviso de privacidad
    */
    $('#id_privacy_accept').on('ifUnchecked', function(event){
        toastr.warning(gettext('user-account-signup-privacy-cancel'));
        $('#user_account_signup_submit').addClass('disabled');
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

    /**
    * Deshabilitar el envío del formulario
    * si permite realizar validación del formulario
    */
    $(window).keydown(function(event){
        if( (event.keyCode == 13) && (privacy_accept_validation() == false) ) {
            event.preventDefault();
            return false;
        }
    });
});
