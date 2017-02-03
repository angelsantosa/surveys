$(document).ready( function(){

	var updateOutput = function(e)
    {
        var list   = e.length ? e : $(e.target),
            output = list.data('output');
        if (window.JSON) {
            alert(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
        } else {
            alert('JSON browser support required.');
        }
    };

    $('#nestable3').nestable({
    	maxDepth: 1,
        group: 1
    })
    .on('change', updateOutput);

	$('#segment_modal_new').on('hidden.bs.modal', function (e) {
		$(e.target).removeData("bs.modal");
	});

	segment_list_load();
});

function segment_list_load(){
	$("#segments_list").empty();
	$.ajax({
		url : "/api/segments/",
		type : "GET",
		success : function(json) {
			var segment_item = $('#segment_item').html();
			for (var i = 0; i < json.length; i++) {
				$('#segments_list').append(segment_item);
				$('#segment_item_0').attr('id', 'segment_item_'+json[i].id);
				$('#flag_id_country').attr('id', 'flag_id_country_'+json[i].id);
				$('#language').attr('id', 'language_'+json[i].id);
				$('#segment_item_title').attr('id', 'segment_item_title_'+json[i].id);
				var segment_count = json[i].segment_count;
				if (segment_count > 1){
					$('#language_'+json[i].id).append("<i class='fa fa-globe'></i>"+" (" + json[i].segment_count + ")");
				}
				$('#flag_id_country_'+json[i].id).attr('src',"/static/flags/"+json[i].code+".gif");
				$('#segment_item_title_'+json[i].id).append(json[i].name+" ("+json[i].option_count+")");
				$('#segment_item_title_'+json[i].id).attr('onclick', 'segment_load('+ json[i].id+',"'+json[i].name+'",'+json[i].option_count+')');
			}
			segment_load(json[0].id,json[0].name,json[0].option_count);
		},
		error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
	});
}

function segment_load(id_segment,name,count){
	$('#segments_list > .messages-item').removeClass("active starred");
	$('#segments_list > .messages-item[id=segment_item_'+id_segment+']').toggleClass("active starred");
	$('#segment_header_title').html(name+" ("+count+")");
	$("#flags_header").empty();
	var valueAll = $('#all').html();
	$('#segment_dropdown_delete').empty();

	$.ajax({
		url : "/api/segments/" + id_segment + "/languages/",
		type : "GET",
		success : function(json) {
			var option_flag = $('#segment_option_delete').html();
			$('#segment_dropdown_delete').append("<li><a><span id='all' style='vertical-align: middle; margin-left: 3px'>"+valueAll+"</span></a></li>");
			for (var i = 0; i < json.length; i++) {
				$('#flags_header').append("<img class='country-select-flag' data-toggle='tooltip' title='"+json[i].name+"' style='margin-left: 6px' src='/static/flags/"+json[i].code+".gif'>");
				$('#segment_dropdown_delete').append(option_flag);
				$('#flag_id_country').attr('id', 'flag_id_country_'+json[i].code);
				$('#segment_option_title').attr('id', 'segment_option_title_'+json[i].code);
				$('#flag_id_country_'+json[i].code).attr('src',"/static/flags/"+json[i].code+".gif");
				$('#segment_option_title_'+json[i].code).html(json[i].name);
			}
			$('[data-toggle="tooltip"]').tooltip();
		},
		error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
	});

	$('#nestable3 > .dd-list').empty();

	$.ajax({
		url : "/api/segments/" + id_segment + "/options/",
		type : "GET",
		success : function(json) {
			var option_nestable = $('#segment_option_nestable').html();
			for (var i = 0; i < json.length; i++) {
				$('#nestable3 > .dd-list').append(option_nestable);
				$('#segment_nestable_0').attr('id', 'segment_nestable_'+json[i].id);
				$('#segment_nestable_title').attr('id', 'segment_nestable_title_'+json[i].id);
				$('#segment_nestable_'+json[i].id).attr('data-id', json[i].id);
				$('#segment_nestable_title_'+json[i].id).html(json[i].name);
			}
		},
		error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
	});
}

function segment_modal_new_config(){
	$("#segment_languages_list").empty();
	$.ajax({
		url : "/api/languages/",
		type : "GET",
		success : function(json) {
			for (var i = 0; i < json.length; i++) {
				$("#segment_languages_list").append("<option value='"+json[i].code+"'>"+json[i].name+"</option>");
			}
			$("#segment_languages_list").val('mx');
			segment_modal_new_accordion('mx');
		},
		error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
	});

	$('#segment_languages_list').off('change').on('change', function() {
        var language_code = $("#segment_languages_list").val();
        segment_modal_new_accordion(language_code);
    });
}

function segment_modal_new_accordion(language_code){
	$('#segments_by_language_accordion').empty();
	$.ajax({
		url : "/api/segments/options/languages/" + language_code +"/",
		type : "GET",
		success : function(json) {
			$('#segments_by_language_accordion').append('<div style="margin-top:10px;margin-bottom:10px;"><img class="country-select-flag" style="margin-left: 6px;" src="/static/flags/'+language_code+'.gif"> Segmentos existentes</div>'); /* TRANS */
			if (json.length > 0){
				var option_accordion = $('#segment_modal_accordion').html();
				for (var i = 0; i < json.length; i++) {
					$('#segments_by_language_accordion').append(option_accordion);
					$('#segments_by_language_accordion #accordion_link').attr('id','accordion_link_'+json[i].id);
					$('#accordion_link_'+json[i].id).html('<i class="icon-arrow"></i>'+json[i].name);
					$('#accordion_link_'+json[i].id).attr('href','#collapse_'+json[i].id);
					$('#segments_by_language_accordion #collapse00').attr('id','collapse_'+json[i].id);
					$('#segments_by_language_accordion #acordion_text').attr('id','acordion_text_'+json[i].id);
					var options = json[i].options;
					for (var j = 0; j < options.length; j++){
						$('#acordion_text_'+json[i].id).append('- ' + options[j].name + '<br>');
					}
				}
			} else {
				$('#segments_by_language_accordion').append('No hay segmentos encontrados'); /* TRANS */
			}
		},
		error : function(xhr,errmsg,err) {
            console.log(xhr.status + ": " + xhr.responseText);
        }
	});
}