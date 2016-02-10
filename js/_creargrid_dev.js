var grids = {
	get_json : function(ruta, espacio){
		espacio.html('');
		$.getJSON(ruta,{
	            format: "json"
		}).done(function(data){
            grids.crear_grid(data, espacio);
        });
	},
	crear_grid : function(configs, espacio){
		var id = configs.id_tabla,
			visible = (configs.visible_table === 'T') ? 'block' : 'none'
			cols = new Array();

		espacio.append('<div style="display: '+visible+';" align="left" class="box grid_16 single_datatable">'+
            '<div id="'+configs.div_table+'" class="no_margin"><table id="'+id+'"></table></div>'+
            '<div class="fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix" style="background-color:#4C5766;">'+
                '<button class="send_right light text_only has_text" onclick="descarga_archivo(\''+id+'\',\'PDF\')">PDF</button>'+
                '<button class="send_right light text_only has_text" onclick="descarga_archivo(\''+id+'\',\'XLS\')">XLS</button>'+
                '<button class="send_right light text_only has_text" onclick="descarga_archivo(\''+id+'\',\'CSV\')">CSV</button>'+
            '</div>'+
        '</div>');

		for( var i=0; i<configs.columns.length; i++ ){
			var conf_col = configs.columns[i],
				colms = {}
				tipo = conf_col.tipo;
			colms.title = conf_col.sTitle;
			colms.width = (conf_col.width==0) ? null : conf_col.width+'em';
			colms.visible = (conf_col.bVisible=="F" || tipo =="NOSELECT") ? false : true;
			switch( tipo ){
				case "NOSELECT":
					colms.sType = tipo;
					break;
				case "date":
					colms.render = function(data, type, row, meta){ return renders.to_date(data); };
					colms.type = "date-sd";
					break;
				case "time":
	                colms.render = function (data, type, row, meta){ return renders.to_hour(data); };
	                break;
	            case "datetime":
	                colms.render = function (data, type, row, meta){ return renders.to_datetime(data); };
	                break;
	            case "moneda":
	                colms.class = "right";
	                colms.render = function (data, type, row, meta){ return renders.to_pesos(data); };
	                break;
	            default:
	            	break;
			}
			cols[ i ] = colms;
		}
		jQuery.extend( jQuery.fn.dataTableExt.oSort, {
			"date-sd-pre": function ( date ) {
				if(date === ""){
					return 0;
				} else {
					var dateParts = date.split(/-/);
					return (dateParts[2] * 10000) + ($.inArray(dateParts[1].toUpperCase(), ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]) * 100) + (dateParts[0]*1);
				}
			},
			"date-sd-asc": function ( a, b ) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
			},
			"date-sd-desc": function ( a, b ) {
				return ((a < b) ? 1 : ((a > b) ? -1 : 0));
			}
		} );
		tabla_grid = $( '#' + id ).dataTable( {
	        "order": [[0,"asc"]],
	        "scrollY": "50%",
	        //"scrollY": ( $(window).height() - ($("#titCabecera").height()*2.5) )+"px",
	        //"scrollX": "100%",
	        "scrollInfinite": true,
	        "scrollCollapse": true,
	        "processing": true,
	        "paging": false,
	        "jQueryUI": true,
	        "columns": cols,
	        "displayLength": 50,
			"filter": false,
	        "info": true,
	        "dom": 'C<"clear">Rlfrtip',
	        "language": {
	            "lengthMenu": "Mostrar _MENU_ renglones por página",
	            "zeroRecords": "No se encontraron datos",
	            "info": "Mostrando _START_ al _END_ de _TOTAL_ registros",
	            "infoEmpty": "No hay información disponible",
	            "infoFiltered": "(Filtrado de _MAX_ renglones totales)"
	        }
		});
		grids.filtrarGrid( id );
	},
	filtrarGrid : function( nombreReporte ){
    $.ajax({
        url: "js/testJSON.json",
        dataType: "json",
        timeout: 110000,
        success: function (data) {
        	var reporte = "#"+nombreReporte;
            if(data !== null){
                if(data['data'].length > 0){
                    $(reporte).dataTable().fnClearTable();
                    $(reporte).dataTable().fnAddData(data['data']);
                } else{
                    $(reporte).dataTable().fnClearTable(0);
        			$(reporte).dataTable().fnDraw();
                }
                if(data['registros'] >= 400){
                    alert("Demasiados registros encontrados, se ha limitado la consulta a 400 líneas, use \"Condiciones\" para definir su consulta");
                }
            }
            $(reporte+"_processing").css("display", "none");
            $('#'+nombreReporte+' tbody tr').click(function(e) { // Hago la selección de un registro del Datatable.
                if ( $(this).hasClass('row_selected') ) {
                    $(this).removeClass('row_selected');
                } else {
                    $('#'+nombreReporte).dataTable().$('tr.row_selected').removeClass('row_selected');
                    $(this).addClass('row_selected');
                }
            });
        },
        error: function(x, t, m) {
            alert('Intermitencia en las comunicaciones');
        }
    });
}
};