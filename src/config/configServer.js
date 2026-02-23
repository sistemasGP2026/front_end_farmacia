export var gsUrlApi = "";
var sAmbiente = "PRODUCCION";

switch (sAmbiente) {
    case "PRODUCCION":
        gsUrlApi = "http://10.10.1.15:3019";
        break;
    default:
        gsUrlApi = 'http://localhost:3019';
        break;
}
 
