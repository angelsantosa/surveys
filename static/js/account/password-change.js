var PasswordChange = function () {
	"use strict";
	var runPasswordChangeValidator = function () {
        var form = $('#account_change_password_form');
        var errorHandler = $('.errorHandler', form);
        $('#account_change_password_form').validate({
            rules: {
                password_new: {
                    minlength: 6,
                    required: true
                },
                password_new_confirm: {
                    required: true,
                    minlength: 5,
                    equalTo: "#id_password_new"
                },
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                errorHandler.show();
            },
            submitHandler: function (form) {
                errorHandler.hide();
                // submit form
                form.submit();
            }
        });
    };
    return {
        //main function to initiate template pages
        init: function () {
            runPasswordChangeValidator();
        }
    };
}();
