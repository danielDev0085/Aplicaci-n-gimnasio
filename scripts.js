/*----DECLARAR VARIABLES DEL FORMULARIO COMO GLOBALES----*/ 
var subscriberName,option,date;
var currentDate=new Date();
var cookieMessage=document.getElementById('cookieMessage');//span para los mensajes de cookies

/*----OBTENER VALORES DEL FORMULARIO----*/
function getDates() {
    subscriberName= document.getElementById("subscriberName").value;
    option= document.getElementById("option").value;
    date= document.getElementById("date").value;

    return subscriberName, option, date;
}

/*----REFRESCAR PANTALLA QUE USARÉ PARA VER MENSAJES Y BORRARLOS----*/
function reload() {
    location.reload(false);
}

/*----VALIDAR FORMATO----*/
function formValidate(evt) { 
    getDates(); //Obtener datos formulario
    let testName=/^[A-Za-z]+$/; //Expresión regular para el nombre
    let testDate=  /^202[3-4]{1}-[0-1]{1}[0-2]{1}-([0-2]{1}[0-9]{1}|[3]{1}[0-1]{1})$/; //Expresión regular para la fecha
    let selectedDate = new Date(date); //Obtener la fecha de la reserva

    message= document.forms['reserveForm']['reserve'].nextElementSibling; //span para poner mensajes
    
    // Comprobar expresiones regulares
    if (testDate.test(date) && testName.test(subscriberName)) {

        //Si el dia seleccionado es mayor o igual que el actual
        if (selectedDate >= currentDate) {
            evt.preventDefault(); //En este caso lo pongo para poder ver los mensajes.
            message.innerHTML="Fecha correcta y formato válido<br>";
            saveReservationCookie(); //Guardar datos de la reserva en cookie.
            setInterval('reload()', 6000);
        } else {
            evt.preventDefault(); //Evitar que se envíe el formulario
            message.innerHTML="Fecha anterior a la actual<br>";
            setInterval('reload()', 6000);
        }
    } else {
        evt.preventDefault(); //Evitar que se envíe el formulario
        message.innerHTML="Error en los datos introducidos<br>";
        setInterval('reload()', 6000);
    }
}

/*----VALIDAR FORMULARIO EN EVENTO----*/
function formEvent() {
    button=document.forms['reserveForm']['reserve']; // Obtener elemento botón
    button.addEventListener('click', formValidate, false);
}

//Llamar a la función para aplicarla al botón una vez se cargue la página
formEvent();


/*----GUARDAR RESERVA EN COOKIE----*/
function saveReservationCookie() {
    cookieMessage.innerHTML=''; //Resetear el span para mensaje de cookies
    
    getDates(); //Obtener datos formulario
    let cookieData=[subscriberName,option,date]; //Datos de cookie
    var currentDate=new Date(); //Fecha actual
    let dateCookie=new Date(date); //Fecha de la reserva
    let time = dateCookie-currentDate; //Milisegundos entre las fechas

    let expirationDate= new Date(currentDate.getTime()+time); //Obtener milisegundos para la fecha de la reserva
    let expires= 'expires=' + expirationDate.toUTCString(); // Pasar a String.
    //let expires=  'max-age=' + (time / 1000) ----  APUNTES PARA MÍ

    let encodedCookieData= encodeURIComponent(JSON.stringify(cookieData)); //Codificar los datos de cookieData (array) como JSON

    document.cookie= subscriberName+'='+encodedCookieData+ '; ' +expires+ ';path=/'; //Guardar cookie.

    cookieMessage.innerHTML='Nombre: '+ cookieData[0] +'<br>'+
                            'Clase: '+ cookieData[1] +'<br>'+
                            'Fecha: '+ cookieData[2] +'<br>';
                             
}

/*----LEER RESERVA DE COOKIE----*/
function readReservationCookie(name) {
    cookieMessage.innerHTML=''; //Resetear el span para mensaje de cookies

    let cookieName= name+'='; //Obtener el nombre de la cookie que se busca
    let decodedCookie= decodeURIComponent(document.cookie);//decodificar las cookies existentes en el documento
    let arrayCookie= decodedCookie.split(';'); //Dividir todas las cookies decodificadas (están separadas por ';') en un array

    for (let i=0; i<arrayCookie.length; i++) {
        let cookie=arrayCookie[i].trim(); //Obtener cada cookie del array sin los espacios sobrantes.

        if (cookie.indexOf(cookieName)===0) { //Si cookie comienza con el nombre pasado por parámetro
           let encodedData=cookie.substring(cookieName.length); //Obtener los datos codificados de la cookie
           let decodedData=decodeURIComponent(encodedData); //Descodificar dichos datos

           let reserveData=JSON.parse(decodedData); //Pasar la cadena JSON a array
           return reserveData;
        }
    }

    if (reserveData) {
        cookieMessage.innerHTML='Datos de la reserva: '+reserveData+'<br>';
    }else{
        cookieMessage.innerHTML='No se encuentran datos de la reserva<br>';
    }
}

/*----ELIMINAR RESERVA----*/
function removeReserve(cookieName) {
    cookieMessage.innerHTML=''; //Resetear el span para mensaje de cookies

    document.cookie=cookieName+ '=; expires=-1; path=/';
    cookieMessage.innerHTML='Cookie eliminada<br>';
    console.log('Cookie eliminada');
}


/*----AGREGAR EVENTO AL FORMULARIO----*/
window.addEventListener('load', start, false); //Cargar la función start después de cargar la página

function start() {
    let select=document.forms['reserveForm']['option'];
    select.addEventListener('blur', checkSelect, false);//Evento al salir del foco
}

function checkSelect(evt) {
    
    let select=evt.target; //Obtener elemento select
    let options=select.options; //Obtener opciones del select

    if (options.selectedIndex==0) { //Si el índice de las opciones es 0
            let text=select.nextElementSibling;
            text.innerHTML='Seleccione una opción';
        }else{
            let texto=select.nextElementSibling;
            texto.innerHTML='Correcto';
        } 
}