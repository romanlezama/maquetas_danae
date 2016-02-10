var menu = {
	get_json : function (nameMenu){
		showLoadingOverlay();
		var espacio = $("#menu");
		$.getJSON('/maquetas/menus/'+nameMenu+'.json',{
                format: "json"
        }).done(function(data){
            menu.armar_menu(data, espacio);
        });
	},
	armar_menu : function ( menu, espacio ){
		for(var i=0; i<menu.length; i++){
			var submenus 	= menu[i]['submenus'], 
				label 		= menu[i]['leyendamenu'], 
				vista2load 	= menu[i]['accionmenu'], 
	        	textSubmenus= "", 
	        	clase_li 	= 'class="has_dropdown"', 
	        	clase_ul 	= 'class="open_multiple dropdown"';
	       	if(submenus.length > 0){
	            for(j=0; j<submenus.length; j++){
	                var clase_disable = (submenus[j]['deshabilitado'] == "T") ? "disabled-link" : "";
	                var submenus_n3 = submenus[j]['submenus'], 
	                	vista2load_2= submenus[j]['accionmenu'], 
	                	label_2 	= submenus[j]['leyendamenu'];
	                if(submenus_n3.length > 0){
	                    var txtSubmenus_n3 = "";
	                    for(n3=0; n3<submenus_n3.length; n3++){
	                    	var vista2load_3 	= submenus_n3[n3]['accionmenu'], 
	                    		label_3 		= submenus_n3[n3]['leyendamenu'];
	                        txtSubmenus_n3 += '<li><a class="hide_mobile" href="javascript:'+vista2load_3+'"><span>'+label_3+'</span></a></li>';
	                    }
	                    textSubmenus += '<li class="has_drawer"><a class="hide_mobile" href="#"><span>'+label_2+'</span></a><ul class="drawer " style="display: none;">'+txtSubmenus_n3+'</ul></li>';
	                } else{
	                    textSubmenus += '<li><a class="'+clase_disable+'" href="javascript:'+vista2load_2+'" class="pjax"><span>'+label_2+'</span></a></li>';
	                }
	            }
	            espacio.append('<li '+clase_li+'><a href="#"><img src="/static/depjud/Adminica2/images/icons/small/grey/create_write.png"><span>'+label+'</span></a><ul '+clase_ul+'>'+textSubmenus+'</ul></li>');
	        } else {
	            espacio.append('<li style="background-color:#576835; color: white !important;"><a href="javascript:'+vista2load+'"><img src="/static/depjud/Adminica2/images/icons/small/grey/create_write.png"><span>'+label+'</span></a></li>');
	        }
		}
		var txt_ayuda = '<li><a href="'+RUTA_WEB_SERVIDOR+'/ayuda/ManualDeOperacionJuzgados.pdf" target="_blank" class="pjax"><span>Manual</span></a></li>'+
						'<li><a href="'+RUTA_WEB_SERVIDOR+'/ayuda/PreguntasFrecuentes.pdf" target="_blank" class="pjax"><span>Preguntas Frecuentes</span></a></li>';
		espacio.append('<li class="has_dropdown"><a href="#"><img src="/static/depjud/Adminica2/images/icons/small/grey/create_write.png"><span>Ayuda</span></a><ul class="open_multiple dropdown">'+txt_ayuda+'</ul></li>');

		espacio.append('<li style="float:right; background-color:#576835; color: white !important;"><a href="javascript:cerrarSesion()" id="linkSalir"><img src="/static/depjud/Adminica2/images/icons/small/grey/exit.png"><span>Cerrar sesión</span></a></li>');
	    $(".disabled-link").click(function(event) { //Opción deshabilitada
	        event.preventDefault();
	    });
		//---------------- Esto para que funcione los submenús nivel 3 -------------------------------------
	    $(".dropdown_menu > ul > li").each(function(){
			$(this).children("ul").addClass("dropdown").parent().addClass("has_dropdown");
		});
		$("ul.drawer").parent("li").addClass("has_drawer");
		$(".has_drawer > a").bind('click',function(){
			var menuType = ($(this).parent().parent().hasClass("open_multiple"));
			if (menuType != true){
				$(this).parent().siblings().removeClass("open").children("ul.drawer").slideUp();
			}
			$(this).parent().toggleClass("open").children("ul").slideToggle();
			return false;
		});
		//---------------------------------------------------------------------------------
		hideLoadingOverlay();
	}
};