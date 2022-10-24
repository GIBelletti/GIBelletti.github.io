/*
Escena
|-Castillo
| |-Pisos
| | |-Ventanas
| |
| |-TorresCastillo
|   |-TechoTorresCastillo
|   |-ParteSuperiorTorresCastillo
|   |-ParteInferiorTorresCastillo
|
|-Muralla
| |-TorresMuralla
| | |-TechoTorresCastillo
| | |-ParteSuperiorTorresCastillo
| | |-ParteInferiorTorresCastillo
| |
| |-MurosGenericosMuralla
| | |-ParteSuperiorMurosGenericosMuralla
| | |-ParteInferiorMurosGenericosMuralla
| |
| |-PuertaMuralla
|   |-MurosGenericosMuralla
|   | |-ParteSuperiorMurosGenericosMuralla
|   | |-ParteInferiorMurosGenericosMuralla
|   |
|   |-PortonPuertaMuralla
|     |-PuertaPortonPuertaMuralla
|     |-ArcoPortonPuertaMuralla
|
|-Catapulta
| |-Ruedas
| |-Ejes
| |-Proyectil
| |-Cajas
| |-Trapecios
|
|-Terreno
  |-TerrenoInterior
  |-TerrenoExterior
  |-TerrenoPuente
  |-TerrenoAgua

*/

/////////////////////////////////////////////////////////////////////////////////////////////////////
//PUNTO CENTRAL
function puntosCentro(){
    return [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//TORRE EXTERIOR
function puntosTorreMuralla(radioTotal, radioInterno, alturaBalcon, alturaBase, alturaBalconPiso){
    //6.0,5.0,2.0,9.0,1.0
    let alturaTotal = alturaBalcon + alturaBase;//11
    let alturaCurvaSuperior = alturaBase - 1;
    let alturaCurvaInferior = alturaCurvaSuperior / 2;
    let alturaInicial = alturaTotal - alturaBalconPiso;////10
    let diferenciaAlturaInicial = Math.abs(alturaTotal - alturaInicial);
    let radioBalcon = radioTotal - radioInterno;
    let tercioDeRadioBalcon = radioBalcon/3;
    let dosTerciosDeRadioBalcon = radioBalcon*2/3;
    var puntosTorreMuralla = [[0.0,alturaInicial,0.0],[radioInterno/3,alturaInicial,0.0],[radioInterno*2/3,alturaInicial,0.0],[radioInterno,alturaInicial,0.0],
                            [radioInterno,alturaInicial+diferenciaAlturaInicial/3,0.0],[radioInterno,alturaInicial+diferenciaAlturaInicial*2/3,0.0],[radioInterno,alturaTotal,0.0],
                            [radioInterno+tercioDeRadioBalcon,alturaTotal,0.0],[radioInterno+dosTerciosDeRadioBalcon,alturaTotal,0.0],[radioTotal,alturaTotal,0.0],
                            [radioTotal,alturaBase+alturaBalcon*2/3,0.0],[radioTotal,alturaBase+alturaBalcon/3,0.0],[radioTotal,alturaBase,0.0],
                            [radioInterno+dosTerciosDeRadioBalcon,alturaCurvaSuperior,0.0],[radioInterno+tercioDeRadioBalcon,alturaCurvaSuperior,0.0],[radioInterno,alturaCurvaSuperior,0.0],
                            [radioInterno,alturaCurvaInferior,0.0],[radioTotal,alturaCurvaInferior,0.0],[radioTotal,0.0,0.0]];
    return puntosTorreMuralla;
}

function puntosTorreMurallaParametrizada(altura){
    return puntosTorreMuralla(5.5,4.5,2.0,altura,1.0);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//MURALLA
function puntosMurallaForma(radioTotal, radioInterno, alturaBalcon, alturaBase, alturaBalconPiso){
    //6.0,5.0,2.0,9.0,1.0
    let alturaTotal = alturaBalcon + alturaBase;//11
    let alturaCurvaSuperior = alturaBase - 1;
    let alturaCurvaInferior = alturaCurvaSuperior / 2;
    let alturaInicial = alturaTotal - alturaBalconPiso;////10
    let diferenciaAlturaInicial = Math.abs(alturaTotal - alturaInicial);
    let radioBalcon = radioTotal - radioInterno;
    let tercioDeRadioBalcon = radioBalcon/3;
    let dosTerciosDeRadioBalcon = radioBalcon*2/3;
    var puntosDeMuralla = [[-radioTotal,0.0,0.0],[-radioTotal,alturaCurvaInferior,0.0],[-radioInterno,alturaCurvaInferior,0.0],[-radioInterno,alturaTotal,0.0],
    [-radioInterno+dosTerciosDeRadioBalcon,alturaTotal,0.0],[-radioInterno+tercioDeRadioBalcon,alturaTotal,0.0],[-radioBalcon,alturaTotal,0.0],
    [-radioBalcon,alturaInicial+diferenciaAlturaInicial*2/3,0.0],[-radioBalcon,alturaInicial+diferenciaAlturaInicial/3,0.0],[-radioBalcon,alturaInicial,0.0],
    [-tercioDeRadioBalcon,alturaInicial,0.0],[tercioDeRadioBalcon,alturaInicial,0.0],[radioBalcon,alturaInicial,0.0],
    [radioBalcon,alturaInicial+diferenciaAlturaInicial/3,0.0],[radioBalcon,alturaInicial+diferenciaAlturaInicial*2/3,0.0],[radioBalcon,alturaTotal,0.0],
    [radioInterno-tercioDeRadioBalcon,alturaTotal,0.0],[radioInterno-dosTerciosDeRadioBalcon,alturaTotal,0.0],[radioInterno,alturaTotal,0.0],
    [radioInterno,alturaCurvaInferior,0.0],[radioTotal,alturaCurvaInferior,0.0],[radioTotal,0.0,0.0]];//muralla completa
    return puntosDeMuralla;
}

function puntosMurallaParametrizada(altura){
    return puntosMurallaForma(3.0,2.0,2.0,altura,1.0);
}

function puntosMurallaRecorrido(cantidadDeAngulos, apertura,distanciaAlCentroNodo){
    //La cantidadDeAngulos sera entre 4 y 8
    let anguloEntreNodos = Math.PI * 2.0 / cantidadDeAngulos;
    var puntosRecorrido = [[distanciaAlCentroNodo * Math.cos(anguloEntreNodos * 0),0.0,0.0]]
    for (let angulo = 0; angulo < cantidadDeAngulos; angulo++) {
        puntosRecorrido.push([distanciaAlCentroNodo * Math.cos(anguloEntreNodos * angulo),0.0,distanciaAlCentroNodo * Math.sin(anguloEntreNodos * angulo)],
                            [distanciaAlCentroNodo * Math.cos(anguloEntreNodos * (angulo+1)),0.0,distanciaAlCentroNodo * Math.sin(anguloEntreNodos * (angulo+1))],
                            [distanciaAlCentroNodo * Math.cos(anguloEntreNodos * (angulo+1)),0.0,distanciaAlCentroNodo * Math.sin(anguloEntreNodos * (angulo+1))])
    }
    return puntosRecorrido;
}

function puntosMurallaRecorridoParametrizado(cantidadDeAngulos){
    return puntosMurallaRecorrido(cantidadDeAngulos, 7.0, 12.0)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//PORTON

/////////////////////////////////////////////////////////////////////////////////////////////////////
//PISO INTERNO
function puntosPisoInterno(radioTotal, radioSuperior, radioInferior, profundidadDeFoso){
    var puntosPisoInterno = [[0.0,0.0,0.0],[0.0,0.0,0.0],[radioSuperior,0.0,0.0],[radioSuperior,0.0,0.0],
    [radioSuperior,0.0,0.0],[radioInferior,-profundidadDeFoso,0.0],[radioInferior,-profundidadDeFoso,0.0],
    [radioInferior,-profundidadDeFoso,0.0],[radioTotal,-profundidadDeFoso,0.0],[radioTotal,-profundidadDeFoso,0.0]];
    return puntosPisoInterno;
}

function puntosPisoInternoParametrizado(){
    return puntosPisoInterno(51.0,40.0,45.0,5.0);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//PISO EXTERNO
function puntosPisoExterno(radioTotal, radioSuperior, radioInferior, radioInicial, profundidadDeFoso){
    var puntosPisoInterno = [[radioInicial,-profundidadDeFoso,0.0],[radioInicial,-profundidadDeFoso,0.0],[radioInferior,-profundidadDeFoso,0.0],[radioInferior,-profundidadDeFoso,0.0],
    [radioInferior,-profundidadDeFoso,0.0],[radioSuperior,0.0,0.0],[radioSuperior,0.0,0.0],
    [radioSuperior,0.0,0.0],[radioTotal,0.0,0.0],[radioTotal,0.0,0.0]];
    return puntosPisoInterno;
}

function puntosPisoExternoParametrizado(){
    return puntosPisoExterno(150.0,60.0,55.0,52.0,5.0);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//LAGO
function puntosLago(radioSuperior, radioInferior, profundidadDeLago){
    var puntosLago = [[radioInferior,-profundidadDeLago,0.0],[radioInferior,-profundidadDeLago,0.0],[radioSuperior,-profundidadDeLago,0.0],[radioSuperior,-profundidadDeLago,0.0]];
    return puntosLago;
}

function puntosLagoParametrizado(){
    return puntosLago(60.0,40.0,3.0);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//PUENTE
function puntosPuente(ancho,profundidad){
    let bordes = ancho / 2.0;
    var puntosLago = [[-bordes,-profundidad,0.0],[-bordes,-profundidad,0.0],[-bordes,0.0,0.0],[-bordes,0.0,0.0],
    [-bordes,0.0,0.0],[bordes,0.0,0.0],[bordes,0.0,0.0],
    [bordes,0.0,0.0],[bordes,-profundidad,0.0],[bordes,-profundidad,0.0],];
    return puntosLago;
}

function puntosPuenteParametrizado(){
    return puntosPuente(20.0,2.0);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//CASTILLO ESTRUCTURA
function puntosCajaCastillo(ancho, alturaPiso, cantidadDePisos){
    let bordes = ancho / 2.0;
    let alturaTotal = alturaPiso * cantidadDePisos;
    var puntos = [[-bordes,0.0,0.0],[-bordes,0.0,0.0],[-bordes,alturaTotal,0.0],[-bordes,alturaTotal,0.0],
    [-bordes,alturaTotal,0.0],[bordes,alturaTotal,0.0],[bordes,alturaTotal,0.0],
    [bordes,alturaTotal,0.0],[bordes,0.0,0.0],[bordes,0.0,0.0]];
    return puntos;
}

function puntosCajaCastilloParametrizado(ancho,cantidadDePisos){
    return puntosCajaCastillo(ancho,8.0,cantidadDePisos);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//CASTILLO TORRE
function puntosTorreCastillo(ancho, alturaPiso, cantidadDePisos){
    let bordes = ancho / 2.0;
    var puntos = [[]];
    return puntos;
}

function puntosTorreCastilloParametrizado(cantidadDePisos){
    return puntosTorreCastillo(60.0,40.0,cantidadDePisos);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//CASTILLO VENTANA
function puntosVentanaCastillo(ancho, alturaPiso, cantidadDePisos){
    let bordes = ancho / 2.0;
    var puntos = [[]];
    return puntos;
}

function puntosVentanaCastilloParametrizado(cantidadDePisos){
    return puntosVentanaCastillo(60.0,40.0,cantidadDePisos);
}