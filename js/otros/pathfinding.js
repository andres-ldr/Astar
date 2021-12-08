//1 ----------------------------------------------
var canvas;
var ctx; //contexto del canvas
var FPS = 50; //fotogramas

//ESCENARIO
var columnas = 50;
var filas = 50;
var escenario; // MATRIZ del nivel

//TILES
var anchoT;
var altoT;
const muro = '#000000';
const camino = '#777777';

//RUTA
var principio;
var fin;

var openSet = [];
var closedSet = [];

var ruta = [];
var terminado = false;

//3-------------------------------------------------
function crearArray2D(f,c){
    var obj = new Array(f);
    for(a = 0; a < f; a++){
        obj[a] = new Array(c);
    }
    return obj;
}
//7-------------------------------------------------
function heuristica(a,b){
    var x = Math.abs(a.x - b.x);
    var y = Math.abs(a.y - b.y);

    var distancia = x + y;
    return distancia;
}
//
function borrarDelArray(array, elemento){
    for(i=array.length-1; i>=0; i--){
        if(array[i] == elemento){
            array.splice(i,1);
        }
    }
}
//5-------------------OBJ casillas
function Casilla(x,y){

    //posicion
    this.x = x;    
    this.y = y;
    //tipo (obstaculo = 1, camino = 0)
    this.tipo = 0;

    var aleatorio = Math.floor(Math.random()*5); //0-4
    if(aleatorio == 1)
        this.tipo = 1;
    
    //PESOS
    this.f = 0; //(g+h)
    this.g = 0; //pasos dados
    this.h = 0;// heuristica

    this.vecinos = [];
    this.padre = null;
    //METODO PARA CALCULAR LOS VECINOS
    this.addVecinos = function(){
        if(this.x > 0)
            this.vecinos.push(escenario[this.y][this.x-1]);
        if(this.x < filas-1)
            this.vecinos.push(escenario[this.y][this.x+1]);
        if(this.y > 0)
            this.vecinos.push(escenario[this.y-1][this.x]);
        if(this.y < columnas-1)
            this.vecinos.push(escenario[this.y+1][this.x]);
    }
    //METODO QUE DIBUJA LA CASILLA
    this.dibuja = function(){
        var color;
        if(this.tipo == 0)
            color = camino;
        
        if(this.tipo == 1)
            color = muro;
        
        //DIBUJAR EN EL CANVAS
        ctx.fillStyle = color;
        ctx.fillRect(this.x*anchoT,this.y*altoT,anchoT,altoT);
    }
    //dibuja openSet
    this.dibujaOS = function(){
        ctx.fillStyle = '#008000'; //color del OS
        ctx.fillRect(this.x*anchoT,this.y*altoT,anchoT,altoT);        
    }
    //Dibuja CloseSet
    this.dibujaCS = function(){
        ctx.fillStyle = '#800000'; //color del CS
        ctx.fillRect(this.x*anchoT,this.y*altoT,anchoT,altoT);        
    }
      //DIBUJA CAMINO
    this.dibujaCamino = function(){
    ctx.fillStyle = '#00FFFF';  //cyan
    ctx.fillRect(this.x*anchoT,this.y*altoT,anchoT,altoT);
  }
}
//2---------------------------------------------------
function inicializar(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    //CALCULAR TAMAÑO DE LOS TILES (proporcionalmente)
    anchoT = parseInt(canvas.width/columnas);
    altoT = parseInt(canvas.height/filas);
    //CREAR LA MATRIZ
    escenario = crearArray2D(filas, columnas);
    //AÑADIR OBJETOS CASILLAS
    for( i = 0; i < filas; i++) {
        for( j = 0; j < columnas;j++){
            escenario[i][j] = new Casilla(j,i);
        }
    }   
    //AÑADIR VECINOS
    for( i = 0; i < filas; i++) {
        for(j = 0; j < columnas; j++){
            escenario[i][j].addVecinos();
        }
    }       
    //CREAR ORIGEN Y DESTINO
    principio = escenario[Math.floor(Math.random() * 50)][Math.floor(Math.random() * 50)];
    fin = escenario[Math.floor(Math.random() * 50)][Math.floor(Math.random() * 50)];
    //INICIALIZAR EL OPENSET
    openSet.push(principio);
    //BUCLE PRINCIPAL
    setInterval(function(){principal();},1000/FPS);
}
//6 --------DIBUJAR ESCENARIO----------------
function dibujaEscenario(){
    for(i = 0; i<filas; i++){
        for(j = 0; j<columnas; j++){
            escenario[i][j].dibuja();
        }
    }
    //DIBUJA OPENSET
    for(i = 0; i < openSet.length; i++){
        openSet[i].dibujaOS();
    }
    //DIBUJA CLOSESET
    for( i = 0; i < closedSet.length; i++){
        closedSet[i].dibujaCS();
    }  
    //DIBUJAR CAMINO  
    for(i=0; i<ruta.length; i++){
        ruta[i].dibujaCamino();
      }
}
//BORRAR CAMBAS----------------------------------
function borrarCanvas(){
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}
//ALGORITMO A*
function algoritmo(){
    //SEGUIMOS HASTA ENCONTRAR SOLUCION
    if(terminado!=true){
        //SEGUIMOS SI HAY ALGO EN OPENSET
        if(openSet.length>0){
            var ganador = 0; //posiciion del ganador dentro del array
            //evaluar qué openSet tiene menor coste
            for( i = 0; i < openSet.length; i++){
                if(openSet[i].f < openSet[ganador].f){
                    ganador = i;
                }
            }
            //ANALIZAR LA CASILLA GANADORA
            var actual = openSet[ganador];
            if(actual === fin){
                var temporal = actual;
                ruta.push(temporal);
                while(temporal.padre!=null){
                    temporal = temporal.padre;
                    ruta.push(temporal);
                }
                console.log('camino encontrado');
                terminado = true;
            }
            //SI NO HEMOS LLEGADO AL FINAL
            else{
                borrarDelArray(openSet,actual);
                closedSet.push(actual);
                var vecinos = actual.vecinos;
                //RECORRER LOS VECINOS DEL GANADOR
                for(i = 0; i < vecinos.length; i++){
                    var vecino = vecinos[i];
                    //SI EL VECINO NO ESTA EN EL CLOSEDSET Y NO ES UNA PARED
                    if(!closedSet.includes(vecino) && vecino.tipo != 1){
                        var tempG = actual.g + 1;
                            //si el vecino esta en openSet y su peso es mayor
                        if(openSet.includes(vecino)){
                            if(tempG < vecino.g){
                                vecino.g = tempG;
                            }                    
                        }
                        else{
                            vecino.g = tempG;
                            openSet.push(vecino);
                        }
                        //ACTUALIZAMOS VALOERS
                        vecino.h = heuristica(vecino,fin);
                        vecino.f = vecino.g + vecino.h;
                        //GUARDAMOS EL PADRE (DE DONDE VENIMOS)
                        vecino.padre = actual;
                    }
                }                
            }
        }
        else{
            console.log('NO HAY CAMINO POSIBLE');
            terminado = true;
        }
    }
}
//4-------funcion que se ejecua cada frame
function principal(){
    borrarCanvas();
    algoritmo();
    dibujaEscenario();
}