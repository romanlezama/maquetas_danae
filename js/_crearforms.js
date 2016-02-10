var form = {
    get_json : function(ruta, espacio){ // Obtiene el json del grid
                    $.getJSON(ruta,{
                            format: "json"
                    }).done(function(data){
                        form.pintar_form(data, espacio);
                    });
    },
    /*
    * Función que se encarga de configurar la forma y pintarla en el #espacio.
    */
    pintar_form : function(data, espacio){
        showLoadingOverlay();
        var f_propiedades   =   data.forma, 
            f_id            =   f_propiedades.clave, 
            f_titulo        =   f_propiedades.tituloformulario, 
            f_elementos     =   data.elementos, 
            f_action        =   f_propiedades["action"], 
            f_target        =   f_propiedades["target"];
        //Creo el div contenedor para la forma
        var txt_contenedor = '<div class="box grid_16 no_titlebar" style="opacity: 1; background: transparent; box-shadow: none;"><div class="block" style="opacity: 1; width: 750px;"><form class="validate_form" novalidate="novalidate" id="'+f_id+'" action="'+f_action+'" method="POST" target="'+f_target+'" style="text-align: left;" ><h2 class="section">'+f_titulo+'</h2><div class="columns clearfix"></div></form></div></div>';
        espacio.html(txt_contenedor);
        var miForma = $("#"+f_id);
        var elementosYreglasValidacion = form.genera_elementos(f_elementos); //Obtengo los componentes de la forma y sus validaciones

        miForma.append(elementosYreglasValidacion.f_componentes);
        $('.datepicker').not('.hasDatePicker').datepicker({dateFormat: 'yy-mm-dd'});

        $("input[type='moneda']").inputmask( 'decimal', {
            radixPoint: '.',
            digits: 2,
            repeat: 20,
            autoGroup: true,
            groupSeparator: ',',
            groupSize: 3,
            rightAlign: false
        } );

        miForma.validate({ // Configuramos la validación del formulario
            ignore      :   ":hidden, [readonly=readonly]",
            rules       :   elementosYreglasValidacion.v_reglas,
            messages    :   elementosYreglasValidacion.v_mensajes
        });
        form.enviar_form(miForma); // Envía la información
        hideLoadingOverlay();
    },
    /*
    * Genera un json con el contenido de la forma en formato de texto para agregarlo al formulario previamente creado, 
    * además, devuelve las validaciones que se tomarán en cuenta con sus mensajes definidos en la maqueta.
    */
    genera_elementos : function(elementos){
        var f_content               =   '', 
            req_rules               =   {}, 
            req_msgs                =   {}, 
            sinValidacionEspecial   =   [ //Para los que están aquí solo se valida que sean requeridos pero no tienen validación especial (que no están en validation-extra)
                "text",
                "select",
                "date",
                "selector",
                "exp_cons",
                "exp_anio",
                "sololetras",
                "concepto",
                "bill_serie",
                "bill_folio",
                "textoespeciales",
                "textarea",
                "solonumeros",
                "radio",
                "radio_end",
                "password",
                "serie_billete",
                "serie_billete_confirma",
                "file"
            ];
        for(var i=0; i<elementos.length; i++){
            var e           =   elementos[i], 
                tipo        =   e.tipo, 
                id          =   e['id'], 
                name        =   e['name'], 
                label       =   (e['label'] !== null) ? e['label'] : '&nbsp;', 
                defaultVal  =   (e.defaultvalue == null) ? "" : e.defaultvalue, 
                clase       =   (tipo == "date") ? "datepicker" : "", 
                ancho       =   (tipo == "date" || tipo == "moneda") ? 'style="width:100px !important;"' : '', 
                maxLength   =   (e.maxlength !== 0) ? 'maxlength="'+e.maxlength+'"' : '', 
                selected    =   (label == "selected") ? "selected" : "", 
                sololectura =   '', 
                placeholder =   '', 
                subtitle    =   label.split("\\n"), 
                subtitulo   =   (typeof subtitle[1] !== "undefined") ? subtitle[1] : "";; // Configuro el título de la etiqueta con sub-título

            tipo = (tipo === "date") ? "text" : tipo;

            if(defaultVal.match(/__/g)){ // Busco si inicia con __ para ponerlo como placeholder
                var ph = defaultVal.split("__");
                placeholder = ph[1];
                defaultVal = "";
            }
            //Configuro campos de sólo lectura
            if (e.rdonly === "T"){
                sololectura = (tipo === "select") ? "disabled" : "readonly"; // Si es select entonces estará deshabilitado y si es text estará como readonly
            }
            //Configuro los campos que son requeridos
            if(e.required === "T"){ // Configuro los requeridos
                if(sinValidacionEspecial.indexOf(tipo) == -1){
                    req_rules[name] = {};
                    req_rules[name]['required'] = true;
                    req_rules[name][tipo] = true;
                    req_msgs[name] = {};
                    req_msgs[name]['required'] = e.message;
                } else {
                    req_rules[name] = "required";
                    req_msgs[name] = e.message;
                }
            }
            if(tipo === "nas"){
                req_rules[name] = {"nas": true};
            }
            // Valido los tipos de campos para proceder a crearlos
            switch(tipo){
                case "select":
                    f_content += '<fieldset id="fieldset_'+id+'" class="label_side top"><label for="'+name+'">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><select name="'+name+'" id="'+id+'" class="uniform full_width" style="width:160px !important;" '+sololectura+'>';
                    break;
                case "option":
                    f_content += '<option value="'+name+'" '+selected+'>'+defaultVal+'</option>';
                    break;
                case "option_end":
                    f_content += '<option value="'+name+'" '+selected+'>'+defaultVal+'</option></select></div></fieldset>';
                    break;
                case "div":
                    f_content += '<div id="'+id+'">';
                case "div_end":
                    f_content += '</div>';
                    break;
                case "label":
                    f_content += '<div id="'+name+'" align="center"><p><label for="'+name+'"><h3 id="titulo_'+name+'">'+label+'</h3></label>&nbsp;</p></div>';
                    break;
                case "button":
                    f_content += '<button type="button" class="send_right" style="z-index:0;" id="'+id+'"><span>'+defaultVal+'</span></button>';
                    break;
                case "submit":
                    f_content += '<div class="button_bar clearfix" id="areaBotones"><button type="submit" class="send_right" style="z-index:0;"><span>'+defaultVal+'</span></button></div>';
                    break;
                case "reset":
                    f_content += '<button type="'+tipo+'" name="'+name+'" id="'+id+'" class="send_right"><span>'+defaultVal+'</span></button>';
                    break;
                case "hidden":
                    f_content += '<input type="'+tipo+'" class="text '+clase+'" name="'+name+'" id="'+id+'" value="'+defaultVal+'" '+maxLength+' '+sololectura+' />';
                    break;
                case "exp_cons":
                    f_content += '<div class="columns clearfix"><div class="col_50"><fieldset class="label_side top"><label style="line-height:none;" id="label_exp">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="text" class="text '+clase+'" style="width:160px !important; margin-left: 16px;" name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' onkeypress="return only_num(event)" /></div></fieldset></div>';
                    break;
                case "exp_anio":
                    f_content += '<div class="col_50"><fieldset class="label_side top"><label style="line-height:none; text-align: right;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="expedienteAnio" class="text '+clase+'" style="width:160px !important;  margin-left: 16px;" name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' onkeypress="return only_num(event)" /></div></fieldset></div></div>';
                    break;
                case "text": 
                    f_content += '<fieldset id="fieldset_'+id+'" class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="'+tipo+'" class="text '+clase+'" '+ancho+' name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' /></div></fieldset>';
                    break;
                case "nas":
                    f_content += '<fieldset id="nas" class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+' <span>'+subtitulo+'</span></label><div class="clearfix"><input type="text" class="text '+clase+'" '+ancho+' name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' /></div></fieldset>';
                    break;
                case "sololetras":
                    f_content += '<fieldset class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="'+tipo+'" class="text '+clase+'" '+ancho+' name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' onkeypress="return only_text(event)" /></div></fieldset>';
                    break;
                case "sololetrasYmayus":
                    f_content += '<fieldset class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="'+tipo+'" class="text '+clase+'" '+ancho+' name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' style="text-transform: uppercase;" onkeypress="return only_text_sin_acento(event)" onChange="to_mayus(this);" /></div></fieldset>';
                    break;
                case "solonumeros":
                    f_content += '<fieldset class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="'+tipo+'" class="text '+clase+'" '+ancho+' name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' onkeypress="return only_num(event)" /></div></fieldset>';
                    break;
                case "textoespeciales":
                    f_content += '<fieldset class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="sololetras" class="text '+clase+'" '+ancho+' name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' style="text-transform: uppercase;" onkeypress="return to_textoespeciales(event)"/></div></fieldset>';
                    break;
                case "textarea":
                    f_content += '<fieldset class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><textarea rows="3" class="textarea'+clase+'" name="'+name+'" id="'+id+'" '+maxLength+' '+sololectura+'>'+defaultVal+'</textarea></div></fieldset>';
                    break;
                case "radio":
                    f_content += '<fieldset class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="uniform inline clearfix"><input value="'+id+'" type="radio" name="'+name+'" >'+defaultVal+'<br/>';
                    break;
                case "radio_end":
                    f_content += '<input value="'+id+'" type="radio" name="'+name+'">'+defaultVal+'</div></fieldset>';
                    break;
                case "file":
                    f_content += '<fieldset id="fieldset_'+id+'" class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="file" class="uniform" id="'+id+'" name="'+name+'" size="21" /></div></fieldset>';
                    break;
                default:
                    f_content += '<fieldset id="fieldset_'+id+'" class="label_side top"><label for="'+name+'" style="line-height:none;">'+subtitle[0]+'<span>'+subtitulo+'</span></label><div class="clearfix"><input type="'+tipo+'" class="text '+clase+'" '+ancho+' name="'+name+'" id="'+id+'" value="'+defaultVal+'" placeholder="'+placeholder+'" '+maxLength+' '+sololectura+' /></div></fieldset>';
                    break;
            }
        }
        var respuesta = {
            f_componentes   :   f_content,
            v_reglas        :   req_rules,
            v_mensajes      :   req_msgs
        }
        return respuesta;
    },
    /*
    * Envía la información de la forma y pinta los resultados.
    */
    enviar_form : function(formulario){
        formulario.ajaxForm({
            beforeSubmit: function(formData, jqForm, options){
                showLoadingOverlay();
            },
            success: function(respuesta){
                formulario[0].reset();
                if(typeof respuesta.msg !== "undefined"){
                    dialog_alert(respuesta.msg);
                    if(typeof respuesta.accionPosterior !== "undefined"){
                        eval(respuesta.accionPosterior);
                    }
                }

                if( grids.generals.id_reporte !== "" ){
                    var grid_existente = grids.generals.id_reporte;
                    if( $( "#" + grid_existente ).length > 0 ){
                        var filtro_json = JSON.stringify( $("#form_filtros").serializeObject() );
                        grids.filtrarGrid(filtro_json,grid_existente);
                    }
                }

                hideLoadingOverlay();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                dialog_alert("Intermitencia en las comunicaciones");
                hideLoadingOverlay();
            },
            dataType: 'json'
        });
    }
};


// Probando función después de respuesta de la forma
function refreshAutos(){
    cargarVista('reporteIngresaAutos','formaAutos');
}
function refreshExtractos(){
    cargarVista('reporteIngresaExtQueja','formaQuejas');
}
/*
* Funciones generales para inserción de texto
*/
// -- Sólo acepta caracteres numéricos
function only_num(evt) { 
    var theEvent = evt || window.event; 
    var key = theEvent.keyCode || theEvent.which; 
    key = String.fromCharCode( key ); 
     var regex = /^[\b0-9\s]$/;
    if( !regex.test(key) ) { 
        theEvent.returnValue = false; 
        if(theEvent.preventDefault) theEvent.preventDefault(); 
    } 
}
// -- Sólo acepta texto
function only_text(evt) { 
    var theEvent = evt || window.event; 
    var key = theEvent.keyCode || theEvent.which; 
    key = String.fromCharCode( key ); 
     var regex = /^[\ba-zA-Z\s-áéíóúÁÉÍÓÚñÑ]$/;
    if( !regex.test(key) ) { 
        theEvent.returnValue = false; 
        if(theEvent.preventDefault) theEvent.preventDefault(); 
    }
}
// -- Sólo texto pero sin acentos
function only_text_sin_acento(evt){
    var theEvent = evt || window.event; 
    var key = theEvent.keyCode || theEvent.which; 
    key = String.fromCharCode( key ); 
     var regex = /^[\ba-zA-Z\s-ñÑ]$/;
    if( !regex.test(key) ) { 
        theEvent.returnValue = false; 
        if(theEvent.preventDefault) theEvent.preventDefault(); 
    }
}
// -- Sólo texto con algunos caracteres especiales
function to_textoespeciales(evt){
    var theEvent = evt || window.event; 
    var key = theEvent.keyCode || theEvent.which; 
    key = String.fromCharCode( key ); 
    var regex = /^[\ba-zA-Z\s-,.ñÑ]$/;
    if( !regex.test(key) ) { 
        theEvent.returnValue = false; 
        if(theEvent.preventDefault) theEvent.preventDefault(); 
    }
}
// -- Convierte el texto del input a mayúscula
function to_mayus(input){
	input.value = input.value.toUpperCase();
}

/* Alerta con .dialog de jQuery */
function dialog_alert(txtAlerta){
    $("#dialog-alert").html('<br/><div class="section" align="center"><h3 id="cont_alert"></h3></div>');
    if(txtAlerta.indexOf("<br/>") !== -1){
        res = txtAlerta.split('<br/>');
        $("#cont_alert").text(res[0]);
    } else{
        $("#cont_alert").html(txtAlerta);
    }
    $("#dialog-alert").dialog({
        resizable: false,
        modal: true,
        width: 600,
        buttons: {
            "Aceptar": function () {
                $(this).dialog('close');
            }
        }
    } );
    $("#dialog-alert").dialog("open");
}
