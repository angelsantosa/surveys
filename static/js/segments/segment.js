// FUNCIONES DE LISTAS DE SEGMENTOS

/** 
 * Funcion para cargar el listado de segmentos del template _segments_by_language.html:
    - TODO: Falta obtener el listado de segmentos pasando como parametro el idioma seleccionado
    - Se agrega la lista de segmentos utilizando "accordion" de rapido.
 */

function segment_by_language_accordion(){
	var genero = '<div class="panel panel-white"><div class="panel-heading"><h5 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseSubGenero"><i class="icon-arrow"></i> GENERO</a></h5></div><div id="collapseSubGenero" class="panel-collapse collapse" style="height: 0px;"><div class="panel-body">yuju</div></div></div>';
	var antiguedad = '<div class="panel panel-white"><div class="panel-heading"><h5 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseSubAntiguedad"><i class="icon-arrow"></i> ANTIGUEDAD</a></h5></div><div id="collapseSubAntiguedad" class="panel-collapse collapse" style="height: 0px;"><div class="panel-body">yuju</div></div></div>';
	var nivel = '<div class="panel panel-white"><div class="panel-heading"><h5 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseSubNivel"><i class="icon-arrow"></i>NIVEL</a></h5></div><div id="collapseSubNivel" class="panel-collapse collapse" style="height: 0px;"><div class="panel-body">yuju</div></div></div>';
	var ubicacion = '<div class="panel panel-white"><div class="panel-heading"><h5 class="panel-title"><a class="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseSubUbicacion"><i class="icon-arrow"></i>UBICACION</a></h5></div><div id="collapseSubUbicacion" class="panel-collapse collapse" style="height: 0px;"><div class="panel-body">yuju</div></div></div>';

	$('#segments_by_language_accordion').append('<div class="panel-group accordion" id="accordion">'+genero+antiguedad+nivel+ubicacion+'</div>');

	//Abrir modal de Crear Nuevo Segmento para las pruebas
	//$("#segment_modal_new").modal("toggle");
}

/** 
 * Funcion para agregar una nueva opcion de segmento en el modal de Crear Nuevo Segmento:
    - Se utiliza la variable segment_num para llevar el conteo de inputs para opciones de segmento.
    - Para agregar nuevo input de opcion de segmento, primero se quita el boton + que llama esta funcion, luego se agrega el nuevo campo de opcion de segmento y por ultimo se agrega el boton + para que quede al final de la lista de opciones.
 */
var segment_num = 3;
function segment_add_input_option(){
	//Quitar boton de agregar nueva opcion de segmento.
	$(".row #segment_add_option").remove();

	//Agregar nuevo input de opcion de segmento.
	$(".row #segment_add_form").append('<div id="segment_options_'+segment_num+'" class="form-group"><label for="segment_option'+segment_num+'" class="col-sm-2 control-label"></label><label for="segment_option'+segment_num+'" class="col-sm-1 control-label">'+segment_num+'.</label><div class="col-sm-7"><input type="text" id="segment_option'+segment_num+'" class="form-control"></div><div id="segment_delete_option_button'+segment_num+'" class="visible-md visible-lg hidden-sm hidden-xs" style="margin-top:5px;"><a href="#" class="btn btn-xs btn-red tooltips" data-placement="top" onclick="segment_delete_input_option('+segment_num+')"><i class="fa fa-times fa fa-white"></i></a></div></div>');

	//Agregar al final el boton de agregar nueva opcion de segmento.
	$(".row #segment_add_form").append('<div id="segment_add_option" class="form-group">	<label class="col-sm-2 control-label"></label><div class="col-sm-7"><div class="visible-md visible-lg hidden-sm hidden-xs"><a href="#" class="btn btn-xs btn-primary tooltips" data-placement="top" onclick="segment_add_input_option()""><i class="fa fa-plus fa fa-white"></i></a></div></div></div>');
	segment_num++;
}

/** 
 * Funcion para eliminar opcion de segmento en el modal de Crear Nuevo Segmento:
    - Se utiliza  el parametro option para identificar la opcion de segmento a eliminar.
 */
function segment_delete_input_option(option){
	//Quitar input de opcion de segmento con su boton de eliminar
	$(".row #segment_options_"+option).remove();
}

//Para pruebas, se llama la funcion de cargar lista de segmentos por idioma.
//segment_by_language_accordion();

/** 
 * Evento para mostrar y ocultar las opciones de edicion de idioma.
    - Muestra u oculta las funcionalidades depende de la opcion seleccionada (Referenciado de otro idioma / Definir el texto de las opciones).
 */
$('#segment_options_form input[name=segment_options_radio]').on('ifClicked', function(event){
	if ($(this).val()=='language_referenced'){
		$('#segment_modal_edit_referenced_language_title').show();
		$('#segment_modal_edit_referenced_language_content').show();
		$('#segment_modal_edit_define_options_title').hide();
		$('#segment_modal_edit_define_options_content').hide();
	}else{
		$('#segment_modal_edit_define_options_title').show();
		$('#segment_modal_edit_define_options_content').show();
		$('#segment_modal_edit_referenced_language_title').hide();
		$('#segment_modal_edit_referenced_language_content').hide();
	}
});

/** 
 * Funcion para mostrar el formulario de agregar nueva opcion de segmento.
    - Se muestra los input para agregar la nueva opcion en distintos idiomas.
 */
function segment_modal_edit_option_add_show(){
	$("#segment_modal_edit_option_add_list").show("slow");
	$("#segment_modal_edit_option_button_add").removeClass();
    	$("#segment_modal_edit_option_button_add").toggleClass("btn btn-light-grey");
}

/** 
 * Funcion para ocultar el formulario de agregar nueva opcion de segmento.
 */
function segment_modal_edit_option_add_hide(){
	$("#segment_modal_edit_option_add_list").hide("slow");
	$("#segment_modal_edit_option_button_add").removeClass();
    	$("#segment_modal_edit_option_button_add").toggleClass("btn btn-primary");
}

/** 
 * Funcion para cargar el listado de reactivos.
    - Se obtiene el menu de opciones de reactivos y se guarda en la variable question_menu.
    - Se agrega la lista de reactivos con su respectivo menu de acciones y elementos.
 */
function question_load(){
	var question_menu = $("#question_menu").html();
	for(var i=0;i<=10;i++){
		$("#question_list").append("<li><div class='todo-actions'>"+question_menu+"<span class='desc'>&nbsp;&nbsp;<img class='country-select-flag' id='flag_id_country' style='margin-left:10px;' src='/static/flags/mx.gif'><i class='fa fa-globe fa-lg' style='margin-left:20px; margin-right:5px;'></i>&nbsp;(10)&nbsp;&nbsp;&nbsp;&nbsp; Element "+i+"</span><span class='pull-right'><a role='menuitem' tabindex='-1' href='#' data-toggle='modal' onclick=''><i class='fa fa-eye fa-lg'></i></a></span></div></li>");
	}
}

//Para pruebas, se llama la funcion de cargar listado de reactivos.
question_load();

//Para pruebas, activo modal de detalle de reactivo semi abierto
//$("#question_modal_detail_half_open").modal("toggle");

//Para pruebas, activo modal de detalle de reactivo semi abierto
$("#question_modal_detail_open").modal("toggle");
