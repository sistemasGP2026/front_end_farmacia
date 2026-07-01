export var gsUrlApi = "";
export var gsUrlApiS3 =
  "https://apiinterfazarchivos-prod.us-west-2.elasticbeanstalk.com";
var sAmbiente = "dev";

switch (sAmbiente) {
  case "PRODUCCION":
    gsUrlApi = "http://10.10.1.15:3019";
    break;
  default:
    gsUrlApi = "http://localhost:3019";
    break;
}
