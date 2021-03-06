var meanGet = new JitterObject("jit.3m");
var runningDeviation = [127.5, 127.5, 127.5, 127.5, 127.5, 127.5, 127.5, 127.5];
meanGet.mean = 127.5;

function returnMean(loopMat){
meanGet.matrixcalc(loopMat);
runningDeviation.shift();
runningDeviation.push(meanGet.mean);
return meanGet.mean;
}

/*
function change(loopMat) {
    var d1 = 0;
    var d2 = 0;
    for(i=0; i<4; i++){
    d1 += runningDeviation[i];
    }
    for(i=4; i<8; i++){
        d2 += runningDeviation[i];
    }
    if(Math.abs((d1/4)-(d2/4))<16) {
    loopMat.op("")   


    }
    return loopMat;
}
*/

