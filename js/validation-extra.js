$.validator.addMethod("sololetras", function(value, element) {
  return this.optional(element) || /^[\ba-zA-Z\s-áéíóúñÑ]+$/i.test(value);
}, "Debe introducir s\u00f3lo letras");

$.validator.addMethod("entero", function(value, element) {
  return this.optional(element) || /^[[0-9]+$/i.test(value);
}, "Debe introducir s\u00f3lo n\u00fameros");

$.validator.addMethod("moneda", function(value, element) {
  var bandera = this.optional(element) || /^(\d{1}\,)?(\d+\,?)+(.\d{2})?$/.test(value);
if (bandera){
  value = value.replace(/,/g,"");
  value = parseFloat(value);
	bandera = value > 0;
	if (!bandera){
		$.validator.messages['moneda'] ="El monto debe ser mayor a cero";
	}
}else{
	$.validator.messages['moneda'] = "El formato debe ser 0.00";
}
return bandera;
}, "Error");

$.validator.addMethod("entero_negypos", function(value, element) {
  return this.optional(element) || /^-?[0-9]+$/.test(value);
}, "Debe introducir s\u00f3lo n\u00fameros enteros, positivos o negativos");

$.validator.addMethod("nombre", function(value, element) {
  return this.optional(element) || /^[a-zA-Zá-úÁ-Ú'. ]+$/i.test(value);
}, "Debe introducir s\u00f3lo letras (pueden estar acentuadas)");

$.validator.addMethod("direccion", function(value, element) {
  return this.optional(element) || /^[a-zA-Zá-úÁ-Ú 0-9#,-.]+$/i.test(value);
}, "Debe introducir s\u00f3lo letras (pueden estar acentuadas)");

$.validator.addMethod("rfc", function(value, element) {
  return this.optional(element) || /^[A-Z,Ñ,&amp;]{3,4}\d{6}[0-9,A-Z]{3}$/i.test(value);
}, "El RFC debe tener el siguiente formato: AAAA991231BBB");

$.validator.addMethod("rfc_moral", function(value, element) {
  return this.optional(element) || /^[A-Z,Ñ,&amp;]{3}\d{6}[0-9,A-Z]{3}$/i.test(value);
}, "El RFC debe tener el siguiente formato: AAA991231BBB");

$.validator.addMethod("expediente", function(value, element) {
  return this.optional(element) || /^\d{1,4}[/]19\d{2}|\d{1,4}[/]20\d{2}$/i.test(value);
}, "El expediente debe tener el siguiente formato: 1234/2013");

$.validator.addMethod("curp", function(value, element) {
  return this.optional(element) || /^[a-zA-Z]{4}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}[a-zA-Z]{5}[0-9A-Z]{2}$/i.test(value);
}, "La CURP debe tener el siguiente formato: AAAA001122BBBBBBCC");

$.validator.addMethod("nas", function(value, element) {
  return this.optional(element) || /^51[0-9]{2}-[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}$/i.test(value);
}, "El NAS debe tener el siguiente formato: 5100-0000-0000-0000-000");

$.validator.addMethod("expedienteConsecutivo", function(value, element) {
  return this.optional(element) || /^[0-9]{1,6}$/.test(value);
}, "El expediente consecutivo debe tener el siguiente formato: 000000");	

$.validator.addMethod("expedienteAnio", function(value, element) {
  var bandera = this.optional(element) || /^[0-9]{4}$/.test(value);
  if (bandera){
  	var d = new Date();
  	bandera = value <= d.getFullYear();
  	if (!bandera){
  		$.validator.messages['expedienteAnio'] ="El expediente a\u00f1o no puede ser mayor al a\u00f1o actual";
  	}
  }else{
  	$.validator.messages['expedienteAnio'] = "El expediente a\u00f1o debe tener el siguiente formato: 0000";
  }
  return bandera;
}, "Error");

$.validator.addMethod("fechaResolucion", function(value, element) {
  var res = value.split("-");
  var c = new Date(res[2], res[1]-1, res[0]);
  var d = new Date();
  return (c <= d);
}, "La fecha de resoluci\u00f3n debe ser menor o igual al d\u00eda actual");

$.validator.addMethod("horaRemate", function(value, element){
  var fRemate = $("#fecha_remate").val();
  var hRemate = value+':00';
  var arFecha = fRemate.split("-");
  fRemate = arFecha[2]+'-'+arFecha[1]+'-'+arFecha[0];
  var fechaHoraRemate = new Date(fRemate+'T'+hRemate);
  var fechaActual = new Date();
  tsFecHorRem = Math.round(fechaHoraRemate.getTime()/1000);
  tsFecAct = Math.round(fechaActual.getTime()/1000);
  return (tsFecHorRem >= tsFecAct);
}, "La hora del remate debe ser mayor o igual a la actual");

$.validator.addMethod("acumulados", function(value, element){
  return this.optional(element) || /^(( |,| Y)? ?(A\.D\.|DPO|Q)? \d{1,5}\/\d{4})+$/i.test(value);
}, "El formato no es correcto");

$.validator.addMethod("anio", function(value, element){
  var bandera = this.optional(element) || /^(190\d|2(\d){3})$/i.test(value);
  if (bandera){
    var d = new Date();
    bandera = value <= d.getFullYear();
    if (!bandera){
      $.validator.messages['anio'] ="El a\u00f1o no puede ser mayor al a\u00f1o actual";
    }
  }else{
    $.validator.messages['anio'] = "El a\u00f1o debe tener 4 digitos y debe ser mayor a 1900";
  }
  return bandera;  
}, "El formato no es correcto");
