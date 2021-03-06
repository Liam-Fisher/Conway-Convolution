var size = 128;
var counter = {
    balance: 127,
    rate: 1,
    lim: 5,
    interval: 1,
    count: function() {
        if(this.balance>=(255-this.lim)){
            this.interval = this.rate*-1;
            }
            else if(this.balance<=this.lim){
                this.interval = this.rate;
            }
            else {
                this.balance += this.interval;
            }
        }  
    }

var noiseGen = new JitterObject("jit.noise");
var nMat = new JitterMatrix(1, "char", [size, size]);
var exprObj = new JitterObject("jit.expr");
exprObj.expr = "";

var conway1 = new JitterObject("jit.conway");
var conway2 = new JitterObject("jit.conway");
conway1.dim = [size, size];
conway2.dim = [size, size];
conway1.planecount = 1;
conway2.planecount = 1;
conway1.type = "char";
conway2.type = "char";
conway1.lifemask = [0, 0, 1, 1, 0, 0, 0, 0, 0];
conway2.lifemask = [0, 0, 1, 1, 0, 0, 0, 0, 0];
// birth cell if it has n live neighbours and lMask[n]==1
conway1.deathmask = [0, 0, 0, 1, 0, 0, 0, 0, 0];
conway2.deathmask = [0, 0, 0, 1, 0, 0, 0, 0, 0];
// birth cell if it has n dead neighbours and dMask[n]==1
conway1.neighborhood = [1, 1, 1, 1, 1, 1, 1, 1];
conway2.neighborhood = [1, 1, 1, 1, 1, 1, 1, 1];
// ordered NW, N, NE, E, SE, S, SW. If value of blockCount is 1, count neighbour
var cMat1 = new JitterMatrix(1, "char", [size, size]);
var cMat2 = new JitterMatrix(1, "char", [size, size]);

function applyRules(loopMat){
loopMat.op(">", 127);
var exprStr = "(in[1]*(in[0]>"+counter.cBalance+"))+(in[2]*(in[0]<"+counter.cBalance+"))";
noiseGen.matrixcalc(nMat, nMat);
conway1.matrixcalc(loopMat, cMat1);
conway2.matrixcalc(loopMat, cMat2);
exprObj.expr = exprStr;
exprObj.matrixcalc([nMat, cMat1, cMat2], loopMat);
counter.count();
}
