var stdSize = 64;
var stdPlane = 1;
var stdType = "char"

function matObj(objClass){
var stdDims = [stdSize, stdSize];
    var objRef = new JitterObject(objClass);
    objRef.dim = stdDims;
    objRef.planecount = stdPlane;
    objRef.type = stdType;
    return objRef;
}