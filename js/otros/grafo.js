class Grafo
{
    constructor(_vertices){
        this.Tvertices = _vertices;
        this.Madj = new Array(this.Tvertices);

        for(let a = 0; a < _vertices; a++){
            this.Madj[a] = new Array(this.Tvertices);
        }
    }
    hacerArista(de, a){
        //console.log(`${de}, ${a}`);
        this.Madj[de][a] = 1;
    }
    obtenerArista(de){
        for(let i = 0; i<this.Tvertices;i++){            
            if( this.Madj[de][i] == 1){
                return this.Madj[de][i];
            }
        }
        
    }
    
}
class Vertice{
    constructor(_nodo, _x,_y){
        this.nodo = _nodo; 
        this.vecinos = [];
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.padre = null;
        this.Pactual;
    }
}
class Ruta{
    constructor(_origen, _destino){
        this.origen;
        this.destino;
        this.listaAbierta = [];
        this.listaCerrada = [];
        this.recorrido = [];
        this.terminado = false;
        this.Pactual;
    }
    borrarDelArray(){
        for(let i = this.openSet.length - 1; i>=0; i--){
            if(this.openSet[i] == Pactual){
                this.openSet.splice(i,1);
            }
        }
    }
    algoritmo(){
        do{
            if(this.listaAbierta.length>0){
                
            }
            else
            {
                break;
            }
        }while(this.terminado==true)
    }
    heuristica(){

    }
}
function main(){    
    let
    c=-1,    
    totalV = 3,
    miGrafo = new Grafo(9),
    vertice = new Array(totalV),
    ruta;

    for(let i = 0; i<totalV; i++){
        vertice[i] = new Array(totalV);
    }
    //crear vertices
    for(let i = 0;i<totalV;i++){
        for(let j = 0; j<totalV;j++){
            c++;
            vertice[i][j] = new Vertice(c,i,j)
        }
    }
   //crear aristas
    for(let x = 0;x<totalV;x++){
        for(let y = 0; y<totalV;y++){
            if(x>0){
                miGrafo.hacerArista(vertice[x][y].nodo, vertice[x-1][y].nodo);
            }
            if(x<totalV-1){
                miGrafo.hacerArista(vertice[x][y].nodo, vertice[x+1][y].nodo);              
            }
            if(y>0){
                miGrafo.hacerArista(vertice[x][y].nodo, vertice[x][y-1].nodo);                      
            }
            if(y<totalV-1){
                miGrafo.hacerArista(vertice[x][y].nodo, vertice[x][y+1].nodo);                 
            }
        }
    }  

    //origen y destino
    ruta = new Ruta(vertice[0][0].nodo, vertice[2][2].nodo);
    ruta.openSet.push(vertice[0][0].nodo);

    
}