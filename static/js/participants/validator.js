var Validator = function() {
	"use strict";
	var validateCheckRadio = function (val) {
        $("input[type='radio'], input[type='checkbox']").on('ifChecked', function(event) {
			$(this).parent().closest(".has-error").removeClass("has-error").addClass("has-success").find(".help-block").hide().end().find('.symbol').addClass('ok');
		});
    };
	//function to return the querystring parameter with a given name.
	var getParameterByName = function(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	var runSetDefaultValidation = function() {
		$.validator.setDefaults({
			errorElement : "span", // contain the error msg in a small tag
			errorClass : 'help-block',
			errorPlacement : function(error, element) {// render error placement for each input type
				if (element.attr("type") == "radio" || element.attr("type") == "checkbox") {// for chosen elements, need to insert the error after the chosen container
					error.insertAfter($(element).closest('.form-group').children('div').children().last());
				} else if (element.attr("name") == "card_expiry_mm" || element.attr("name") == "card_expiry_yyyy") {
					error.appendTo($(element).closest('.form-group').children('div'));
				} else {
					error.insertAfter(element);
					// for other inputs, just perform default behavior
				}
			},
			ignore : ':hidden',
			success : function(label, element) {
				label.addClass('help-block valid');
				// mark the current input as valid and display OK icon
				$(element).closest('.form-group').removeClass('has-error');
			},
			highlight : function(element) {
				$(element).closest('.help-block').removeClass('valid');
				// display OK icon
				$(element).closest('.form-group').addClass('has-error');
				// add the Bootstrap error class to the control group
			},
			unhighlight : function(element) {// revert the change done by hightlight
				$(element).closest('.form-group').removeClass('has-error');
				// set error class to the control group
			}
		});
	};
	var runSubmitValidatorDuplicate = function() {
		var form = $('#member_modal_duplicate_form');
		var field = $('#member_modal_duplicate_name', form);
		var errorHandler = $('.member_modal_duplicate_form_error', form);
		var messageHandler = $('.member_modal_duplicate_form_message', form);
		var submitButton = $('#member_modal_duplicate_submit', form);
		form.validate({
			rules : {
				member_modal_duplicate_name : {
					minlength : 2,
					required : true
				},
			},
			submitHandler : function(form) {
				errorHandler.hide();
				messageHandler.show()
				// Invocar a la operación de renombrar lista de participantes
				member_modal_duplicate(submitButton.val());
			},
			invalidHandler : function(event, validator) { //display error alert on form submit
				errorHandler.show();
			}
		});
	};
	var runSubmitValidatorRename = function() {
		var form = $('#member_modal_rename_form');
		var field = $('#member_modal_rename_name', form);
		var errorHandler = $('.member_modal_rename_form_error', form);
		var messageHandler = $('.member_modal_rename_form_message', form);
		var submitButton = $('#member_modal_rename_submit', form);
		form.validate({
			rules : {
				member_modal_rename_name : {
					minlength : 2,
					required : true
				},
			},
			submitHandler : function(form) {
				errorHandler.hide();
				messageHandler.show()
				// Invocar a la operación de renombrar lista de participantes
				member_modal_rename(submitButton.val());
			},
			invalidHandler : function(event, validator) { //display error alert on form submit
				errorHandler.show();
				messageHandler.empty();
				field.select();
			}
		});
	};
	var runSubmitValidatorAddEmail = function() {
		var form = $('#add_email_form');
		var errorHandler = $('.errorHandler', form);
		var messageHandler = $('.messageHandler', form);
		var submitButton = $('#add_participant', form);
		form.validate({
			rules : {
				add_email_participant : {
					email: true,
					required : true
				},
			},
			submitHandler : function(form) {
				errorHandler.hide();
				messageHandler.show()
				// Invocar a la operación de agregar participante
				participant_add(submitButton.val());
			},
			invalidHandler : function(event, validator) { //display error alert on form submit
				messageHandler.hide()
				errorHandler.show();
			}
		});
	};
	var runSubmitValidatorNewMember = function() {
		var form = $('#member_modal_new_form');
		var field = $('#member_modal_new_name', form);
		var errorHandler = $('.member_modal_new_form_error', form);
		var messageHandler = $('.member_modal_new_form_message', form);
		var submitButton = $('#member_modal_new_submit', form);
		form.validate({
			rules : {
				member_modal_new_name : {
					minlength : 2,
					required : true
				},
			},
			submitHandler : function(form) {
				errorHandler.hide();
				messageHandler.show()
				// Invocar a la operación de crear lista de participantes
				member_modal_bulk_load_add()
			},
			invalidHandler : function(event, validator) { //display error alert on form submit
				errorHandler.show();
				messageHandler.empty();
				field.select();
			}
		});
	};
	var runSubmitValidatorBulkLoadFile = function() {
		var form = $('#member_modal_bulk_load_form');
		var field = $('#member_modal_bulk_load_input_file', form);
		var errorHandler = $('.member_modal_bulk_load_form_error', form);
		var messageHandler = $('.member_modal_bulk_load_form_message', form);
		var submitButton = $('#member_modal_bulk_load_submit', form);
		form.validate({
			rules: {
	            member_modal_bulk_load_input_file: {
	                required: true,
	                extension: "txt|csv|ods|xls|xlsx"
	            },
	            member_modal_bulk_load_textarea: {
	            	minlength : 8,
	            	required: true,
	            },
	        },
	        messages: {
	            member_modal_bulk_load_input_file: {
	                required: "member-modal-bulk-load-input-file-required",
	                extension: "member-modal-bulk-load-input-file-extension"
	            }
	        },
			submitHandler : function(form) {
				errorHandler.hide();
				messageHandler.show();
				// Invocar a la operación de carga masiva
				member_modal_bulk_load();
			},
			invalidHandler : function(event, validator) { //display error alert on form submit
				errorHandler.show();
				messageHandler.empty();
			}
		});
	};
	var runSubmitValidatorAddMember = function() {
		var form = $('#member_add_form');
		var field = $('#member_add_name', form);
		var errorHandler = $('.errorHandler', form);
		var messageHandler = $('.messageHandler', form);
		form.validate({
			rules : {
				member_add_name : {
					minlength : 2,
					required : true
				},
			},
			submitHandler : function(form) {
				errorHandler.hide();
				messageHandler.show()
				// Invocar a la operación de agregar lista de participante
				member_add();
			},
			invalidHandler : function(event, validator) { //display error alert on form submit
				messageHandler.hide()
				errorHandler.show();
				field.focus();
			}
		});
	};
	return {
		//main function to initiate template pages
		init : function() {
			validateCheckRadio();
			runSetDefaultValidation();
			runSubmitValidatorDuplicate();
			runSubmitValidatorRename();
			runSubmitValidatorAddEmail();
			runSubmitValidatorNewMember();
			runSubmitValidatorBulkLoadFile();
			runSubmitValidatorAddMember();
		}
	};
}();
