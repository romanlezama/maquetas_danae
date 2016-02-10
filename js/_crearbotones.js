var buttons = {
	/*
	* Obtiene el json con los botones disponibles
	*/
	get_json : function(){
		//showLoadingOverlay();
		var action_button = (function () {
	        var action_button = null;
	        $.ajax({
	            'async' 	: 	false,
	            'global'	: 	false,
	            'url'		: 	'/maquetas/actions/actions_buttons.json',
	            'dataType'	: 	"json",
	            'timeout'	: 	10000,
	            'success'	: 	function (data) {
	                action_button = data;
	            },
	            'error'		: 	function(x, t, m) {
	                if(t==="timeout") {
	                    dialog_alert("Intermitencia en las comunicaciones");
	                    //hideLoadingOverlay();
	                } else {
	                    dialog_alert(t);
	                    //hideLoadingOverlay();
	                }
	            }
	        });
	        return action_button;
	    })();
	    return action_button;
	},
	/*
	* Regresa los elementos necesarios para pintar el botón en el grid
	*/
	crea_boton : function( json_to_send, json_config, id_grid, status, tipo_usuario ){
		var isPopup = ( json_config.isPopup === "T" ) ? true : false;
		var label 	= 	json_config['label'], 
			j_send 	= 	JSON.stringify(json_to_send).replace(/"/g,'\\"'), 
			j_conf 	= 	JSON.stringify(json_config).replace(/"/g,'\\"'), 
			sinBts 	= 	[ "reporteExtractosEP", "reporteExtractosCP", "reporteActualizadorCAT" ], 
			btn 	= 	"";

		if(isPopup)
			btn = "<button onclick='buttons.configura_envio(\""+j_send+"\", \""+j_conf+"\", \""+id_grid+"\")' class='dialog_button light tiny text_only has_text' data-dialog='dialog_form'><span>"+label+"</span></button>";
		else
			btn = "<button onclick='buttons.configura_envio(\""+j_send+"\", \""+j_conf+"\", \""+id_grid+"\")' class='light tiny text_only has_text'><span>"+label+"</span></button>";
		
		if( sinBts.indexOf( id_grid ) !== -1 ){
			var labelButton = json_config.label;
			switch ( labelButton ){
				case "Eliminar":
					var retorno = ( (status !== "por pagar") && (id_grid !== "reporteActualizadorCAT") ) ? "" : btn;
					return retorno;
					break;
				case "Publicar":
					var retorno = ( status === "por publicar" ) ? btn : "";
					return retorno;
					break;
				case "Paquetes":
					var retorno = ( tipo_usuario === "tarifado" ) ? btn : "";
					return retorno;
					break;
				case "Seguimientos":
					var retorno = ( tipo_usuario === "tarifado" ) ? btn : "";
					return retorno;
					break;
				default:
					return btn;
					break;
			}
		} else {
			return btn;
		}

	},
	/*
	* Configura el clik del botón
	*/
	configura_envio : function(j_send, j_conf, id_reporte){
		var datas 	= jQuery.parseJSON(j_send), 
			conf 	= jQuery.parseJSON(j_conf), 
			reporte = id_reporte;

		if( conf.funcion2eject !== "" ){ //Entonces se ejecutará una función JS
			var val;
			for(var index in datas){
				val = datas[index];
			}
			var funcion = conf.funcion2eject + '(' + val + ')';
			console.log(funcion);
			eval(funcion);
		} else if( conf.isPopup === "T" ){ // El resultado se verá en Popup
			var cmd 	= conf.cmd, 
				arr_cmd = cmd.split( ':' ), 
				espacio = $( "#espacio_popup" );
			var val;
			for(var index in datas){
				val = datas[index];
			}
			if( arr_cmd[ 0 ] === "GRID" ){
				var ruta 		= 	"/maquetas/tablas/" + arr_cmd[ 1 ] + ".json", 
					txtFiltro 	= 	'{"' + conf.jsonparam + '":"' + val + '"}';
				grids.grid_hijo( ruta, espacio, txtFiltro );
			}
		} else {
			if(conf.tituloConfirmacion !== ""){
				var confirm = $("#dialog-confirm");
			    confirm.html('<br/><div class="section" align="center"><h3>'+conf.tituloConfirmacion+'</h3></div>');
			    confirm.dialog({
			        title : 'Eliminación de Autos',
			        buttons : {
			            "Aceptar" : function (){
			                $(this).dialog('close');
			                buttons.ejecutar(conf.aurl, datas, reporte);
			            },
			            "Cancelar" : function (){
			                $(this).dialog('close');
			            }
			        }
			    });
			    confirm.dialog('open');
			} else {
				buttons.ejecutar(conf.aurl, datas, reporte);
			}
		}
	}, 
	/*
	* Ejecuta la acción del botón
	*/
	ejecutar : function(url, data_send, name_report){
		//showLoadingOverlay();
        $.ajax({
        	url 	: url,
	        type 	: "post",
            dataType: "json",
            timeout : 110000,
	        data 	: data_send,
	        success : function(data){
			    if(typeof data['error'] !== "undefined"){
			        dialog_alert(data['error']);
			    } else if(typeof data['msg'] !== "undefined"){
			        dialog_alert(data['msg']);
			        var filtro_json = JSON.stringify( $("#form_filtros").serializeObject() );
                    grids.filtrarGrid(filtro_json, name_report);
			    }
                //hideLoadingOverlay();
	        },
            error 	: function(x, t, m) {
                if(t==="timeout") {
                    dialog_alert("Intermitencia en las comunicaciones");
                } else {
                    dialog_alert("Intermitencia en las comunicaciones");
                }
                //hideLoadingOverlay();
            }
        });
	}
};