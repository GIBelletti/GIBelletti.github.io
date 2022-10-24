
class Objeto3D {
    constructor() {
        this.nombre = "";//debug
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
        this.colorBase = [0.0,0.0,0.0,0.0];
        this.trianglesIndexBuffer = null;
        this.matrizModelado = mat4.create();
        this.posición = vec3.fromValues(0.0,0.0,0.0);
        this.radioRotacion = 0.0;
        this.rotación = vec3.fromValues(0.0,0.0,0.0);
        this.escala = vec3.fromValues(1.0,1.0,1.0);
        this.hijos = []; // lista de objetos dependientes
        this.filas = 64;
        this.columnas = 64;
        this.funcionPosicion = null;
        this.matrizPadre = mat4.create();
        this.cerrado = false;

        this.actualizarMatrizModelado = function() {
            //console.log(this.matrizModelado);
            mat4.translate(this.matrizModelado, this.matrizModelado, this.posición);
            mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);
            mat4.rotate(this.matrizModelado, this.matrizModelado, this.radioRotacion, this.rotación);
            //console.log(this.matrizModelado);
            //console.log(this.posición);
        }
        
        this.obtenerNormalGenericaObjeto3D = function (funcionPosicion,alfa,beta,delta){
            var v1 = null;
            var v2 = null;
            let promedioP = function (a,b) {
                return (a + b) / 2;
            }
            switch (beta) {
                case 0.0:
                    var p1=funcionPosicion(alfa,beta);
                    var p2=funcionPosicion(alfa,beta+delta);
                    var p3=funcionPosicion(alfa+delta,beta);
                    var p4=funcionPosicion(alfa+delta,beta+delta);


                    v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
                    v2=vec3.fromValues(promedioP(p3[0]-p1[0],p4[0]-p2[0]),promedioP(p3[1]-p1[1],p4[1]-p2[1]),promedioP(p3[2]-p1[2],p4[2]-p2[2]));
                break;
                case 1.0:
                    var p1=funcionPosicion(alfa,beta-delta);
                    var p2=funcionPosicion(alfa,beta);
                    var p3=funcionPosicion(alfa+delta,beta-delta);

                    v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
                    v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);
                break;
                default:
                    var p1=funcionPosicion(alfa,beta);
                    var p2=funcionPosicion(alfa,beta+delta);
                    var p3=funcionPosicion(alfa+delta,beta);
    
                    v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
                    v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);
                break;
            }
/*
            if (beta == 0.0) {
                var p1=funcionPosicion(alfa,beta+delta);
                var p2=funcionPosicion(alfa,beta+delta);
                var p3=funcionPosicion(alfa+delta,beta);
                var p4=funcionPosicion(alfa+delta,beta);

                v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
                v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);
            }
            if (beta < 1.0) {
                var p1=funcionPosicion(alfa,beta);
                var p2=funcionPosicion(alfa,beta+delta);
                var p3=funcionPosicion(alfa+delta,beta);

                v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
                v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);
            } else {
                var p1=funcionPosicion(alfa,beta-delta);
                var p2=funcionPosicion(alfa,beta);
                var p3=funcionPosicion(alfa+delta,beta-delta);

                v1=vec3.fromValues(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
                v2=vec3.fromValues(p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]);
            }*/
            vec3.normalize(v1,v1);
            vec3.normalize(v2,v2);
            
            var n=vec3.create();
            vec3.cross(n,v1,v2);
            vec3.scale(n,n,-1);
            return n;
        }

        this.setupBuffers = function(rows,cols)
        {
            var pos=[];
            var normal=[];
            //var colorAlpha=[];
            //var colorNormales=[];
            //var color = null;
            var color = [];

            //let centro = this.funcionPosicion(0.5,0.5).map((x) => x/2);
            if (this.cerrado) {
                for (var i=0;i<rows/2;i++){
                    let gammaI=i/(rows-1);
                    let gammaF=((rows-1)-i)/(rows-1);
                    var pi=this.funcionPosicion(0.0,gammaI);
                    var pf=this.funcionPosicion(0.0,gammaF);
                    pos.push(pi[0]);
                    pos.push(pi[1]);
                    pos.push(pi[2]);
                    pos.push(pf[0]);
                    pos.push(pf[1]);
                    pos.push(pf[2]);
                    normal.push(0.0);
                    normal.push(0.0);
                    normal.push(1.0);
                    normal.push(0.0);
                    normal.push(0.0);
                    normal.push(1.0);
                    for (let j = 0; j < 6; j++) {
                        for (let k = 0; k < 4; k++) {
                            //colorAlpha.push(this.colorBase[k]);
                            color.push(this.colorBase[k]);
                        }
                        /*colorNormales.push(0.0);
                        colorNormales.push(0.0);
                        colorNormales.push(1.0);
                        colorNormales.push(1.0);*/
                    }
                }
            }

            for (var i=0;i<rows;i++){
                for (var j=0;j<cols;j++){
                    var alfa=j/(cols-1);
                    var beta=i/(rows-1);

                    var p=this.funcionPosicion(alfa,beta);

                    pos.push(p[0]);
                    pos.push(p[1]);
                    pos.push(p[2]);

                    var n=this.obtenerNormalGenericaObjeto3D(this.funcionPosicion,alfa,beta,1.0/Math.max(rows,cols));

                    normal.push(n[0]);
                    normal.push(n[1]);
                    normal.push(n[2]);
                    
                    for (let k = 0; k < 3; k++) {
                        for (let m = 0; m < 4; m++) {
                            //colorAlpha.push(this.colorBase[m]);
                            color.push(this.colorBase[m]);
                        }
                        /*colorNormales.push(n[0]/2+0.5);
                        colorNormales.push(n[1]/2+0.5);
                        colorNormales.push(n[2]/2+0.5);*/
                        /*colorNormales.push(n[0]);
                        colorNormales.push(n[1]);
                        colorNormales.push(n[2]);*/
                        //colorNormales.push(1.0);
                    }
                }

            }

            if (this.cerrado) {
                for (var i=0;i<rows/2;i++){
                    let gammaI=i/(rows-1);
                    let gammaF=((rows-1)-i)/(rows-1);
                    var pi=this.funcionPosicion(1.0,gammaI);
                    var pf=this.funcionPosicion(1.0,gammaF);
                    pos.push(pi[0]);
                    pos.push(pi[1]);
                    pos.push(pi[2]);
                    pos.push(pf[0]);
                    pos.push(pf[1]);
                    pos.push(pf[2]);
                    normal.push(0.0);
                    normal.push(0.0);
                    normal.push(-1.0);
                    normal.push(0.0);
                    normal.push(0.0);
                    normal.push(-1.0);
                    for (let j = 0; j < 6; j++) {
                        for (let k = 0; k < 4; k++) {
                            //colorAlpha.push(this.colorBase[k]);
                            color.push(this.colorBase[k]);
                        }
                        /*
                        colorNormales.push(0.0);
                        colorNormales.push(0.0);
                        colorNormales.push(0.0);
                        colorNormales.push(1.0);*/
                    }
                }
            }

  
            this.trianglesVerticeBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);    
        

            this.trianglesNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
/*
            if (modoColores == "color") {
                color = colorAlpha;
            } else {
                color = colorNormales;
            }*/

            this.trianglesColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesColorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

            var index=[];

            if (this.cerrado) {
                for (var i=0;i<(rows-1)*2;i++){
                    index.push(i*cols);
                    for (var j=0;j<cols-1;j++){
                        index.push(i*cols+j);
                        index.push((i+1)*cols+j);
                        index.push(i*cols+j+1);
                        index.push((i+1)*cols+j+1);
                    }
                    index.push((i+1)*cols+cols-1);
                }
            }
            else {
                for (var i=0;i<rows-1;i++){
                    index.push(i*cols);
                    for (var j=0;j<cols-1;j++){
                        index.push(i*cols+j);
                        index.push((i+1)*cols+j);
                        index.push(i*cols+j+1);
                        index.push((i+1)*cols+j+1);
                    }
                    index.push((i+1)*cols+cols-1);
                }
            }
            
            
            this.trianglesIndexBuffer = gl.createBuffer();
            this.trianglesIndexBuffer.number_vertex_point = index.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);    

            
            this.vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(this.vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            this.vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(this.vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
            gl.vertexAttribPointer(this.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            this.vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
            gl.enableVertexAttribArray(this.vertexColorAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesColorBuffer);
            gl.vertexAttribPointer(this.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
            
            //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
            //gl.drawElements(gl.TRIANGLE_STRIP, this.trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }

        this.setupVertexShaderMatrix = function(){
            //this.actualizarMatrizModelado();
            //let matriz = this.matrizModelado;
            var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
            //var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
            //var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
            //var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

            gl.uniformMatrix4fv(modelMatrixUniform, false, this.matrizModelado);
            //gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
            //gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
            //gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
        }                  

        //this.rotate_angle = 0.0;
        //this.ok = false;
        this.drawScene = function(){
            /*if (!this.ok) {
                this.ok = true;
                return;
            }*/
            this.setupVertexShaderMatrix();
            //console.log("objetodraw");//DEBUG
            
            vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesVerticeBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesNormalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            vertexColorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
            gl.enableVertexAttribArray(this.vertexColorAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.trianglesColorBuffer);
            gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

            //console.log(vistaUI_UV);
            var vista = null;
            if (vistaUI_UV=="base"){
                vista = gl.TRIANGLE_STRIP;
            }

            if (vistaUI_UV=="Lineas"){
                vista = gl.LINE_STRIP;
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.trianglesIndexBuffer);
            gl.drawElements(vista, this.trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);
        }
        //this.rotate_angle = 0.0;
        this.animate = function(){
            //console.log("animateObj");
            //this.rotate_angle += 0.001;
            mat4.identity(this.matrizModelado);
            /*if (this.nombre == "muro"){
                mat4.rotate(this.matrizModelado,this.matrizModelado, this.rotate_angle, [1.0, 0.0, 1.0]);
            }*/
            //mat4.multiply(this.matrizModelado, this.matPadre, this.matrizModelado);
            //this.actualizarMatrizModelado();
            //mat4.multiply(this.matrizModelado, this.matPadre, this.matrizModelado);

            var normalMatrix = mat4.create();

            mat4.identity(normalMatrix);
            mat4.multiply(normalMatrix,viewMatrix,this.matrizModelado);
            mat4.invert(normalMatrix,normalMatrix);
            mat4.transpose(normalMatrix,normalMatrix);

        }
        this.tick = function(){
            //requestAnimationFrame(this.tick);
            for (let i = 0; i < this.hijos.length; i++) {
                this.hijos[i].tick();
            }
            if (this.funcionPosicion) {
                this.drawScene();
                this.animate();
            }
        }
    }

    setColorBase = function(r,g,b,alpha){
        this.colorBase[0] = r;
        this.colorBase[1] = g;
        this.colorBase[2] = b;
        this.colorBase[3] = alpha;
    }
        
    setCerrado = function(){
        this.cerrado = true;
    }

    setearFilasColumnas = function (filasP, columnasP){
        this.filas = filasP;
        this.columnas = columnasP;
    }

    setearFuncionPosicion = function (funcionPosicionP){
        this.funcionPosicion = funcionPosicionP;
    }

    dibujar = function (matPadre) {
        //var m = mat4.create();
        mat4.identity(this.matrizModelado);
        this.actualizarMatrizModelado();
        this.matrizPadre = matPadre;
        //mat4.multiply(m, matPadre, this.matrizModelado);
        mat4.multiply(this.matrizModelado, matPadre, this.matrizModelado);
        //this.matrizModelado = m;
        //DEBUG
        /*console.log(this.nombre);
        console.log("matriz", this.matrizModelado);
        //console.log("m", m);
        console.log("matPadre", matPadre);*/
        //DEBUG
        //modQ.applyMatrix(f(m1));
        /*if (this.nombre == "escena"){
            console.log(this.hijos.length);
        }*/
        if (this.funcionPosicion) {
            this.setupBuffers(this.filas,this.columnas);
        }
        for (var i = 0; i < this.hijos.length; i++){
            this.hijos[i].dibujar(this.matrizModelado);
            //this.hijos[i].dibujar(m);
            //console.log(this.hijos[i].nombre);
        }
        //this.drawScene();
        //this.tick();
    };
    
    agregarHijo = function (h) {
        this.hijos.push(h);
    };

    quitarHijo = function (h) {
        this.hijos = this.hijos.filter(hijo => { return hijo !== h; });
    };

    getHijos = function (){
        return this.hijos;
    }

    setPosicion = function (x, y, z) {
        this.posición[0] = x;
        this.posición[1] = y;
        this.posición[2] = z;
    };

    setRotacion = function (x, y, z, rad) {
        this.rotación[0] = x;
        this.rotación[1] = y;
        this.rotación[2] = z;
        this.radioRotacion = rad;
    };

    setEscala = function (x, y, z) {
        this.escala[0] = x;
        this.escala[1] = y;
        this.escala[2] = z;
    };

    actualizar = function () {};
    actualizarTodo = function () {
        this.actualizar();
        for (let i = 0; i < this.hijos.length; i++) {
            this.hijos[i].actualizarTodo();
        }
    };
}

class Torre extends Objeto3D {
    constructor(){
        super();
        this.funcionPosicion = superficie_de_revolucion_parametrizada(puntosTorreMurallaParametrizada(alturaMuros+4.0));
        this.filas = 31;
        this.columnas = 11;
    }
    actualizar = function () {
        this.funcionPosicion = superficie_de_revolucion_parametrizada(puntosTorreMurallaParametrizada(alturaMuros+4.0));
        //console.log("torre");
    }
}

function dibujarCastillo(objeto){
    var castillo = new Objeto3D;
    castillo.setearFuncionPosicion(superficie_curvas_parametrizada_por_rectas(puntosCajaCastilloParametrizado(anchoDelCastillo,cantidadDePisos),largoDelCastillo,true));
    castillo.setearFilasColumnas(4,3);
    castillo.setCerrado();
    castillo.setColorBase(0.6,0.6,0.0,1.0);
    castillo.actualizar = function(){this.funcionPosicion=superficie_curvas_parametrizada_por_rectas(puntosCajaCastilloParametrizado(anchoDelCastillo,cantidadDePisos),largoDelCastillo,true);}
    objeto.agregarHijo(castillo);
}

function dibujarMuralla(objeto){
    var murallas = new Objeto3D();
    let dibujado = function (){
        for (let i = this.hijos.length-1; i >= 0; i--) {
            delete this.hijos[i];
        }
        this.hijos = [];
        let distanciaDelCentro = 30.0
        let angulo = (Math.PI * 2) / cantidadDeTorresMurallaExterior;
        let correccion = (angulo/2) * (1 + (cantidadDeTorresMurallaExterior-4)/2);
        //let angulo2 = angulo * 1.5;
        var posTorreXAnterior = distanciaDelCentro*-Math.cos(angulo*(cantidadDeTorresMurallaExterior-1)+correccion);
        var posTorreZAnterior = distanciaDelCentro*Math.sin(angulo*(cantidadDeTorresMurallaExterior-1)+correccion);
        for (let muros = 0; muros < cantidadDeTorresMurallaExterior; muros++) {
            let posTorreX = distanciaDelCentro*-Math.cos(angulo*muros+correccion);
            let posTorreZ = distanciaDelCentro*Math.sin(angulo*muros+correccion);
            let distanciaEntreTorres = distanciaVec2([posTorreXAnterior,posTorreZAnterior],[posTorreX,posTorreZ]);

            if (muros != 0) {
                //console.log("muro n",muros);
                var muro = new Objeto3D();
                muro.setearFuncionPosicion(superficie_curvas_parametrizada_por_rectas(puntosMurallaParametrizada(alturaMuros),distanciaEntreTorres,false));
                muro.setPosicion(posTorreX,0.0,posTorreZ);
                muro.setearFilasColumnas(65,2);
                muro.setRotacion(0.0,1.0,0.0,angulo*muros+angulo*(1 + 0.25*(cantidadDeTorresMurallaExterior-4)));
                muro.setColorBase(1.0,0.5,0.5,0.0);
                muro.actualizar = function(){this.funcionPosicion=superficie_curvas_parametrizada_por_rectas(puntosMurallaParametrizada(alturaMuros),distanciaEntreTorres,false);}
                this.agregarHijo(muro);
            } else {}

            //var torre = new Objeto3D();
            var torre = new Torre();
            torre.setearFuncionPosicion(superficie_de_revolucion_parametrizada(puntosTorreMurallaParametrizada(alturaMuros+4.0)));
            torre.setPosicion(posTorreX,0.0,posTorreZ);
            torre.setearFilasColumnas(33,16);
            torre.setColorBase(0.3,0.3,0.3,1.0);

            this.agregarHijo(torre);
            posTorreXAnterior = posTorreX;
            posTorreZAnterior = posTorreZ;
        }
    }
    murallas.actualizar = dibujado;
    murallas.actualizar();
    //murallas.setPosicion(10.0,0.0,0.0);
    objeto.agregarHijo(murallas);
}

function dibujarTerreno(objeto){
    var sueloInt = new Objeto3D();
    sueloInt.setearFuncionPosicion(superficie_de_revolucion_parametrizada(puntosPisoInternoParametrizado()));
    sueloInt.setearFilasColumnas(11,9);
    sueloInt.setColorBase(0.2,0.8,0.1,1.0);
    objeto.agregarHijo(sueloInt);

    var sueloExt = new Objeto3D();
    sueloExt.setearFuncionPosicion(superficie_de_revolucion_parametrizada(puntosPisoExternoParametrizado()));
    sueloExt.setearFilasColumnas(8,11);
    sueloExt.setColorBase(0.1,0.9,0.0,1.0);
    objeto.agregarHijo(sueloExt);

    var lago = new Objeto3D();
    lago.setearFuncionPosicion(superficie_de_revolucion_parametrizada(puntosLagoParametrizado()));
    lago.setearFilasColumnas(2,11);
    lago.setColorBase(0.1,0.0,0.9,1.0);
    objeto.agregarHijo(lago);

    var puente = new Objeto3D();
    puente.setearFuncionPosicion(superficie_curvas_parametrizada_por_rectas(puntosPuenteParametrizado(),30.0,false));
    puente.setearFilasColumnas(4,2);
    puente.setColorBase(0.4,0.4,0.1,1.0);
    puente.setPosicion(0.0,-1.0,35.0);
    objeto.agregarHijo(puente);
}

function dibujarTodo(){
    var escenario = new Objeto3D();

    dibujarTerreno(escenario);
    dibujarMuralla(escenario);
    dibujarCastillo(escenario);

    return escenario;
}