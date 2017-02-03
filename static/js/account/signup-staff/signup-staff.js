var signup_form_check_country = function() {
	// El país es igual a México
	if($("#id_country").val() == 'MX') {
	   $('#user_account_signup_staff_fiscal_data').show('slow');
	   $('#financial_name').attr('disabled');
	   $('#id_rfc').removeAttr('disabled');
	   $('.client_type').removeClass('disabled');
	} else {
	   $('#user_account_signup_staff_fiscal_data').hide('slow');
	   $('#financial_name').attr('disabled', 'disabled');
	   $('#id_rfc').attr('disabled', 'disabled');
	   $('.client_type').addClass('disabled');
	}
};

var signup_form_check_password_load = function() {
	// Cuando label tiene la propiedad checked debe de ocultar los campos de contraseña
	if ($('#id_has_password_1').prop('checked')){
        $('#signup_form_set_password').hide('slow');
        var random = Math.random().toString(36).replace(/[^a-z]+/g, '');
	   	$('#id_password').val(random);
	   	$('#id_password_confirm').val(random);
   } else {
	   $('#signup_form_set_password').show('slow');
   }
};
