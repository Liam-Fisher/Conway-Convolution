inlets = 1;
outlets = 3;
var size = 128;
var count = 0;
var loop = 4;

var buf = new Buffer("gameSound");
var bufferFlag = false;
var slider = new JitterObject("jit.slide");
var sprinkler = new JitterObject('jit.sprinkle');
var initExpr = new JitterObject("jit.expr");

var gameGuy = new Object();
include("doubleConway", gameGuy);
gameGuy.size = size;
var meanGuy = new Object();
include("meanLogic", meanGuy);


var inputMat = new JitterMatrix(1, "char", [size, size]);
var loopMat = new JitterMatrix(1, "char", [size, size]);
var sprinkleMat = new JitterMatrix(1, "char", [size, size]);
var outputMat = new JitterMatrix(1, "char", [size, size]);
var outputMat2 = new JitterMatrix(1, "char", [size, size]);


function expression(str){
  initExpr.expr = str;
  initExpr.matrixcalc(inputMat, inputMat);
  loopMat.frommatrix(inputMat);
  sprinkleMat.frommatrix(inputMat);
  outlet(0, "jit_matrix", loopMat.name);
}

function bang() {
count++;
count = count%loop;
meanGuy.returnMean(loopMat);
sprinkler.matrixcalc(loopMat, sprinkleMat);
loopMat.op("||", sprinkleMat);
if(count==0){
gameGuy.applyRules(loopMat);
}
outputMat.frommatrix(loopMat);
slider.matrixcalc(outputMat, outputMat2);
outlet(0, "jit_matrix", outputMat2.name);
outlet(1, meanGuy.meanGet.mean);
outlet(2, gameGuy.cBalance);
if(bufferFlag){
for(n=0; n<size; n++) {
  for(m=0; m<size; m++) { 
    var val = outputMat2.getcell(n, m)/127 - 1;
    buf.poke(1, (n*size+m), val);
    buf.poke(2, (m*size+n), val);
}
}
}
//formula 1 
/*  var val1 = outputMat2.getcell(n, m)/127) - 1);
    var val2 = outputMat2.getcell(m, n)/127) - 1);
    buf.poke(1, (n*size+m), val1);
    buf.poke(2, (m*size+n), val2);
*/
//formula 2 
/*   var val1 = Math.sin(n*(outputMat2.getcell(n, m)/127)*Math.PI);
    var val2 = Math.sin(m*(outputMat2.getcell(m, n)/127)*Math.PI);
    buf.poke(1, (n*size+m), val1);
    buf.poke(2, (n*size+m), val2);
*/

}
function square(x, y, s) {
  inputMat.setall(0);
  for(i=x; i<(s+x); i++){
    for(n=y; n<(s+y); n++){
      inputMat.setcell(i, n, "val", 255);
  }
}
  loopMat.frommatrix(inputMat);
  outlet(0, "jit_matrix", loopMat.name);
  outlet(1, meanGuy.meanGet.mean);
  outlet(2, gameGuy.cBalance);
}

function anything(){
  var args = arrayfromargs(messagename, arguments);
  var attr = args.shift();
  var ind = args.shift();
  var arr = [];
  switch(attr){
    case 'lifemask':
      var str = args[0].toString(2);
      while(str.length<9){
        str = '0'+str;
      }
      for(i=0; i<9; i++){
          arr.push(str[i]);
        }
        if(ind){
        gameGuy.conway2.lifemask = arr;
      }
      else {
        gameGuy.conway1.lifemask = arr;
      }
      break;
      case 'deathmask':
        var str = args.toString(2);
        while(str.length<9){
          str = '0'+str;
        }
        for(i=0; i<9; i++){
          arr.push(str[i]);
        }
      
        if(ind){
        gameGuy.conway2.deathmask = arr;
      }
      else {
        gameGuy.conway1.deathmask = arr;
      }
      break;
      case 'neighbourhood':
      var str = args.toString(2);
      while(str.length<8){
        str = '0'+str;
      }
      for(i=0; i<8; i++){
        arr.push(str[i]);
      }
        if(ind){
        gameGuy.conway2.neighborhood = arr;
      }
      else {
        gameGuy.conway1.neighborhood = arr;
      }
      break;
      case 'slider':
        slider.slide_up = ind;
        slider.slide_down = args[0];
        break;
        case 'sprinkle':
          sprinkler.prob = ind;
          sprinkler.x_range = args[0];
          sprinkler.y_range = args[1];
        break;
      case 'counter':
        gameGuy.counter.rate = ind;
        gameGuy.counter.lim = args[0];
        break;
      case 'size':
        size = ind;
        gameGuy.size = ind;
        gameGuy.conway1.dim = [size, size];
        gameGuy.conway2.dim = [size, size];
        gameGuy.nMat.dim = [size, size];
        gameGuy.cMat1.dim = [size, size]; 
        gameGuy.cMat2.dim = [size, size]; 
        inputMat.dim = [size, size];
        loopMat.dim = [size, size];
        sprinkleMat.dim = [size, size];
        outputMat.dim = [size, size];
        outputMat2.dim = [size, size];
        break;
      default :
      ;
      break;
  }
}
