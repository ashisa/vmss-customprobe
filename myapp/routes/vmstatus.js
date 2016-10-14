var express = require('express');
var router = express.Router();
var adal = require('adal-node');
var rest = require('restler');
const os = require('os');

/* GET users listing. */
router.get('/', function (req, res, next) {
    var AuthenticationContext = adal.AuthenticationContext;

    var tenantID = "xxxxxxxx-86f1-41af-91ab-xxxxxxxxxxxx";
    var clientID = "xxxxxxxx-1601-40a7-ad62-xxxxxxxxxxxx";
    var resource = "https://management.azure.com/";
    var authURL = "https://login.windows.net/" + tenantID;
    var secret = "xxxxxxxxxxxqJrVT4MS9cxxxxxxxxxxxxmxxxxxxxxxx";
    var subId = "xxxxxxxx-47b0-42cb-94c0-xxxxxxxxxxxx";
	var scaleSetName = "<scale set name>";
	var resourceGroupName = "<resource group name>";

    var context = new AuthenticationContext(authURL);
    var authHeader, requestURL;

    context.acquireTokenWithClientCredentials(resource, clientID, secret, function (err, tokenResponse) {
        if (err) {
            console.log('Oops, error' + err.stack);
        } else {
            authHeader = tokenResponse['accessToken'];

            // All VMs in scale set
            requestURL = "https://management.azure.com/subscriptions/" + subId + "/resourceGroups/" + resourceGroupName + "/providers/Microsoft.Compute/VirtualMachineScaleSets/" + scaleSetName + "/virtualMachines?$expand=instanceView&$select=instanceView&api-version=2016-03-30"
            rest.get(requestURL, { accessToken: authHeader }).on('complete', function (scalesetResults) {
                scalesetResults.value.forEach(function (scalesetResult) {
                    console.log('Instance ID :' + scalesetResult.instanceId);
                    vmInstanceID = scalesetResult.instanceId;
                    requestURL2 = "https://management.azure.com/subscriptions/" + subId + "/resourceGroups/" + resourceGroupName + "/providers/Microsoft.Compute/VirtualMachineScaleSets/" + scaleSetName + "/virtualMachines/" + vmInstanceID + "?api-version=2016-03-30"
                    rest.get(requestURL2, { accessToken: authHeader }).on('complete', function (vmssResult) {
                        var scaleSetVMName = vmssResult.name;
                        var hostVMName = os.hostname();

console.log(scaleSetVMName);
                        if (scaleSetVMName == "avmss04xq_0") {
                            switch (vmssResult.properties.latestModelApplied) {
                                case false:
                                    console.log("Not running latest model")
                                    res.sendStatus(500);
                                    break;

                                case true:
                                    console.log("Running latest model")
                                    res.sendStatus(200);
                                    break;

                                default:
                                    break;
                            }
                        } 
                    });
                })
            });
        };
    });
});

module.exports = router;
