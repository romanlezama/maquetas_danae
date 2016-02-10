var renders = {
	"mes_corto" : ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
	to_date : function(utime){
		if(utime === null){
	        return "";
	    } else{
	        var d = new Date(utime*1000);
	        var mes=d.getMonth();
	        var dia=d.getDate();
	        var anio=d.getFullYear();
	        dia = (dia<10) ? "0"+dia : dia;
	        var fechaArmada = dia+"-"+this.mes_corto[mes]+"-"+anio;
	        //return '<span style="display:none;">'+utime+'</span>'+fechaArmada;
	        return fechaArmada;
	    }
	},
	to_hour : function(utime){
	    if(utime==0 || utime == null){
	        return "";
	    } else{
	        var d = new Date(utime*1000);
	        var hora = d.getHours();
	        var minuto = d.getMinutes();
	        var segundo = d.getSeconds();
	        hora = (hora<10) ? "0"+hora : hora;
	        minuto = (minuto<10) ? "0"+minuto : minuto;
	        segundo = (segundo<10) ? "0"+segundo : segundo;
	        return hora+":"+minuto+":"+segundo;
	    }
	},
	to_datetime : function(utime){
	    if(utime === null){
	        return "";
	    } else{
	        var d = new Date(utime*1000);
	        var mes=d.getMonth();
	        var dia=d.getDate();
	        var anio=d.getFullYear();
	        var hora = d.getHours();
	        var minuto = d.getMinutes();
	        var segundo = d.getSeconds();
	        dia = (dia<10) ? "0"+dia : dia;
	        hora = (hora<10) ? "0"+hora : hora;
	        minuto = (minuto<10) ? "0"+minuto : minuto;
	        segundo = (segundo<10) ? "0"+segundo : segundo;
	        var fechaHora = dia+"-"+this.mes_corto[mes]+"-"+anio+" "+hora+":"+minuto+":"+segundo;
	        //return '<span style="display:none;">'+utime+'</span>'+fechaHora;
	        return fechaHora;
	    }
	},
	to_pesos : function(num) {
	    if(num === null){
	        return "";
	    } else {
	        num = num.toString().replace(/\$|\,/g,'');
	        if(isNaN(num))
	        num = "0";
	        sign = (num == (num = Math.abs(num)));
	        num = Math.floor(num*100+0.50000000001);
	        cents = num%100;
	        num = Math.floor(num/100).toString();
	        if(cents < 10)
	        cents = "0" + cents;
	        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
	        num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
	        return (((sign)?'':'-') + num + '.' + cents);
	    }
	},
    to_expediente : function(consecutivo, anio){
        if(consecutivo==null && anio==null){
            return "";
        } else {
            if(consecutivo == null){
                return anio;
            } else if(anio == null){
                return consecutivo
            } else{
                return consecutivo+"/"+anio;
            }
        }
    },
    to_checkbox : function ( id, name_to_send, status, id_datagrid ){
    	var sinChk 	= 	["reporteExtractosEP", "reporteExtractosCP"], 
    		chk 	= 	'<input type="checkbox" name="'+name_to_send+'" value="'+id+'"/>';
    	if( sinChk.indexOf( id_datagrid ) !== -1 ){
    		var retorno = ( status !== "por pagar" ) ? "" : chk;
    		return retorno;
    	} else {
    		return chk;
    	}
    }
};