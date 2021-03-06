/**
 * Requiere cargar signup-staff.js
 */
$(document).ready(function(){
	Signup.init();

	$('#id_contact_name').focus();

	$("label[for='id_client_type_0']").addClass('radio-inline');
	$('#id_client_type_0').addClass('grey');
	$("label[for='id_client_type_1']").addClass('radio-inline');
	$('#id_client_type_1').addClass('grey');

	$("label[for='id_has_password_0']").addClass('radio-inline');
	$('#id_has_password_0').addClass('grey');
	$("label[for='id_has_password_1']").addClass('radio-inline');
	$('#id_has_password_1').addClass('grey');

	signup_form_check_country();

	$('#id_country').change(function(){
		signup_form_check_country();
	});

	signup_form_check_password_load();

	$('label[for="id_has_password_0"]').on('ifClicked', function(event){
		$('#signup_form_set_password').show('slow');
		$('#id_password').val("");
		$('#id_password_confirm').val("");
	});
	$('label[for="id_has_password_1"]').on('ifClicked', function(event){
		$('#signup_form_set_password').hide();
	   	var random = Math.random().toString(36).replace(/[^a-z]+/g, '');
	   	$('#id_password').val(random);
	   	$('#id_password_confirm').val(random);
	});
});
