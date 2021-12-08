
class Canvas
{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx =  canvas.getContext('2d');
        this.FPS = 60;
    }

    borrarCanvas(){
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;      
    }
}
class Escenario
{
    constructor(_col,_fil){
        this.columnas = _col;
        this.filas = _fil;
        this.matriz = [];

    }
    crearMatriz(f, c){
        this.matriz = new Array(f);
        for(let a = 0; a < f; a++){
            this.matriz[a] = new Array(c);
        }
    }
    dibujaEscenario(canvas, ruta){
        
        for(let i = 0; i<this.filas; i++){
            for(let j = 0; j<this.columnas; j++){
                this.matriz[i][j].dibujarCasilla(canvas);
            }
        }
        //DIBUJA OPENSET
        for(let i = 0; i < ruta.openSet.length; i++){

            ruta.openSet[i].dibujaOS(canvas); //dibuja la casillas ESC.matriz[][] del array openSet
        }
        //DIBUJA CLOSESET
        for(let i = 0; i < ruta.closedSet.length; i++){
            ruta.closedSet[i].dibujaCS(canvas); //dibuja la casillas ESC.matriz[][] del array closedSet
        }  
        //DIBUJAR CAMINO  
        for(let i=0;  i< ruta.recorrido.length; i++){
            ruta.recorrido[i].dibujarCamino(canvas);
        }
    }
    matrizCasilla(ancho, alto){
        let aleatorio;
        
        for(let i = 0; i < this.filas; i++) {
            for(let j = 0; j < this.columnas;j++){
                aleatorio = Math.floor(Math.random()*5); //0-4
                if(aleatorio == 1){
    
                    this.matriz[i][j] = new Casilla(j,i,ancho,alto,true);       
                }
                else{
                    this.matriz[i][j] = new Casilla(j,i,ancho,alto,false);
    
                }
            }
        }   
    }
    vecinos(){
        for(let i = 0; i < this.filas; i++) 
        {
            for(let j = 0; j < this.columnas; j++)
            {
                this.matriz[i][j].agregarVecinos(this);
            }
        } 
    }
}
class Ruta
{
    constructor(_origen, _destino){
        this.origen = _origen;
        this.destino = _destino;
        this.openSet = [];
        this.closedSet = [];
        this.recorrido = [];
        this.terminado = false;
        this.actual
    }  
    borrarDelArray(){
        for(let i = this.openSet.length - 1; i>=0; i--){
            if(this.openSet[i] == this.actual){
                this.openSet.splice(i,1);
            }
        }
    }
    algoritmo(){
        let ganador, temporal, V,v,tempG;
        if(this.terminado != true){
            //HAY ELEMENTOS EN OPENSET
            if(this.openSet.length > 0)
            {
                //INDICE DEL MEJOR
                ganador = 0; 
                //ANALIZAR CADA UNO DE LAS CASILLAS
                for(let i = 0; i < this.openSet.length; i++)
                {
                    //BUSCAR EL MENOR COSTE
                    if(this.openSet[i].f < this.openSet[ganador].f)
                    {                    
                        //ACTUALIZAR EL INDICE DEL MEJOR
                        ganador = i;
                    }
                }
                //ANALIZAR LA MEJOR CASILLA
                this.actual = this.openSet[ganador];
                //ANALIZAR SI YA LLEGAMOS
                if(this.actual === this.destino){
                    temporal = this.actual;
                    //ALMACENAR AL MEJOR EN EL RECORRIDO
                    this.recorrido.push(temporal);
                    /*MIENTRAS EL ANTERIOR A LA MEJOR CASILLA
                    NO SEA NULL*/
                    while(temporal.padre != null){
                        /*ALMACENAR TODAS LAS MEJORES OPCIONES 
                        RECORRIDAS
                        */
                        temporal = temporal.padre;
                        this.recorrido.push(temporal);
                    }
                    console.log("camino encontrado");
                    this.terminado = true;
                }
                //AUN NO LLEGAMOS AL DESTINO
                else{
                    /*BORRAMOS AL QUE ERA EL MEJOR 
                    DE OS Y LO PASAMOS A CS
                    */
                    this.borrarDelArray()
                    this.closedSet.push(this.actual);
                    /*ALMACENASMOS A TODOS LOS VECINOS 
                    DE ACTUAL*/
                    V = this.actual.vecinos;                    
                    for(let i = 0; i < V.length;i++){
                        //ANALIZAR DE UNO A UNO
                        v = V[i];
                        /*SI ESA CASILLA NO LA HEMOS ANALIZADO ANTES 
                        Y NO ES UN MURO*/
                        if(!this.closedSet.includes(v) && v.tipo != true){
                            /*
                            ALMACENAMOS TEMPORALMENTE
                            AL SIGUIENTE G + 1
                            */
                            tempG = this.actual.g + 1;
                            //SI YA ESTA EN OS Y SU PESO ES MAYOR
                            if(this.openSet.includes(v) && tempG < v.g){ 
                                //ESCOGEMOS EL MAS CORTO
                                v.g = tempG;
                            }
                            else{
                                //LO AGREGAMOS A OS
                                v.g = tempG;
                                this.openSet.push(v);
                            }
                            //ACTUALIZAMOS SUS VALORES H,F
                            v.h = this.heuristica(v);
                            v.f = v.g + v.h;
                            //REGISTRAMOS EN PADRE PARA SU RECORRIDO
                            v.padre = this.actual;
                        }
                    }
                }
            }
            else{
                console.log('NO HAY CAMINO POSIBLE');
                this.terminado = true;
            }
        }
    
    }
    heuristica(v){
        let x = Math.abs(v.x - this.destino.x);
        let y = Math.abs(v.y - this.destino.y);
    
        let distancia = x + y;
        return distancia;
    }
}
class Casilla
{    
    constructor(_x,_y,_ancho,_alto,_tipo){
       
        this.anchoT = _ancho;
        this.altoT = _alto;
        this.tipo = _tipo;
        this.color = "";  

        this.x = _x;
        this.y = _y;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.vecinos = [];
        this.padre = null;


    }
    agregarVecinos(ESC){
        if(this.x > 0)
            this.vecinos.push(ESC.matriz[this.y][this.x-1]);
        if(this.x < ESC.filas-1)
            this.vecinos.push(ESC.matriz[this.y][this.x+1]);
        if(this.y > 0)
            this.vecinos.push(ESC.matriz[this.y-1][this.x]);
        if(this.y < ESC.columnas-1)
            this.vecinos.push(ESC.matriz[this.y+1][this.x]);
    }
    dibujarCasilla(canvas){
   
        if(this.tipo == false){
            this.color = '#EDEDED';
        }
        if(this.tipo == true){
            this.color = '#171717';
        }
        //DIBUJAR EN EL CANVAS
        canvas.ctx.fillStyle = this.color;
        canvas.ctx.fillRect(this.x*this.anchoT,this.y*this.altoT,this.anchoT,this.altoT);       
    }
    dibujaOS(canvas){
        canvas.ctx.fillStyle = '#444444'; //color del OS
        canvas.ctx.fillRect(this.x*this.anchoT,this.y*this.altoT,this.anchoT,this.altoT);    
    }
    dibujaCS(canvas){
        canvas.ctx.fillStyle = '#DA0037'; //color del CS
        canvas.ctx.fillRect(this.x*this.anchoT,this.y*this.altoT,this.anchoT,this.altoT);        
    } 
    dibujarCamino(canvas){
        canvas.ctx.fillStyle = '#00FFA4';  
        canvas.ctx.fillRect(this.x*this.anchoT,this.y*this.altoT,this.anchoT,this.altoT);        
    }

}
function main()
{
    
    let ancho, //ancho casilla
        alto,   //alto casilla
        origen,  //casilla de orrigen
        x = [],
        y = [],
        destino, //casilla de destino
        tiles = 20,//ancho y alto de casa casilla
        canvas = new Canvas(),//obj canvas
        ESC = new Escenario(tiles,tiles),
        ruta;//obj escenario
                
    ancho = parseInt(canvas.canvas.width/ESC.columnas);//calculo de ancho y alto
    alto = parseInt(canvas.canvas.height/ESC.filas);
 
    ESC.crearMatriz(ESC.filas,ESC.columnas);//creacion de la propiedad matriz del escenario

    //cada indice de la matriz del escenario es una casilla           
    ESC.matrizCasilla(ancho,alto);
    //vecinos
    ESC.vecinos();
    //crear origen y destino
    x.push(Math.floor(Math.random() * tiles));//0-49 
    y.push(Math.floor(Math.random() * tiles));
    x.push(Math.floor(Math.random() * tiles));
    y.push(Math.floor(Math.random() * tiles));

    console.log(`Origen -> (${x[0]}, ${y[0]})`);
    console.log(`Destino -> (${x[1]}, ${y[1]})`);

    origen = ESC.matriz[ x[0] ][ y[0] ];
    destino = ESC.matriz[ x[1] ][ y[1] ];

    //RUTA
    ruta = new Ruta(origen,destino);
    ruta.openSet.push(origen);
    //refrescar
    setInterval(
        function()
        {
            canvas.borrarCanvas();
            ruta.algoritmo();
            ESC.dibujaEscenario(canvas,ruta);
        },
        1000/canvas.FPS)
    ;

}

