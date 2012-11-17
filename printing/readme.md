##Versions:
###tested with:
v0.8.14 of node
v1.7.0 of phantomjs

##phantomjs: Download the prebuilt binary:
http://phantomjs.org/download.html
uncompress to /usr/local/apps/node/phantom-*

##nodejs: Download the prebuilt binary:
http://nodejs.org/download/
uncompress to /usr/local/apps/nod/node-*

##install node modules (from marco-portal/printing)
/usr/local/apps/node/node-v0.8.14-linux-x86/bin/npm install

##install system node to handle process monitor
sudo apt-get install nodejs

##install process monitor
/usr/local/apps/node/node-v0.8.14-linux-x86/bin/npm install -g forever

##install graphicsmagick library
sudo apt-get install graphicsmagick

##add upstart script owned by root
cp marco-portal/printing/marco_printing.conf /etc/init/
verify that paths to executables are correct
    sudo vi /etc/init/marco_printing.conf
verify that username is correct

##file permissions
sudo mkdir shots
make sure shots dir is writable by marco user

## django settings
SOCKET_URL = 'http://HOSTNAME:PORT'

## start server
sudo start marco_printing
