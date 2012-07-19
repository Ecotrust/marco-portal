from fabric.api import * 

dev_server =  'ubuntu@dev.marco.marineplanning.org:22'
prod_server = []

env.forward_agent = True
env.key_filename = '~/.ssh/marco_dsa'

def dev(): 
   """ Use development server settings """
   env.hosts = [dev_server]
   
def prod():
   """ Use production server settings """ 
   env.hosts = [prod_server] 
   
   
def all(): 
   """ Use all serves """
   env.hosts = [dev_server, prod_server]


def deploy(): 
   run('cd /usr/local/apps/marco/marco-portal/ && git fetch && git merge origin/master')