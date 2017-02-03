// FUNCIONES DE PARTICIPANTES

/** 
 * Funcion para cargar el listado de participantes del boton TODOS:
    - Se limpian los checkboxes seleccionados previamente.
    - Se ocultan las funcionalidades de agregar, carga masiva, mover y eliminar participante.
    - Se crea la llamada ajax para obtener el listado de participantes y se insertan en la lista .messages-list.
 */
function participant_get_all(){
    $("#member_bulk_load_resume").html("");
    $("#members_list > .messages-item").removeClass("active starred");
    $("#members_list > .messages-item[id=0]").toggleClass("active starred");
    $("#select_all").prop('checked', false);
    $("#add_member_participant").hide();
    $("#bulk_load_button").hide();
    $.ajax({
        url : "/api/participants/",
        type : "GET",
        success : function(json) {
            var menu_participant = $('#participant_menu').html();
            $(".message-content").empty();
            $(".message-header #config-menu-participant").html(menu_participant);
            $(".message-content").append("<div class='panel-body messages' id='0'><div class='messages-list'></div></div>");
            for (var i = 0; i < json.length; i++) {
                $('.panel-body[id=0] > .messages-list').append("<li class='messages-item-from'><input type='checkbox' id='p"+json[i].id+"' class='checkbox_participant' value='0'></input>&nbsp;<label for='p"+json[i].id+"' style='cursor:pointer;'>"+json[i].email+"</label>&nbsp;<a role='menuitem' tabindex='-1' href='#participant_modal_detail' data-toggle='modal' onclick='participant_modal_detail("+json[i].id+")'><i class='fa fa-eye'></i></a></li>");
            }
            // Invocar el handler para que los checkbox actualicen el checkbox ALL
            checkboxHandler();

            // Actualizacion de contador de checkboxes seleccionados
            $("#participant_count_selected").html("&nbsp;(0)");
            $(".messages-list > li > .cbx-container").click(function() {
                var count_selected = 0;
                $(".checkbox_participant[value=1]").each(function(index, participant){
                    count_selected += 1;
                });
                $("#participant_count_selected").html("&nbsp;("+count_selected+")");
            });

            // Ocultar elementos de menu Eliminar y Mover
            $("#participant_menuitem_delete").hide();
            $("#participant_menuitem_move").hide();
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** 
 * Funcion para cargar el listado de participantes al seleccionar una lista especifica:
    - Se activa la clase "active starred" del elemento seleccionado para sombrearlo.
    - Se limpian los checkboxes seleccionados previamente.
    - Se muestran las funcionalidades de agregar, carga masiva de participante.
    - Se crea la llamada ajax donde se recibe el parametro id_member para obtener el listado de participantes de esa lista especifica.
    - El parametro email_participant se utiliza cuando se agrega un nuevo participante, al recibir ese parametro se identifica ese email y se agrega al principio del listado de participantes con un color diferente.
 */
function participant_load(id_member, email_participant){
    var menu_participant = $('#participant_menu').html();
    $(".message-content").empty();
    $(".message-header #config-menu-participant").html(menu_participant);
    $(".message-content").append("<div class='panel-body messages' id='"+id_member+"'><div class='messages-list'></div></div>");
    $("#members_list > .messages-item").removeClass("active starred");
    $("#members_list > .messages-item[id="+id_member+"]").toggleClass("active starred");
    $("#select_all").prop('checked', false);
    $("#add_member_participant").show();
    $('#bulk_load_button').attr('onclick', 'member_modal_bulk_load_config('+id_member+')');
    $("#bulk_load_button").show();
    $("#add_participant").attr('value', id_member);
    $("#delete_participants_selected").attr('onclick','participant_selected_delete('+id_member+')');
    $("#participant_menuitem_copy").attr("onclick", "participant_selected_validate_copy("+id_member+")");
    $("#participant_menuitem_move").attr("onclick", "participant_selected_validate_move("+id_member+")");
    $("#participant_modal_move_submit").attr("onclick", "participant_selected_move("+id_member+")");
    $("#participant_modal_copy_submit").attr("onclick", "participant_selected_copy("+id_member+")");
    $.ajax({
        url : "/api/members/"+id_member+"/participants/",
        type : "GET",
        success : function(json) {
            for (var i = 0; i < json.length; i++) {
                if(json[i].email == email_participant){
                    $('.panel-body[id='+id_member+'] > .messages-list').prepend("<li class='messages-item-from'><input type='checkbox' id='p"+json[i].id+"' class='checkbox_participant' value='0'></input>&nbsp;<label for='p"+json[i].id+"' style='cursor:pointer; color:green;'>"+json[i].email+"</label>&nbsp;<a role='menuitem' tabindex='-1' href='#participant_modal_detail' data-toggle='modal' onclick='participant_modal_detail("+json[i].id+")'><i class='fa fa-eye'></i></a></li>");
                }else{
                    $('.panel-body[id='+id_member+'] > .messages-list').append("<li class='messages-item-from'><input type='checkbox' id='p"+json[i].id+"' class='checkbox_participant' value='0'></input>&nbsp;<label for='p"+json[i].id+"' style='cursor:pointer;'>"+json[i].email+"</label>&nbsp;<a role='menuitem' tabindex='-1' href='#participant_modal_detail' data-toggle='modal' onclick='participant_modal_detail("+json[i].id+")'><i class='fa fa-eye'></i></a></li>");
                }
            }

            //Mostrar mensaje de que no existen participantes en la Lista
            if(json.length == 0){
                participant_show_empty_message();
            }

            // Invocar el handler para que los checkbox actualicen el checkbox ALL
            checkboxHandler();

            //Actualizacion de contador de checkboxes seleccionados
            $("#participant_count_selected").html("&nbsp;(0)");
            $(".messages-list > li > .cbx-container").click(function() {
                var count_selected = 0;
                $(".checkbox_participant[value=1]").each(function(index, participant){
                    count_selected += 1;
                });
                $("#participant_count_selected").html("&nbsp;("+count_selected+")");
            });

            //limpiar input de filtrado de emails
            $('#search_participant').val("");
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
};

/** 
 * Funcion que se llama al invocar el detalle de participante, donde se muestran toda la informacion del participante:
    - Se crea la llamada ajax donde se recibe el parametro id_participant para obtener la informacion del participante.
    - Se agrega el atributo mailto: para ese participante.
    - Se agrega el email seleccionado y se le asigna la clase .editable (x-editable) para la edicion del correo electronico.
    - Se llama la funcion participant_get_member_list(id_participant) para obtener las listas de participantes a las que pertenece el participante seleccionado.
 */
function participant_modal_detail(id_participant){
    $.ajax({
        url : "/api/participants/"+id_participant,
        type : "GET",
        success : function(json) {
            $('#participant_modal_detail_mailto').attr('href', 'mailto:'+json.email)
            $('#participant_modal_detail_confirm_delete').attr('onclick', 'participant_detail_delete('+id_participant+')')
            $('#participant_modal_detail_field_email').html(json.email);           
            
            $("#participant_modal_detail_field_email").on('hidden', function(e, reason) {
                $('#participant_modal_detail_edit').show();
            });

            $("#participant_modal_detail_field_email").on('shown', function(e, reason) {
                $('#participant_modal_detail_edit').hide();
            });

            $("#participant_modal_detail_field_email").editable({
                url: "/api/participants/"+id_participant,
                ajaxOptions: {dataType:"json", type:"PUT"},
                params: function(params){var data = {}; data["email"]=params.value; return data;},
                send: "always",
                name: "participant_modal_detail_field_email",
                type: "text",
                tpl: "<input type='text' style='width:250px;'>",
                validate: function(value) {
                    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if($.trim(value) == ""){
                        return gettext("participant-modal-detail-edit-required");
                    }
                    if(regex.test($.trim(value)) == false) return gettext("participant-modal-detail-edit-valid");
                },
                success: function(response, email){
                    var form = $('#participant_modal_detail_form');
                    var messageHandler = $('.messageHandler', form);
                    var errorHandler = $('.errorHandler', form);
                    if (response && response.email) {
                        $(this).removeClass("editable-unsaved");
                        messageHandler.html("<i class='fa fa-info-circle fa-lg'></i>" + gettext("participant-modal-detail-complete"));
                        errorHandler.hide();
                        messageHandler.show();
                    }else if (response && response.errors){
                        config.error.call(this, response.errors);
                    }
                },
                error : function(errors) {
                    var form = $('#participant_modal_detail_form');
                    var messageHandler = $('.messageHandler', form);
                    var errorHandler = $('.errorHandler', form);
                    if(errors && errors.responseText){
                        messageHandler.hide();
                        errorHandler.show();
                        var jsonResponse = JSON.parse(errors.responseText);
                        errorHandler.html("<i class='fa fa-exclamation-circle fa-lg'></i> " + gettext(jsonResponse.name)); 
                        console.log(errors.status + ": " + errors.responseText);
                    }
                }
            });

            $(document).on('click','#participant_modal_detail_edit',function(e){
                e.stopPropagation();
                $('#participant_modal_detail_field_email').editable('show');
            });
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
    participant_get_member_list(id_participant);
};

/** 
 * Funcion para cargar las listas de participantes a las que pertenece el participante en el modal de detalle:
    - Se crea la llamada ajax donde se recibe el parametro id_participant para obtener las listas a las que pertenece el participante.
    - Se crea la bandera para mandar llamar el modal de confirmacion de eliminar cuando el participante quede en una sola lista.
 */
function participant_get_member_list(id_participant){
    $('#participant_modal_detail_remove').empty();
    var count = 0;
    $.ajax({
        url : "/api/participants/"+id_participant+"/members/",
        type : "GET",
        success : function(json) {
            for (var i = 0; i < json.length; i++) {
                count += 1;
                $('#participant_modal_detail_remove').append("<tr id='mem"+json[i].id+"' ><td class='center'>"+count+"</td><td class='hidden-xs'>"+json[i].name+"</td><td class='center'><div class='visible-md visible-lg hidden-sm hidden-xs'><a href='#' class='btn btn-xs btn-red tooltips' data-placement='top' data-original-title='Remove' onclick='participant_modal_detail_remove_from_member_grid_action("+json[i].id+", "+id_participant+")'><i class='fa fa-times fa fa-white'></i></a></div></td></tr>");
            }
            if(count == 1){
                $("#participant_modal_detail_confirm_delete_hidden").val("true");
            }else{
                $("#participant_modal_detail_confirm_delete_hidden").val("false");
            }
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** 
 * Funcion para eliminar participante de una lista:
    - Se crea la llamada ajax donde se reciben los parametros id_member y id_participant para quitar relacion entre la lista y participante definidos (eliminar participante de una lista).
 */
function participant_modal_detail_remove_from_member(id_member, id_participant){
    $.ajax({
        url : "/api/members/"+id_member+"/participants/"+id_participant,
        type : "DELETE",
        success : function(json) {
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** 
 * Funcion para eliminar participante de todas las listas:
    - Se crea la llamada ajax donde se recibe el parametro id_participant para quitar relacion entre un participante de todas las listas (eliminar participante de todas las listas).
 */
function participant_delete(id_participant){
    $.ajax({
        url : "/api/participants/"+id_participant+"/members/",
        type : "DELETE",
        success : function(json) {
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** 
 * Funcion para agregar participante a una lista:
    - Se valida que el correo electronico no exista en esa lista antes de llamar la funcion ajax, si existe se muestra el error.
    - Se crea la llamada ajax donde se recibe el parametro id_member para agregar un participante a la lista especificada.
 */
function participant_add(id_member){
    var form = $('#add_email_form');
    var field = $('#add_email_participant', form);
    var errorHandler = $('.errorHandler', form);
    var messageHandler = $('.messageHandler', form);
    email_participant = field.val();
    var email_exists = 0;
    $(".checkbox_participant").each(function(index, participant){
        email = $("label[for='p"+participant.id.substring(1)+"']").html();
        if(email == email_participant){
            email_exists = 1;
        }
    });
    if(email_exists == 1){
        messageHandler.hide();
        errorHandler.html("<ul class='fa-ul'><li><i class='fa fa-exclamation-circle fa-li fa-lg'></i>&nbsp;" + interpolate(gettext("add-email-participant-error-email-duplicated"), [ email_participant ]) + "</li></ul>");
        errorHandler.show();
        field.select();
    }else{
        errorHandler.hide();
        messageHandler.show();
        messageHandler.html("<ul class='fa-ul'><li><i class='fa fa-spinner fa-li fa-spin'></i>&nbsp;"+gettext("participant-add-spinner")+"</li></ul>");
        $.ajax({
            url : "/api/members/"+id_member+"/participants/",
            type : "POST",
            data : {"email" : email_participant},
            success : function(json) {
                messageHandler.html("<ul class='fa-ul'><li><i class='fa fa-info-circle fa-li fa-lg'></i>"+gettext("participant-add-complete")+"</li></ul>");
                member_load(id_member, email_participant);
                $("#add_email_participant").val("");
                toastr.info(gettext('add-email-participant'));
            },
            error : function(xhr,errmsg,err) {
                messageHandler.hide();
                errorHandler.show();
                var jsonResponse = JSON.parse(xhr.responseText);
                errorHandler.html("<div class='col-sm-7 text-danger' style='text-align:left'>" +
                    "<i class='fa fa-exclamation-circle fa-lg'></i> " + gettext(jsonResponse.name) + "</div>");
                console.log(xhr.status + ": " + xhr.responseText);
                field.select();
            }
        });
    }
}

/** 
 * Funcion para eliminar participantes seleccionados.
    - Se obtiene la lista de ids a eliminar.
    - Se obtiene el valor de la opcion seleccionada (Eliminar de esta lista, Eliminar de todas las listas).
    - Se llama la funcion participant_list_delete_from_member_list(id_member, ids_participants) de acuerdo a la opcion seleccionada. Si se manda un -1 como parametro de id_member, se elimina de todas las listas.
*/
function participant_selected_delete(id_member){
    var ids_participants = "";
    $(".checkbox_participant[value=1]").each(function(index, participant){
        ids_participants = ids_participants + participant.id.substring(1) + ",";
    });
    ids_participants = ids_participants.substring(0,ids_participants.length - 1);
    if($("[name='options']:checked").val() == "option1"){
        participant_list_delete_from_member_list(id_member, ids_participants);
    }else if($("[name='options']:checked").val() == "option2"){
        participant_list_delete_from_member_list("-1", ids_participants);
    }
    $('#close_delete_modal_participant').click();
    $('#participant_modal_delete_close').click();
    member_load(id_member);
}

/** 
 * Funcion para copiar participantes seleccionados.
    - Se obtiene la lista de ids a copiar, tanto de members como participants.
    - Se llama la funcion participant_list_add_to_member(ids_members, ids_participants) donde se mandan los ids de participantes a copiar a las listas seleccionadas.
*/
function participant_selected_copy(id_member){
    var ids_members = "";
    var ids_participants = "";
    $(".checkbox_participant[value=1]").each(function(index, participant){
        ids_participants = ids_participants + participant.id.substring(1) + ",";
    });
    $(".checkbox_member:checked").each(function(index, member){
        ids_members = ids_members + member.value + ",";
    });
    ids_participants = ids_participants.substring(0,ids_participants.length - 1);
    ids_members = ids_members.substring(0,ids_members.length - 1);
    participant_list_add_to_member(ids_members, ids_participants);
    $('#participant_modal_copy_close').click();
    member_load(id_member);
}

/** 
 * Funcion para mostrar el formulario de agregar participante.
    - Se muestra el input con sus respectivos botones de agregar y cancelar.
    - Se muestra el area de mensaje donde se muestran las instrucciones y notificaciones de error.
*/
function participant_add_show(){
    var form = $('#add_email_form');
    var errorHandler = $('.errorHandler', form);
    var messageHandler = $('.messageHandler', form);
    $("#msg_area_participant").removeClass();
    $("#msg_area_participant").toggleClass("alert alert-success");
    $("#add_member_participant").removeClass();
    $("#add_member_participant").toggleClass("btn btn-light-grey");
    $("#add_member_participant").removeAttr("onclick", null);
    form.find("#tools_add_participant").show('slow');
    messageHandler.show('slow');
    messageHandler.html("<ul class='fa-ul'><li><i class='fa fa-info-circle fa-li fa-lg'></i>"+gettext("participant-add-instruccions")+"</li></ul>");
    $("#message_empty_participant").removeClass();
    $("#message_empty_participant").toggleClass("btn btn-light-grey");
    $("#message_empty_participant").removeAttr("onclick", null);
    $('#add_email_participant').focus()
}

/** 
 * Funcion para ocultar el formulario de agregar participante.
    - Se oculta el input con sus respectivos botones de agregar y cancelar.
    - Se limpia el input.
    - Se oculta el area de mensaje donde se muestran las instrucciones y notificaciones de error.
*/
function participant_add_cancel(){
    var form = $('#add_email_form');
    var errorHandler = $('.errorHandler', form);
    var messageHandler = $('.messageHandler', form);
    $("#add_member_participant").removeClass();
    $("#add_member_participant").toggleClass("btn btn-primary");
    $("#add_member_participant").attr("onclick", "participant_add_show()");
    form.find("#tools_add_participant").hide('slow');
    messageHandler.hide('slow');
    errorHandler.hide('slow');
    form.find('.help-block').remove();
    form.find('.form-group').removeClass("has-error");
    $("#add_email_participant").val("");
    $("#message_empty_participant").attr("onclick", "participant_add_show()");
    $("#message_empty_participant").removeClass();
    $("#message_empty_participant").toggleClass("btn btn-primary");
    errorHandler.html("<ul class='fa-ul'><li><i class='fa fa-exclamation-circle fa-li fa-lg'></i>&nbsp;" + gettext("participants-add-email-error") + "</li></ul>");
}

/** 
 * Funcion para el envio masivo de correo electronico.
    - Se valida que este seleccionado al menos 1 participante.
    - Si esta seleccionado al menos un participante, se agrega al boton "Email" el atributo mailto con la lista de participantes seleccionados.
*/
function participant_selected_send_email(event){
    // No hay ningún participante seleccionado
    if ($('.checkbox_participant:not([value=0])').length === 0) {
        event.preventDefault();
        $("#participant_menuitem_send_email").attr("href", "");
        toastr.info('participant-checkbox-send-email-error');
        return;
    }
    var emails = "";
    $(".checkbox_participant[value=1]").each(function(index, participant){
        email = $("label[for='p"+participant.id.substring(1)+"']").html();
        emails = emails + email + ", ";
    });
    $("#participant_menuitem_send_email").attr("href", "mailto:"+emails);
}

/** 
 * Funcion para mover participantes seleccionados.
    - Se obtiene la lista de ids de participantes a mover y el id de la lista seleccionada.
    - Se llama la funcion participant_list_add_to_member(id_member_to_move, ids_participants) donde se mandan los ids de participantes a mover y id de la lista seleccionada.
    - Se llama la funcion participant_list_delete_from_member_list(id_member, ids_participants) donde se mandan los ids de participantes a eliminar de la lista actual.
*/
function participant_selected_move(id_member){
    var id_member_to_move = "";
    var ids_participants = "";
    $(".checkbox_participant[value=1]").each(function(index, participant){
        ids_participants = ids_participants + participant.id.substring(1) + ",";
    });
    id_member_to_move = $("#list_members_to_move option:selected").val();
    ids_participants = ids_participants.substring(0,ids_participants.length - 1);
    participant_list_add_to_member(id_member_to_move, ids_participants);
    participant_list_delete_from_member_list(id_member, ids_participants);
    $('#participant_modal_move_close').click();
    if(SHOW_LIST_ON_MOVE == true){
        member_load(id_member_to_move);
    }else{
        member_load(id_member);
    }
}

/** 
 * Funcion para eliminar participante desde detalle de participante (se llama desde el modal de confirmacion).
    - Se llama la funcion participant_delete(id_participant) donde se manda el id del participante a eliminar.
*/
function participant_detail_delete(id_participant){
    participant_delete(id_participant);
    $('#close_modal').click();
    $('#participant_modal_detail_close').click();
    member_load(0);
    participant_get_member_list(id_participant);
}

/** 
 * Funcion para eliminar participante de una lista desde detalle de participante.
    - Se llama la funcion participant_modal_detail_remove_from_member(id_member, id_participant) donde se manda el id del participante y id de la lista.
*/
function participant_modal_detail_remove_from_member_grid_action(id_member, id_participant){
    $("#delete_rapid_confirm").attr("onclick", "participant_modal_detail_remove_from_member_confirm("+id_member+", "+id_participant+")");
    if($("#participant_modal_detail_confirm_delete_hidden").val() == "true"){
        $("#participant_modal_detail_rapid").click();
    }else{
        $("#participant_modal_detail_remove").find("#mem"+id_member).hide("slow");
        participant_modal_detail_remove_from_member(id_member, id_participant);
        member_load(id_member);
    }
}

/** 
 * Funcion para eliminar participante de una lista desde detalle de participante (Confirmacion por modal).
    - Se llama la funcion participant_modal_detail_remove_from_member(id_member, id_participant) donde se manda el id del participante y id de la lista.
*/
function participant_modal_detail_remove_from_member_confirm(id_member, id_participant){
    participant_modal_detail_remove_from_member(id_member, id_participant);
    $('#close_modal_rapid').click();
    $('#participant_modal_detail_close').click();
    member_load(id_member);
    participant_get_member_list(id_participant);
}

/** 
 * Funcion para validar que al menos este 1 participante seleccionado en la accion Eliminar.
    - Si no hay participantes seleccionados se muestra la notificiacion.
*/
function participant_selected_validate_delete(){
    //Validacion de modal borrar participantes
    $('#participant_modal_delete').on('show.bs.modal', function(){
        if ($('.checkbox_participant:not([value=0])').length === 0) {            
            $('#participant_modal_delete').modal("toggle");
        }
    });
    if ($('.checkbox_participant:not([value=0])').length === 0) {
        toastr.warning(gettext('participant-checkbox-delete-error'));
    }
    $("input[value = 'option1']").iCheck("check");
}

/** 
 * Funcion para validar que al menos este 1 participante seleccionado en la accion Copiar.
    - Si no hay participantes seleccionados se muestra la notificiacion.
    - Si no hay listas de participantes disponibles se muestra la notificiacion.
*/
function participant_selected_validate_copy(id_member){
    //Validacion de modal para copiar participantes
    $('#participant_modal_copy').on('show.bs.modal', function(){
        if ($('.checkbox_participant:not([value=0])').length === 0){
            $('#participant_modal_copy').modal("toggle");
        }else if($("#members_list > li").length === 1){
            $('#participant_modal_copy').modal("toggle");
        }
    });
    if ($('.checkbox_participant:not([value=0])').length === 0) {
        toastr.warning(gettext('participant-checkbox-delete-error'));
    }else if($("#members_list > li").length === 1){
        toastr.warning(gettext('participant-copy-member-error'));
    }else{
        member_load_elements(id_member);
    }
}

/** 
 * Funcion para validar que al menos este 1 participante seleccionado en la accion Mover.
    - Si no hay participantes seleccionados se muestra la notificiacion.
    - Si no hay listas de participantes disponibles se muestra la notificiacion.
*/
function participant_selected_validate_move(id_member){
    //Validacion de modal para mover participantes
    $('#participant_modal_move').on('show.bs.modal', function(){
        if ($('.checkbox_participant:not([value=0])').length === 0) {            
            $('#participant_modal_move').modal("toggle");
        }else if($("#members_list > li").length === 1){
            $('#participant_modal_move').modal("toggle");
        }
    });
    if ($('.checkbox_participant:not([value=0])').length === 0) {
        toastr.warning(gettext('participant-checkbox-delete-error'));
    }else if($("#members_list > li").length === 1){
        toastr.warning(gettext('participant-copy-member-error'));
    }else{
        member_load_elements(id_member);
    }
}

/** 
 * Funcion para Agregar participantes a una o varias listas en una sola llamada:
    - Se crea la llamada ajax donde se reciben los parametros ids_members y ids_participants para agregar un conjunto de participantes a un conjunto de listas.
 */
function participant_list_add_to_member(ids_members, ids_participants){
    $.ajax({
        url : "/api/members/participants/",
        type : "POST",
        async: false,
        data : {
                    "members" : ids_members,
                    "participants" : ids_participants,
        },
        success : function(json) { 
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** 
 * Funcion para Eliminar participantes de una o varias listas en una sola llamada:
    - Se crea la llamada ajax donde se reciben los parametros ids_members y ids_participants para eliminar un conjunto de participantes de un conjunto de listas.
    - Si en el parametro ids_members se obtiene un -1, significa que se eliminara de todas las listas existentes.
 */
function participant_list_delete_from_member_list(ids_members, ids_participants){
    $.ajax({
        url : "/api/members/participants/",
        type : "DELETE",
        async: false,
        data : {
                    "members" : ids_members,
                    "participants" : ids_participants,
        },
        success : function(json) {  
        },
        error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
    });
}

/** 
 * Funcion para mostrar un mensaje cuando no existan participantes en una lista:
    - Se manda llamar cuando una lista este vacia.
    - Se valida cuando este activo o no la opcion de agregar participante, para mostrar u ocultar dicho formulario.
 */
function participant_show_empty_message(){
    $(".message-content").find(".messages-list").html(gettext("participant-show-empty-message")+"&nbsp;<a id='message_empty_participant' class='btn btn-primary' onclick='participant_add_show()'><i class='fa fa-plus'></i></a> "+gettext("participant-show-empty-message2"));
    if($("#add_member_participant").attr("class") == "btn btn-light-grey"){
        $("#message_empty_participant").removeClass();
        $("#message_empty_participant").toggleClass("btn btn-light-grey");
        $("#message_empty_participant").removeAttr("onclick", null);
    }
}
