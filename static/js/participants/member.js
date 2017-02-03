// FUNCIONES DE LISTAS DE PARTICIPANTES

var bulk_load_callbacks = $.Callbacks();

/** 
 * Funcion para cargar las listas de participantes:
    - Se limpia el contenedor 'members_list'
    - Se crea la llamada ajax para obtener las listas de participantes y se insertan en el contenedor 'members_list'
    - Selecciona la lista que recibe en id_member
 */
function member_load(id_member, email_participant){
    $("#members_list").empty();
    $.ajax({
        url : "/api/members/",
        type : "GET",
        success : function(json) {
            var content = $('#config-menu').html();
            var count = 0;
            for (var i = 0; i < json.length; i++) {
                $("#members_list").append("<li id='"+json[i].id+"' class='messages-item' >"+content+"<div class='inline space' onclick='participant_load("+json[i].id+")'><a class='messages-item-from'>"+json[i].name+"&nbsp;("+json[i].email_count+")"+"</a></div></li>");
                $('#member_menuitem_delete').attr('id', 'member_menuitem_delete_'+json[i].id);
                $('#member_menuitem_delete_'+json[i].id).attr('onclick', 'member_modal_delete_config("'+ json[i].name +'",'+json[i].id+')');
                $('#member_menuitem_rename').attr('id', 'member_menuitem_rename_'+json[i].id);
                $('#member_menuitem_rename_'+json[i].id).attr('onclick', 'member_modal_rename_config("'+ json[i].name +'",'+json[i].id+')');
                $('#member_menuitem_duplicate').attr('id', 'member_menuitem_duplicate_'+json[i].id);
                $('#member_menuitem_duplicate_'+json[i].id).attr('onclick', 'member_modal_duplicate_config("'+ json[i].name +'",'+json[i].id+')');
                $('#member_menuitem_bulk_load').attr('id', 'member_menuitem_bulk_load-'+json[i].id);
                $('#member_menuitem_bulk_load-'+json[i].id).attr('onclick', 'member_modal_bulk_load_config('+json[i].id+')');

                // Deshabilitar las operaciones Delete y Rename para la lista General
                if(json[i].name == gettext('member-general-name')){
                    $('#member_menuitem_delete_'+json[i].id).hide();
                    $('#member_menuitem_rename_'+json[i].id).hide();
                }
                count  += json[i].email_count;

            }

            if (count==0){
                $('#member_button_all').attr('disabled','disabled');
            }
            else {
                $('#member_button_all').removeAttr('disabled');
            }

            if (id_member==0){
                participant_load(json[0].id, email_participant);
            }
            else{
                $.when(participant_load(id_member, email_participant)).done(bulk_load_callbacks.fire());
            }
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** 
 * Esta funcion carga las listas de participantes disponibles para copiar/mover los participantes:
    - Se limpian los contenedores 'list_members_to_copy' y 'list_members_to_move'
    - Se crea la llamada ajax para obtener las listas de participantes y se insertan en sus respectivos contenedores
 */
function member_load_elements(id_member){
    $(".list_members_to_copy").empty();
    $("#list_members_to_move").empty();
    $.ajax({
        url : "/api/members/",
        type : "GET",
        success : function(json) {
            for (var i = 0; i < json.length; i++) {
                // Members para Modal Copiar
                if(json[i].id != id_member){
                    $(".list_members_to_copy").append("<li><label><input type='checkbox' id='m"+json[i].id+"' class='checkbox_member' value='"+json[i].id+"'>"+json[i].name+"</label></li>");
                    $("#list_members_to_move").append("<option id='m"+json[i].id+"' value='"+json[i].id+"'>"+json[i].name+"</option>");
                }
            }
            $(".list_members_to_copy").find("input[class='checkbox_member']").iCheck({
               tap: true,
               checkboxClass: 'icheckbox_minimal-grey',
           });
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    })
}

/** 
 * Esta función crea una lista de participantes:
    - Se recibe el nombre de la lista de participantes
    - Se crea la llamada ajax para dar de alta una lista de participantes
    - Se actualizan las listas de participantes
 */
function member_add() {
    var form = $('#member_add_form');
    var field = $('#member_add_name', form);
    var errorHandler = $('.errorHandler', form);
    var messageHandler = $('.messageHandler', form);
    member_name = field.val();
    messageHandler.html("<ul class='fa-ul'><li><i class='fa fa-spinner fa-li fa-spin'></i>&nbsp;" + gettext('member-add-loading') + "</li></ul>");
    $.ajax({
        url : "/api/members/",
        type : "POST",
        data : {"name" : member_name},
        success : function(json) {
            messageHandler.html("<ul class='fa-ul'><li><i class='fa fa-info-cicle fa-li fa-lg'></i>" + gettext('member-add-complete') + "</li></ul>");
            member_load(0);
        },
        error : function(xhr,errmsg,err) {
            messageHandler.hide();
            errorHandler.show();
            var jsonResponse = JSON.parse(xhr.responseText);
            errorHandler.html("<i class='fa fa-exclamation-circle fa-lg'></i> " + gettext(jsonResponse.name));
            console.log(xhr.status + ": " + xhr.responseText);
            field.select();
        }
    });
}

/**
 * Esta función cancela la creacion de una lista de participantes:
    - Oculta el formulario
    - Limpia los valores
 */
function member_add_cancel(){
    var form = $('#member_add_form');
    var errorHandler = $('.errorHandler', form);
    var messageHandler = $('.messageHandler', form);
    $("#button_add_member").removeClass();
    $("#button_add_member").toggleClass("btn btn-primary");
    $("#button_add_member").attr("onclick", "member_add_show()");
    $("#member_add_tool").hide('slow');
    $("#member_add_name").val("");
    errorHandler.hide();
    messageHandler.hide();
    form.find('.help-block').remove();
    form.find('.form-group').removeClass("has-error");
}

/**
 * Esta función muestra el formulario para la creacion de una lista de participantes:
    - Despliega el formulario
    - Limpia los valores
    - Pone el foco en el input
 */
function member_add_show(){
    var form = $('#member_add_form');
    var field = $('#member_add_name', form);
    var messageHandler = $('.messageHandler', form);
    $("#button_add_member").removeClass();
    $("#button_add_member").toggleClass("btn btn-light-grey");
    $("#button_add_member").removeAttr("onclick", null);
    $("#member_add_tool").show("slow");
    field.empty();
    messageHandler.html("<ul class='fa-ul'><li><i class='fa fa-info-circle fa-li fa-lg'></i>" + gettext("member-add-instructions") + "</li></ul>");
    messageHandler.show();
    field.focus();
}

/**
 * Esta función realiza la carga masiva de participantes:
    - Obtiene los valores seleccionados
    - Crea un objeto 'formdata' y añade los valores
    - Crea la llamada ajax para realizar la carga masiva desde texto o archivo
 */
function member_modal_bulk_load(){
    var form = $('#member_modal_bulk_load_form');
    var id_member = $("#member_modal_bulk_load_select", form).val();
    var radio = $('input[name=optionsRadios]:checked', form).val();
    var textarea = $('#member_modal_bulk_load_textarea', form).val();
    var checkbox = $('#member_modal_bulk_load_overwrite', form).is(':checked');
    var file = $('input[type=file]', form).get(0).files[0];
    var messageHandler = $('.member_modal_bulk_load_form_message', form);

    var data = new FormData();

    data.append("option", radio);
    data.append("overwrite", checkbox);

    if (radio == 'text') {
        data.append("participants_text", textarea);
    } else {
        data.append("participants_file", file);
    }

    $.ajax({
        url : "/api/members/" + id_member + "/participants/",
        type: 'PUT',
        data: data,
        dataType: 'json',
        enctype: 'multipart/form-data',
        cache: false,
        multiple: false,
        processData: false,
        contentType: false,
        success : function(json) {
            // Cerrar modal
            $('#member_modal_bulk_load_cancel').click();

            // Utilizando callbacks para ejecutar la carga de forma asyncrona
            var bulk_load_add_resume = function() {
                var content = json.resume;
                var download_resume = "<a href='/participants/member-bulk-load-resume'>"+gettext("member-bulk-load-resume-download")+"</a>";
                $("#member_bulk_load_resume").html("<pre>" + content + "</pre>" + download_resume);
                bulk_load_callbacks.empty();
            };
            bulk_load_callbacks.add(bulk_load_add_resume);

            member_load(id_member);
        },
        error : function(xhr,errmsg,err) {
            var jsonResponse = JSON.parse(xhr.responseText);
            messageHandler.html("<div class='col-sm-7 text-danger' style='text-align:left'>" +
                "<i class='fa fa-exclamation-circle fa-lg'></i> "+ gettext(jsonResponse.name) + "</div>");
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/**
 * Esta función cancela la carga masiva:
    - Cierra el modal
    - Oculta los mensajes de error/ayuda
 */
function member_modal_bulk_load_cancel(){
    var form = $('#member_modal_bulk_load_form');
    var errorHandler = $('.member_modal_bulk_load_form_error', form);
    var messageHandler = $('.member_modal_bulk_load_form_message', form);
    messageHandler.hide();
    errorHandler.hide();
    form.find('.help-block').remove();
    form.find('.form-group').removeClass("has-error");
}

/**
 * Esta función muestra el modal de carga masiva:
    - Limpia los valores
    - Resetea los checkbox
    - Llena el elemento select con las listas de participantes
 */
function member_modal_bulk_load_config(id_member){
    //Limpiar modal
    $('#member_modal_bulk_load_radio').iCheck('check');
    $('#member_modal_bulk_load_text').hide();
    $('#member_modal_bulk_load_file').show();
    $('.fileinput-remove-button').click();
    $('#member_modal_bulk_load_textarea').val('');
    $('#member_modal_bulk_load_overwrite').iCheck('uncheck');
    $('#member_modal_bulk_load_form_message').empty();

    //Llenar elemento select
    member_modal_bulk_load_select(id_member);

    // Oculta/muestra la carga por texto y por archivo respectivamente
    $('#member_modal_bulk_load_form input[name=optionsRadios]').on('ifClicked', function(event){
        if ($(this).val()=='file'){
            $('#member_modal_bulk_load_text').hide();
            $('#member_modal_bulk_load_file').show();
        } else {
            $('#member_modal_bulk_load_file').hide();
            $('#member_modal_bulk_load_text').show();
        }
    });

    // Muestra otro modal para crear una nueva lista cuando elige dicha opcion en el elemento select
    $('#member_modal_bulk_load_select').off('change').on('change', function() {
        var id_member = $("#member_modal_bulk_load_select").val();
        if (id_member == 0) {
            $('#member_modal_new').modal('show');
            $("#member_modal_new_name").val('');
        } else {
            member_modal_bulk_load_toggle_checkbox(id_member);
        }
    });
};

/**
 * Esta función llena el elemneto Select del modal de carga masiva:
    - Limpia los valores anteriores en el Select
    - Crea la llamada ajax para obtener las listas de participantes
    - Inserta cada una de las listas como opción
    - Pone el foco en la lista por defecto
    - Si la lista seleccionada esta vacia, oculta el checkbox sobreescribir
 */
function member_modal_bulk_load_select(id_member){
    $("#member_modal_bulk_load_select").empty();
    $.ajax({
        url : "/api/members/",
        type : "GET",
        success : function(json) {
            for (var i = 0; i < json.length; i++) {
                $('#member_modal_bulk_load_select').append("<option value='"+json[i].id+"'>"+json[i].name+"</option>");
                member_map[json[i].id] = json[i].email_count;
            }
            $('#member_modal_bulk_load_select').append("<option value=0>" + gettext('member-modal-bulk-load-select-add-new') + "</option>");
            $("#member_modal_bulk_load_select").val(id_member);

            member_modal_bulk_load_toggle_checkbox(id_member);
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
};

// Variable para el mapeo de Key->Value de las listas de participantes
// Que nos sirve para ocultar el elemento sobreescribir si no hay participantes
var member_map = {};

/**
* Esta función oculta/muestra el checkbox sobreescribir
*/
function member_modal_bulk_load_toggle_checkbox(id_member){
    $('#member_modal_bulk_load_overwrite').iCheck('uncheck');
    if (member_map[id_member] == 0) {
        $('#member_modal_bulk_load_checkbox').hide('slow');
    } else {
        $('#member_modal_bulk_load_checkbox').show('slow');
    }
}

/**
 * Esta función borra una lista de participantes:
    - Recibe el "id_member" de la lista a borrar
    - Crea la llamada ajax para borrar la lista de participantes
    - Actualiza las listas de participantes
 */
function member_modal_delete(id_member){
    $.ajax({
        url : "/api/members/"+id_member,
        type : "DELETE",
        success : function(json) {
            $('#member_modal_delete_close').click();
            member_load(0);
            toastr.info(gettext('member-modal-delete-confirm'));
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
};


/**
 * Esta función muestra el modal de borrar lista de participantes:
    - Recibe el nombre y el id de la lista a borrar
    - Agrega la accion de borrar al botón
 */
function member_modal_delete_config(name, id_member){
    $('#member_modal_delete_submit').attr('onclick', 'member_modal_delete('+id_member+')');
    $('#member_modal_delete_label').html(name);
};

/**
 * Esta función duplica una lista de participantes:
    - Recibe el "id_member" de la lista a duplicar
    - Obtiene el nombre de la nueva lista
    - Crea la llamada ajax para duplicar la lista
    - Actualiza las listas de participantes
 */
function member_modal_duplicate(id_member){
    var form = $('#member_modal_duplicate_form');
    var field = $('#member_modal_duplicate_name', form);
    var messageHandler = $('.member_modal_duplicate_form_message', form);
    var closeButton = $('#member_modal_duplicate_cancel', form);
    var member_name = field.val();
    $.ajax({
        url : "/api/members/"+id_member,
        type : "POST",
        data : {"name" : member_name},
        success : function(json) {
            closeButton.click();
            member_load(json.id);
        },
        error : function(xhr,errmsg,err) {
            var jsonResponse = JSON.parse(xhr.responseText);
            messageHandler.html("<div class='col-sm-7 text-danger' style='text-align:left'>" +
                "<i class='fa fa-exclamation-circle fa-lg'></i> "+ gettext(jsonResponse.name) + "</div>");
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
};

/**
 * Esta función cancela la acción de duplicar lista de participantes:
    - Cierra y limpia el modal
    - Oculta los mensajes de error
 */
function member_modal_duplicate_cancel(){
    var form = $('#member_modal_duplicate_form');
    var errorHandler = $('.member_modal_duplicate_form_error', form);
    var messageHandler = $('.member_modal_duplicate_form_message', form);
    messageHandler.hide();
    errorHandler.hide();
    form.find('.help-block').remove();
    form.find('.form-group').removeClass("has-error");
}

/**
 * Esta función muestra el modal de duplicar lista de participantes:
    - Limpia los valores
    - Inserta el nombre de la lista a duplicar con el prefijo "copy_of"
 */
function member_modal_duplicate_config(name, id_member){
    $('#member_modal_duplicate_form_message').empty();
    $('#member_modal_duplicate_name').val(gettext('member-modal-duplicate-name-copy') + name);
    $('#member_modal_duplicate_submit').attr('value', id_member);

    $('#member_modal_duplicate').on('shown.bs.modal', function () {
        $('#member_modal_duplicate_name').select();
    });
};

/**
 * Esta función cancela la creacion de una lista de participantes desde la carga masiva:
    - Limpia los valores
    - Cierra el modal
 */
function member_modal_bulk_load_add_cancel(){
    var form = $('#member_modal_new_form');
    var errorHandler = $('.member_modal_new_form_error', form);
    var messageHandler = $('.member_modal_new_form_message', form);
    messageHandler.hide();
    errorHandler.hide();
    form.find('.help-block').remove();
    form.find('.form-group').removeClass("has-error");
}

/**
* Esta función crea la nueva lista desde el modal de carga masiva:
   - Obtiene el valor del nombre
   - Crea la llamada ajax para la creacion de la lista
   - Cierra el modal y selecciona la lista que se acaba de crear
*/
function member_modal_bulk_load_add(){
    var form = $('#member_modal_new_form');
    var field = $('#member_modal_new_name', form);
    var messageHandler = $('.member_modal_new_form_message', form);
    var closeButton = $('#member_modal_new_cancel', form);
    var member_name = field.val();
    $.ajax({
        url : "/api/members/",
        type : "POST",
        data : {"name" : member_name},
        success : function(json) {
            closeButton.click();
            member_modal_bulk_load_select(json.id);
        },
        error : function(xhr,errmsg,err) {
            var jsonResponse = JSON.parse(xhr.responseText);
            messageHandler.html("<div class='col-sm-7 text-danger' style='text-align:left'>" +
                "<i class='fa fa-exclamation-circle fa-lg'></i> " + gettext(jsonResponse.name) + "</div>");
            field.select();
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/**
 * Esta función renombra una lista de participantes:
    - Recibe el id de la lista a renombrar
    - Obtiene el nuevo nombre de la lista de participantes
    - Crea la llamada ajax y le manda el nombre de la lista
    - Actualiza las listas de participantes y pone el foco en la que se renombró
 */
function member_modal_rename(id_member){
    var form = $('#member_modal_rename_form');
    var field = $('#member_modal_rename_name', form);
    var errorHandler = $('.member_modal_rename_form_error', form);
    var messageHandler = $('.member_modal_rename_form_message', form);
    var closeButton = $('#member_modal_rename_cancel', form);
    var member_name = field.val();
    $.ajax({
        url : "/api/members/"+id_member,
        type : "PUT",
        data : {"name" : member_name},
        success : function(json) {
            closeButton.click();
            member_load(id_member);
        },
        error : function(xhr,errmsg,err) {
            messageHandler.hide();
            errorHandler.show();
            var jsonResponse = JSON.parse(xhr.responseText);
            errorHandler.html("<div class='col-sm-7 text-danger' style='text-align:left'>" +
                "<i class='fa fa-exclamation-circle fa-lg'></i> " + gettext(jsonResponse.name) + "</div>");
            field.select();
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
};

/**
* Esta función cancela la acción de renombrar lista de participantes:
   - Oculta los mensajes de error
   - Cierra el modal
*/
function member_modal_rename_cancel(){
    var form = $('#member_modal_rename_form');
    var errorHandler = $('.member_modal_rename_form_error', form);
    var messageHandler = $('.member_modal_rename_form_message', form);
    messageHandler.hide();
    errorHandler.hide();
    form.find('.help-block').remove();
    form.find('.form-group').removeClass("has-error");
}

/**
 * Esta función muestra el modal de renombrar lista de participantes:
    - Recibe el nombre y el id de la lista a renombrar
    - Limpia los valores
    - Inserta el nombre de la lista y pone el foco en el input
 */
function member_modal_rename_config(name, id_member){
    $('.member_modal_rename_form_message').empty();
    $('#member_modal_rename_name').val(name);
    $("#member_modal_rename_submit").attr('value', id_member);

    $('#member_modal_rename').on('shown.bs.modal', function () {
        $('#member_modal_rename_name').select();
    });
};
