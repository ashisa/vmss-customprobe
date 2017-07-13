---
platforms: Azure VM Scale Set
development language: Node.js
author: Ashish Sahu
---

---
platforms: Azure VM Scale Set
development language: Node.js
author: Ashish Sahu
author: Ashish Sahu
---

# What does this sample do?

This sample uses the Azure Service Management APIs to find out if the current VM in a VM Scale set is running the latest model of the custom image. This sample is useful in scenarios where you are using a custom image to build a VM Scale Set. Please see this link to understand this process in detail - https://msftstack.wordpress.com/2016/06/20/how-to-convert-an-azure-virtual-machine-to-a-vm-scale-set/

Some scenarios will require you to update the custom image which therefore will update the VMs in the scale set. Automatic upgrade will upgrade the VMs in the scale set using the UD setup and may cause a temporary downtime. Manual upgrade will need to monitor the VMs for utilization and then update the VMs manually.

This is where this sample comes in handy - Deploy this sample on your VM scale set and configure it as the custom probe. When updating your scale set, update the custom image uri in your vm scale set model and also increase the instance count by 30%-50% than the currently running VMs.

This sample uses the Azure Service Management APIs to query the state of all the VMs in the given Scale Set and checks if the current VM is running the latest model. If not, it returns a non-200 HTTP response which will cause the load balancer to remove this VM from the pool thereby reducing the overall load on the VM. This, in turn, will remove this machine from the VM scale set. Over time, you will have VMs running the latest model only.

Please see this link for the information on creating an Active Directory application and service principal to be populated in the sample - https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/

# How to use this sample?

This sample has been tested with ExpressJS running on Ubuntu 16.04.1 LTS. Here's the steps to get it working -

Install Node.js -
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```

Install Express and Express-Generator -
```
npm install express -g
npm install express-generator -g
```

Create an Express app called myapp -
```
express myapp
```

Download/clone the myapp directory from this repository and copy the content to myapp directory on your system and start the application -
```
cd myapp
npm install
./bin/www
```

Now you can test this code by browsing to this URL - http://yourwebsite:3000/vmstatus

Please note that Express defaults on port 3000 and you may have to create an inbound security rule in your NSG to allow connections as well as open port on UFW. 
