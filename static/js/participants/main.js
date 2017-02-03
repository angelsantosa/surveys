$(document).ready( function(){
        // Load all posts on page load
        member_load(0);
        
        // Configuración x-editable
        $.fn.editable.defaults.ajaxOptions = {type: "put"}
        $.fn.editable.defaults.mode = 'inline';

        // Invocar el handler selector ALL marque todos los checkbox
        checkboxAllHandler();

        $('#search_participant').keypress(function(){
            $('#icon_search').hide();
            $('#icon_clear').show();
        });

        $('#search_participant').keyup(function(){
            if($('#search_participant').val() == ""){
                $('#icon_search').show();
                $('#icon_clear').hide();
            }

            //Filtrado de emails
            var filter = $('#search_participant').val().toLowerCase().replace(/\s/g,"-");
            if(filter){
                $matches = $(".messages-content > .message-content .messages-list").find('label:Contains(' + filter + ')').parent();
                $('li', ".messages-content > .message-content .messages-list").not($matches).slideUp();
                $matches.slideDown();
            }else{
                $(".messages-content > .message-content .messages-list").find('li').slideDown();
            }
        });

        $('#icon_clear').click(function(){
            $('#search_participant').val("");
            $('#icon_search').show();
            $('#icon_clear').hide();
            $('#search_participant').focus();
            $(".messages-content > .message-content .messages-list").find('li').slideDown();
        });

        $(".cbx-container").change(function() {
            var count_selected = 0;
            $(".checkbox_participant[value=1]").each(function(index, participant){
                count_selected += 1;
            });
            $("#participant_count_selected").html("&nbsp;("+count_selected+")");
        });

        // Inicializando el componente de carga de archivo
        $('#member_modal_bulk_load_input_file').fileinput({
            showUpload: false,
            showCaption: true,
            maxFileCount: 1,
            mainClass: "input-group-sm",
            language: "es",
            allowedFileExtensions: ["xls", "xlsx", "ods", "txt", "csv"],
            browseLabel: gettext("member-modal-bulk-load-input-file-browse"),
            browseClass: "btn btn-primary",
            browseIcon: '<i class="fa fa-folder-open fa-lg"></i>',
            removeLabel: gettext("member-modal-bulk-load-input-file-delete"),
            removeClass: "btn btn-danger",
            removeIcon: '<i class="fa fa-trash-o fa-lg"></i>',
            uploadLabel: gettext("member-modal-bulk-load-input-file-upload"),
            uploadClass: "btn btn-info",
            uploadIcon: '<i class="fa fa-info-circle fa-lg"></i>',
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
});
