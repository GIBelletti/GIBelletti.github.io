
var app={
    alturaMaxima:10,
    reiniciar:function(){
        //alert("apreto reiniciar");
        //setupBuffers(superficie_curvas_parametrizada(puntosMurallaParametrizada(4.0), puntosMurallaRecorridoParametrizado(cantidadDeTorresMurallaExterior)));
        //setupVertexShaderMatrix();
        //delete objeto;
        //objeto = dibujarTodo();
        objeto.actualizarTodo();
        //torre.actualizarTodo();
    },
    detener:function(){
        alert("apreto detener");
    },
    modo:"random",
    ancho:0,
    umbral:100,
    samples:2
        
};
function dummy(){
    console.log("dummy function called");
}
var cantidadTotal = 1;
function GUI (){
    var gui = new dat.GUI();

    gui.add(window,"cantidadTotal",0,10);//¿eliminar?

    // definimos una carpeta comandos en la variable f1
    var f1 = gui.addFolder('Comandos');		//uso f1 como los botones de redibujar disparar etc

    //el metodo add recibe un objeto y el nombre del atributo o funcion en forma de STRING
    f1.add(app, 'reiniciar').name("Reiniciar");
    f1.add(app, 'detener').name("detener");

    // si se desea invocar a una funcion o una variable global, se pasa el parametro window como primer argumento
    f1.add(window, 'dummy').name("detener dummy");
    //f1.add(window, 'vistaUI_UV',["Normal","Textura","base","Lineas","Puntos"]).name("Modo de vista");
    f1.add(window, 'vistaUI_UV',["base","Lineas"]).name("Modo de vista");

    f1.open(); // hace que la carpeta f1 inicie abierta

    var f2 = gui.addFolder('Parametros generales');		//ver si fusiono f2 con f3 en parametros

    f2.add(app, 'alturaMaxima', 1.0, 60.0).name("altura maxima").step(1);
    f2.add(app, 'ancho',4,25).name("Ancho");

    f2.add(window, 'modoColores',["color","normal"]).name("pintura");


    var f3 = gui.addFolder('Parametros Especiales ');				
    f3.add(app,'umbral',0.0,200.0).name("umbral");
    f3.add(app,'samples',0,30).name("samples").onChange(function(v){

        console.log(" cambio el valor de app.samples a "+v);
    });
    var terreno = f3.addFolder('Terreno');	

    var castillo = f3.addFolder('Castillo');
    castillo.add(window,'cantidadDePisos',1,4).name("Cantidad de pisos").step(1);
    castillo.add(window,'anchoDelCastillo',10.0,25.0).name("Ancho del castillo").step(1);
    castillo.add(window,'largoDelCastillo',10.0,25.0).name("Largo del castillo").step(1);
    //var ventanas = castillo.addFolder('Ventanas');	
    //var torresCastillo = castillo.addFolder('Torres del castillo');	

    var murallas = f3.addFolder('Muralla');	
    murallas.add(window, 'alturaMuros', 3.0, 8.0).name("altura muros").step(0.5);
    //var muros = murallas.addFolder('Muros y puerta');//aca incluyo la puerta	
    //var torresMuralla = murallas.addFolder('Torres de la muralla');	
    murallas.add(window,"cantidadDeTorresMurallaExterior",4,8).name("Cantidad de torres").step(1);


    f2.open();
    f3.open();

};