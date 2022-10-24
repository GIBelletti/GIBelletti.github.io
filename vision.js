
function vision(){
    
    var posicion = [0.0,-1.0,0.0];//posicion relativa a la inicial
    var posicion_castillo = [0.0,-1.0,0.0];
    var angulo_FP = 0.0;//[0;2Pi]
    var angulo_sup_FP = 0.0;//[0;Pi/2]
    var velocidad_de_rotacion = Math.PI/36;
    var velocidad_de_traslacion = 0.1;
    var posicion_catapulta = [20.0, -1.0, -60.0];
    var vision_actual = "prueba";
    var radio = 5.0;
    var angulo_alfa = 0.0;//[0;2Pi]
    var angulo_beta = 0.0;//[0;Pi/2]
    //let inicial = mat4.create();
    var isMouseDown = false;
    var mouseX = 0.0;
    var mouseY = 0.0;

    $("body").mousemove(function(e){ 
        if (!isMouseDown) {
            return;
        }
		mouseX = e.clientX || e.pageX; 
		mouseY = e.clientY || e.pageY;
        if (vision_actual == "primeraPersona") {
            angulo_FP = ((mouseX / 900) - 0.5) * (Math.PI * 2);
            angulo_sup_FP = (mouseY / 300) * (Math.PI / 2) - (Math.PI / 2);
            //console.log("x",angulo_FP);
            //console.log("y",angulo_sup_FP);
            viewMatrix = mat4.create();
            //mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, -1.0, 0.0]);
            mat4.rotate(viewMatrix,viewMatrix,angulo_sup_FP, [1.0, 0.0, 0.0]);
            mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, 1.0, 0.0]);
            mat4.translate(viewMatrix,viewMatrix, posicion);
        }
	});
	
    $('body').mousedown(function(event){		
        isMouseDown = true;        
    });

    $('body').mouseup(function(event){
		isMouseDown = false;		
    });

    $('body').on("keydown",function(event){
        //console.log(event);
        switch(event.key){
            case "1"://vista orbital general
                radio = 25.0;
                angulo_alfa = 0.0;
                angulo_beta = 0.0;
                viewMatrix = viewMatrix_FP;
                mat4.identity(viewMatrix);
                mat4.translate(viewMatrix,viewMatrix, [posicion_castillo[0],posicion_castillo[1],posicion_castillo[2]-radio]);
                vision_actual = "orbital";
            break;
            case "2"://vista orbital catapulta
                angulo_alfa = 0.0;
                angulo_beta = 0.0;
                radio = 5.0;
                viewMatrix = viewMatrix_FP;
                mat4.identity(viewMatrix);
                mat4.translate(viewMatrix,viewMatrix, [posicion_catapulta[0],posicion_catapulta[1],posicion_catapulta[2]-radio]);
                vision_actual = "orbitalCatapulta";
            break;
            case "3"://vista primera persona
                //posicion = [0.0,0.0,-5.0];
                angulo_FP = 0.0;
                viewMatrix = viewMatrix_FP;
                mat4.identity(viewMatrix);
                mat4.translate(viewMatrix,viewMatrix, posicion);
                vision_actual = "primeraPersona";
            break;
            case "4"://vista prueba
                posicion = [0.0,0.0,0.0];
                viewMatrix = mat4.create()
                mat4.identity(viewMatrix);
                mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -5.0]);
                vision_actual = "prueba";
            break;

            case "a":
                //origin.position.x+=derecha.x;
                //origin.position.z+=derecha.z;
                if (vision_actual == "primeraPersona") {
                    viewMatrix = mat4.create();
                    posicion[0] += velocidad_de_traslacion * Math.cos(angulo_FP);
                    posicion[2] += velocidad_de_traslacion * Math.sin(angulo_FP);
                    //mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, -1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_sup_FP, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, 1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, posicion);
                }
                if (vision_actual == "orbital") {
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    angulo_alfa -= velocidad_de_rotacion;
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                }
                if (vision_actual == "orbitalCatapulta") {
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta.map(x => {return -x;}));
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    angulo_alfa -= velocidad_de_rotacion;
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta);
                }
            break;
            case "d":
                //origin.position.x-=derecha.x;
                //origin.position.z-=derecha.z;
                if (vision_actual == "primeraPersona") {
                    viewMatrix = mat4.create();
                    posicion[0] -= velocidad_de_traslacion * Math.cos(angulo_FP);
                    posicion[2] -= velocidad_de_traslacion * Math.sin(angulo_FP);
                    //mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, -1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_sup_FP, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, 1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, posicion);
                }
                if (vision_actual == "orbital") {
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    angulo_alfa += velocidad_de_rotacion;
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                }
                if (vision_actual == "orbitalCatapulta") {
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta.map(x => {return -x;}));
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    angulo_alfa += velocidad_de_rotacion;
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta);
                }
            break;


            case "w":
                //origin.position.x+=adelante.x;
                //origin.position.z+=adelante.z;
                if (vision_actual == "primeraPersona") {
                    viewMatrix = mat4.create();
                    posicion[2] += velocidad_de_traslacion * Math.cos(angulo_FP);
                    posicion[0] -= velocidad_de_traslacion * Math.sin(angulo_FP);
                    //mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, -1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_sup_FP, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, 1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, posicion);
                }
                if (vision_actual == "orbital") {
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [-1.0, 0.0, 0.0]);
                    if (angulo_beta > Math.PI/2 - velocidad_de_rotacion) {
                        angulo_beta = Math.PI/2
                    } else {
                        angulo_beta += velocidad_de_rotacion;
                    }
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                }
                if (vision_actual == "orbitalCatapulta") {
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta.map(x => {return -x;}));
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [-1.0, 0.0, 0.0]);
                    if (angulo_beta > Math.PI/2 - velocidad_de_rotacion) {
                        angulo_beta = Math.PI/2
                    } else {
                        angulo_beta += velocidad_de_rotacion;
                    }
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta);
                }
            break;  
            case "s":
                //origin.position.x-=adelante.x;
                //origin.position.z-=adelante.z;
                if (vision_actual == "primeraPersona") {
                    viewMatrix = mat4.create();
                    posicion[2] -= velocidad_de_traslacion * Math.cos(angulo_FP);
                    posicion[0] += velocidad_de_traslacion * Math.sin(angulo_FP);
                    //mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, -1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_sup_FP, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, 1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, posicion);
                }
                if (vision_actual == "orbital") {
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [-1.0, 0.0, 0.0]);
                    if (angulo_beta < velocidad_de_rotacion) {
                        angulo_beta = 0.0
                    } else {
                        angulo_beta -= velocidad_de_rotacion;
                    }
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                }
                if (vision_actual == "orbitalCatapulta") {
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta.map(x => {return -x;}));
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [-1.0, 0.0, 0.0]);
                    if (angulo_beta < velocidad_de_rotacion) {
                        angulo_beta = 0.0
                    } else {
                        angulo_beta -= velocidad_de_rotacion;
                    }
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix,posicion_catapulta);
                }
            break;
            case "e":
                //origin.rotation.y+=0.1;
                if (vision_actual == "primeraPersona") {
                    viewMatrix = mat4.create();
                    angulo_FP += velocidad_de_rotacion;
                    //angulo_FP = mod(angulo_FP,Math.PI*2);
                    //mat4.translate(viewMatrix,viewMatrix, posicion.map(x => -x));
                    mat4.rotate(viewMatrix,viewMatrix,angulo_sup_FP, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, 1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, posicion);
                }
                if (vision_actual == "orbital") {
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [-1.0, 0.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, radio]);
                    if (radio < velocidad_de_traslacion){
                        radio = 0;
                    }
                    else {
                        radio -= velocidad_de_traslacion;
                    }
                    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -radio]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                }
                if (vision_actual == "orbitalCatapulta") {
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [-1.0, 0.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, radio]);
                    if (radio < velocidad_de_traslacion){
                        radio = 0;
                    }
                    else {
                        radio -= velocidad_de_traslacion;
                    }
                    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -radio]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                }
            break; 
            case "q":
                //origin.rotation.y-=0.1;
                if (vision_actual == "primeraPersona") {
                    viewMatrix = mat4.create();
                    angulo_FP -= velocidad_de_rotacion;
                    //angulo_FP = mod(angulo_FP,Math.PI*2);
                    //mat4.translate(viewMatrix,viewMatrix, posicion.map(x => -x));
                    mat4.rotate(viewMatrix,viewMatrix,angulo_sup_FP, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_FP, [0.0, 1.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, posicion.map(x => x));
                }
                if (vision_actual == "orbital" || vision_actual == "orbitalCatapulta") {
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, 1.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [-1.0, 0.0, 0.0]);
                    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, radio]);
                    radio += velocidad_de_traslacion;
                    mat4.translate(viewMatrix,viewMatrix, [0.0, 0.0, -radio]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_beta, [1.0, 0.0, 0.0]);
                    mat4.rotate(viewMatrix,viewMatrix,angulo_alfa, [0.0, -1.0, 0.0]);
                }
            break;                                        
            case "p"://debug
                if (vision_actual == "primeraPersona") {
                    console.log(posicion);
                    console.log(viewMatrix);
                }
                if (vision_actual == "orbital") {
                    console.log("radio = "+radio)
                    console.log(viewMatrix);
                }
            break; 
            case "z":
                if (isMouseDown) {
                    isMouseDown = false;
                } else {
                    isMouseDown = true;
                }
                console.log("mouse: ",isMouseDown);
            break;
        }
            
    });    
    
}