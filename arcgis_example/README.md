## About
This is a small sample to show how to load ArcGIS JavaScript API maps into a React App
using the [react-arcgis](https://github.com/Esri/react-arcgis) tools and also demonstrates selecting
points in a map.

### Docker Build
This is a test project for building a website w. Docker for Digital Ocean

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04
#### Steps:
build image locally
run & test container locally
remember docker is by default bound to http://192.168.99.100/ on windows 7, localhost wont work.

See Gist for ref:
https://gist.github.com/ryansutc/3c829204e6f60f77c2103028a43b177b


#### How to get docker volume on new machine
Windows 7 Docker Toolbox specific...

1) Open VirtualBox, add shared directory for your dev folder. This is the parent folder that this repo (react_tests)
sits in. (for me: c:/dev/). For name, use "devmnt".

2) ssh into docker-machine to configure boot2docker so that your mount is recognized by docker each time it runs 
((source)[https://stackoverflow.com/questions/26639968/boot2docker-startup-script-to-mount-local-shared-folder-with-host])
((more info))[http://support.divio.com/en/articles/646695-how-to-use-a-directory-outside-c-users-with-docker-toolbox-docker-for-windows]:
- ```docker-machine start``` 
- ```docker-machine ssh```
- ```cd /mnt/sda1/var/lib/boot2docker/```
- ```touch bootlocal.sh```
- ```echo mkdir /home/docker/devmnt >> bootlocal.sh```
- ```echo mount -t vboxsf -o uid=1000,gid=50 devmnt /home/docker/devmnt```
Now you're ```c:/dev``` directory will be mounted in VM as ```/home/docker/devmnt``` each time docker-machine starts.
- ```exit```
- restart docker-machine.

3) run ```docker-compose up``` to start up dev build

4) Change a file and watch it get updated in docker!


---
debug your docker container to see what its doing:
```sudo docker exec -it arcgis_example_frontend_1 /bin/bash```

---
Build for production: 
* create image:
```docker build --tag nginx:1 -f dockerfile.prod .```
* run container from image:
```docker run --name nginx1st -p 8000:80  nginx```


```docker-compose -f docker-compose.prod.yml up```