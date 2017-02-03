var Signup = function() {
	"use strict";
	jQuery.validator.addMethod("phoneValidate", function(number, element) {
    	number = number.replace(/\s+/g, "");
    	return this.optional(element) || number.length > 9 &&
        	number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
		}, "Please specify a valid phone number"
	);
	jQuery.validator.addMethod('phonei18n', function(value) {
		return (value.match(/^(\+([0-9]|([-\s\.])?){9,20})$/));
		}, 'Please provide a valid phone number +44 7733 123 456'
	);
	jQuery.validator.addMethod('phonei18nformat', function(value) {
		return (value.match(/^((\+)?[1-9]{1,2})?([-\s\.])?((\(\d{1,4}\))|\d{1,4})(([-\s\.])?[0-9]{1,12}){1,2}(\s*(ext|x)\s*\.?:?\s*([0-9]+))?$/));
		}, 'Please enter a valid phone number'
	);
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
	var runRegisterValidator = function() {
		var form = $('.form-register');
		var errorHandler = $('.errorHandler', form);
		form.validate({
			rules : {
				contact_name : {
					minlength : 2,
					required : true
				},
				location : {
					minlength : 2,
					required : true
				},
				financial_name : {
					minlength : 2,
					required : false
				},
				rfc : {
					minlength : 8,
					required : false,
				},
				client_type : {
					required : true,
				},
				website : {
					minlength : 2,
					required : false
				},
				country : {
					required : true
				},
				phone_number : {
					required : false,
					phonei18n: true,
					minlength: 9,
				},
				username : {
					required : true
				},
				email : {
					email: true,
					required : true
				},
				password : {
					minlength : 6,
					required : true
				},
				password_confirm : {
					required : true,
					minlength : 6,
					equalTo : "#id_password"
				},
				privacy_accept : {
					minlength : 1,
					required : true
				}
			},
			submitHandler : function(form) {
				errorHandler.hide();
				form.submit();
			},
			invalidHandler : function(event, validator) { //display error alert on form submit
				errorHandler.show();
			}
		});
	};
	return {
		//main function to initiate template pages
		init : function() {
			validateCheckRadio();
			runSetDefaultValidation();
			runRegisterValidator();
		}
	};
}();
