
function curva_de_bezie_cubica(u, puntosDeControl, offset=0){
    Base0=function(u) { return (1-u)*(1-u)*(1-u);}  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3
    Base1=function(u) { return 3*(1-u)*(1-u)*u; } // 3*(1-u)*(u-u2) , 3*(u-u2-u2+u3), 3u -6u2+2u3
    Base2=function(u) { return 3*(1-u)*u*u;} //3u2-3u3
    Base3=function(u) { return u*u*u; }

    // derivada primera
    Base0der=function(u) { return -3*u*u+6*u-3;} //-3u2 +6u -3
    Base1der=function(u) { return 9*u*u-12*u+3; }  // 9u2 -12u +3
    Base2der=function(u) { return -9*u*u+6*u;}		 // -9u2 +6u
    Base3der=function(u) { return 3*u*u; }			// 3u2

    
    // derivada segunda
    Base0der2=function(u) { return -6*u+6;} //-6u +6
    Base1der2=function(u) { return 18*u-12; }  // 18u -12
    Base2der2=function(u) { return -18*u+6;}		 // -18u +6
    Base3der2=function(u) { return 6*u; }			// 6u

    
	var curvaCubica = function(u,puntosDeControl){

		var p0=puntosDeControl[offset*3];
		var p1=puntosDeControl[offset*3+1];
		var p2=puntosDeControl[offset*3+2];
		var p3=puntosDeControl[offset*3+3];

		var x=Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
		var y=Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
		var z=Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];
		var punto=[x,y,z];

		return punto;
	}

	var curvaCubicaDerivadaPrimera = function (u,puntosDeControl){

		var p0=puntosDeControl[0];
		var p1=puntosDeControl[1];
		var p2=puntosDeControl[2];
		var p3=puntosDeControl[3];

		var x=Base0der(u)*p0[0]+Base1der(u)*p1[0]+Base2der(u)*p2[0]+Base3der(u)*p3[0];
		var y=Base0der(u)*p0[1]+Base1der(u)*p1[1]+Base2der(u)*p2[1]+Base3der(u)*p3[1];
		var z=Base0der(u)*p0[2]+Base1der(u)*p1[2]+Base2der(u)*p2[2]+Base3der(u)*p3[2];
		var punto=[x,y,z];

		return punto;
	}

	var curvaCubicaDerivadaSegunda = function (u,puntosDeControl){

		var p0=puntosDeControl[0];
		var p1=puntosDeControl[1];
		var p2=puntosDeControl[2];
		var p3=puntosDeControl[3];

		var x=Base0der2(u)*p0[0]+Base1der2(u)*p1[0]+Base2der2(u)*p2[0]+Base3der2(u)*p3[0];
		var y=Base0der2(u)*p0[1]+Base1der2(u)*p1[1]+Base2der2(u)*p2[1]+Base3der2(u)*p3[1];
		var z=Base0der2(u)*p0[2]+Base1der2(u)*p1[2]+Base2der2(u)*p2[2]+Base3der2(u)*p3[2];
		var punto=[x,y,z];

		return punto;
	}

    /*var p = curvaCubica(u,puntosDeControl);
    var tg = curvaCubicaDerivadaPrimera(u,puntosDeControl);
    var n = curvaCubicaDerivadaSegunda(u,puntosDeControl);

    for (let i = 0; i < tg.length; i++) {
        if (tg[i] * n[i] >= 0) {
            n[i] *= -1;
        }
    }

    return [p, tg, n]*/
    return [curvaCubica(u,puntosDeControl), curvaCubicaDerivadaPrimera(u,puntosDeControl), curvaCubicaDerivadaSegunda(u,puntosDeControl)]
}

function normalizar(vector){
    var normal = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2])
    return vector.map(x => x / normal);
}

function inversion_por_eje(punto, vector, eje){
    if (punto[eje] * vector[eje] < 0) {
        return vector.map(x => x * -1);
    }
    return vector;
}

function normal_por_multiplicacion_vectorial(tangente_u, tangente_v){
	var x = tangente_u[1] * tangente_v[2] - tangente_u[2] * tangente_v[1];
	var y = tangente_u[2] * tangente_v[0] - tangente_u[0] * tangente_v[2];
	var z = tangente_u[0] * tangente_v[1] - tangente_u[1] * tangente_v[0];
	return [x, y, z];
}

function normal_por_eje_nulo(tangente, eje){
	var vectorBinormal = [0,0,0];
	vectorBinormal[eje] += 1;
	return normal_por_multiplicacion_vectorial(tangente, vectorBinormal);
}

function discretizador_bezie_cubico(puntosDeControl, delta_u){
    var listaDePuntos = [];
    var listaDeTangentes = [];
    var listaDeNormales = [];
    for (let u = 0; u < 1; u += delta_u) {
        let valores = curva_de_bezie_cubica((u / delta_u), puntosDeControl);
        listaDePuntos.push(valores[0]);
        listaDeTangentes.push(valores[1]);
        listaDeNormales.push(inversion_por_eje(valores[0], normalizar(valores[2]), 0));
    }
    let valores = curva_de_bezie_cubica(1.0, puntosDeControl);
    listaDePuntos.push(valores[0]);
    listaDeTangentes.push(valores[1]);
    listaDeNormales.push(inversion_por_eje(valores[0], normalizar(valores[2]), 0));
	return [listaDePuntos, listaDeTangentes, listaDeNormales];
}

function curva_de_bezie_cubica_compuesta(u, puntosDeControl){
    let cantidadDeCurvas = ((puntosDeControl.length - 4) / 3) + 1;
    //console.log("cant",cantidadDeCurvas);
    var uPrima = u * cantidadDeCurvas;
    //console.log("u",(uPrima % 1.0));
    //console.log("curva",Math.floor(uPrima));
    var ultimoU = (uPrima % 1.0);
    var numeroDeCurva = Math.floor(uPrima)
    if (uPrima % 1.0 == 0.0 && u != 0.0) {
        ultimoU = 1.0;
        numeroDeCurva-=1;
    }
    if (cantidadDeCurvas <= numeroDeCurva) {
        //console.log("posible_falla");
        numeroDeCurva = 0;
    }
    //console.log("posible_falla",ultimoU,numeroDeCurva);
    return curva_de_bezie_cubica(ultimoU, puntosDeControl,numeroDeCurva);
}

function discretizador_curva_de_bezie_cubica_compuesta(puntosDeControl, delta_u){
    if (puntosDeControl.length == 4) {
        return discretizador_bezie_cubico(puntosDeControl, delta_u);
    }
    let cantidadDeCurvas = ((puntosDeControl.length - 4) / 3) + 1;
    var listaDePuntos = [];
    var listaDeTangentes = [];
    var listaDeNormales = [];
    for (let nCurva = 0; nCurva < cantidadDeCurvas; nCurva++) {
        for (let u = 0; u < 1; u += delta_u) {
            let valores = curva_de_bezie_cubica((u / delta_u), puntosDeControl,nCurva);
            listaDePuntos.push(valores[0]);
            listaDeTangentes.push(valores[1]);
            listaDeNormales.push(inversion_por_eje(valores[0], normalizar(valores[2]), 0));
        }
        let valores = curva_de_bezie_cubica(1.0, puntosDeControl,nCurva);
        listaDePuntos.push(valores[0]);
        listaDeTangentes.push(valores[1]);
        listaDeNormales.push(inversion_por_eje(valores[0], normalizar(valores[2]), 0));
    }
	return [listaDePuntos, listaDeTangentes, listaDeNormales];
}

function cosenoAngularR2(v1,v2){
    normaV1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
    normaV2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
    v1Porv2 = v1[0] * v2[0] + v1[1] * v2[1];
    resultado = v1Porv2 / (normaV1 + normaV2);
    /*if (resultado == 0.0) {
        return 1.0;
    }*/
    return resultado;
}
function anguloEntreVectoresR2(v1,v2){
    let normaV1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
    let normaV2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
    let v1Porv2 = v1[0] * v2[0] + v1[1] * v2[1];
    var resultado = Math.acos(v1Porv2 / (normaV1 + normaV2));
    /*if (resultado == 0.0) {
        return 1.0;
    }*/
    /*if (v1[1] < 0.0 || v1[0] < 0.0) {
        resultado += Math.PI;
    }*/
    if (v1Porv2 <= 0.0) {
        resultado += Math.PI;
    }
    return resultado;
}


//SUPERFICIE DE REVOLUCION
function superficie_de_revolucion_parametrizada(puntos){
    //La curva de bezie no genera un circulo perfecto usar SOLO para circunferencias
    return function superficie_de_revolucion(u,v){
        let valores = curva_de_bezie_cubica_compuesta(v, puntos);
        var u_prima = u * Math.PI*2.0;
        var x = valores[0][0] * Math.cos(u_prima);
        var z = valores[0][0] * Math.sin(u_prima);
        var y = valores[0][1];
        return [x, y, z];
    }
}
//SUPERFICIES CURVAS
function superficie_curvas_parametrizada(puntosForma,puntosTrayecto){
    return function superficie_curvas(u,v){
        let valoresForma = curva_de_bezie_cubica_compuesta(v, puntosForma);
        let valoresTrayecto = curva_de_bezie_cubica_compuesta(u, puntosTrayecto);
        //let valoresTrayectoTg = curva_de_bezie_cubica_compuesta(u+0.001, puntosTrayecto);
        //let valoresFormaN = curva_de_bezie_cubica_compuesta(v+0.001, puntosTrayecto);
        //var angulo = 0.0;
        var x = (valoresForma[0][0] * Math.cos(u * Math.PI*2.0)) + valoresTrayecto[0][0];
        var z = (valoresForma[0][0] * Math.sin(u * Math.PI*2.0)) + valoresTrayecto[0][2];
        //let angulo = anguloEntreVectoresR2([valoresTrayecto[2][0],valoresTrayecto[2][2]], [0,1]);
        /*let angulo = valoresTrayecto[1][2]/valoresTrayecto[1][0];
        var x = (valoresForma[0][0] * Math.cos(angulo)) + valoresTrayecto[0][0];
        var z = (valoresForma[0][0] * Math.sin(angulo)) + valoresTrayecto[0][2];*/
        //let angulo = anguloEntreVectoresR2([valoresTrayecto[1][0],valoresTrayecto[1][2]], [valoresForma[2][0],valoresForma[2][2]]);
        /*let angulo = -anguloEntreVectoresR2([valoresTrayectoTg[0][0]-valoresTrayecto[0][0],valoresTrayectoTg[0][2]-valoresTrayecto[0][2]], [1,0]);
        var x = (valoresForma[0][0] * Math.cos(angulo)) + valoresTrayecto[0][0];
        var z = (valoresForma[0][0] * Math.sin(angulo)) + valoresTrayecto[0][2];*/
        var y = valoresForma[0][1] + valoresTrayecto[0][1];
        return [x, y, z];
    }
}
//SUPERFICIES RECTAS
function superficie_curvas_parametrizada_por_rectas(puntosForma, longitud, centrada=true){
    return function superficie_curvas(u,v){
        let valoresForma = curva_de_bezie_cubica_compuesta(v, puntosForma);
        /*let valoresTrayecto = curva_de_bezie_cubica_compuesta(u, puntosTrayecto);
        var x = valoresForma[0][0] + v;
        var z = valoresForma[0][0] + v;
        var y = valoresForma[0][1] + valoresTrayecto[0][1];*/
        var u_prima = u;
        if (centrada) {
            u_prima = (u-0.5) * longitud;
        } else {
            u_prima = u * longitud;
        }
        var x = valoresForma[0][0];
        //var z = valoresForma[0][0]+u_prima;
        var z = u_prima;
        var y = valoresForma[0][1];
        return [x, y, z];
    }
}

function distanciaVec2(vec1, vec2){
    let x1 = vec1[0],
    x2 = vec2[0],
    y1 = vec1[1],
    y2 = vec2[1];
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}
/*
class Superficie_de_revolucion{
    constructor(puntosDeControl, angulo){
        this.puntosDeControl = puntosDeControl;
        this.angulo = angulo;
    }

    getPosicion(){
        //let valores = curva_de_bezie_cubica(v, this.puntosDeControl);
        //var u_prima = u * this.angulo;
        //var x = valores[0][0] * Math.cos(u_prima);
        //var z = valores[0][0] * Math.sin(u_prima);
        //var y = valores[0][1];
        //return [x, y, z];
        let puntosDeControl = this.puntosDeControl;
        let angulo = this.angulo;
        return function pos(u,v) {
            let valores = curva_de_bezie_cubica(v, puntosDeControl);
            var u_prima = u * angulo;
            var x = valores[0][0] * Math.cos(u_prima);
            var z = valores[0][0] * Math.sin(u_prima);
            var y = valores[0][1];
            return [x, y, z];
        };
    }

    getNormal(u,v){
        let valores = curva_de_bezie_cubica(v, this.puntosDeControl);
        var u_prima = u * this.angulo;
        var x = (Math.sin(u_prima) * (-1));
        var z = Math.cos(u_prima);
        return normalizar(normal_por_multiplicacion_vectorial(valores[1],[x,0,z]));
    }

    getCoordenadasTextura(u,v){
        return [u,v];
    }
}*/