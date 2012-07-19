
#php5-mysql mysql-server libapache2-mod-php5

# ensure that apt update is run before any packages are installed
class apt {
  exec { "apt-update":
    command => "/usr/bin/apt-get update"
  }

  # Ensure apt-get update has been run before installing any packages
  Exec["apt-update"] -> Package <| |>

}




include apt

exec { "add-apt":
  command => "/usr/bin/add-apt-repository -y ppa:mapnik/nightly-2.0 && /usr/bin/apt-get update",
  subscribe => Package["python-software-properties"]
}


# install mysql server with the following root and wordpress passwords
class mysql-server {
  $root_password = "password"
  $wordpress_password = "password"
  package { "mysql-client": ensure => installed, require => Exec["apt-update"]}
  package { "mysql-server": ensure => installed, require => Exec["apt-update"]}

  exec { "Set MySQL server root password":
    subscribe => [ Exec['Restore Database'] ],
    refreshonly => true,
    unless => "mysqladmin -uroot -p$root_password status",
    path => "/bin:/usr/bin",
    command => "mysqladmin -uroot password $root_password",
  }

  
  exec { "Create Database":
    subscribe => [ Package["mysql-server"], Package["mysql-client"] ],
    refreshonly => true,
    path => "/bin:/usr/bin",
    command => "mysqladmin -uroot create marco",
  }

  exec { "Restore Database":
    subscribe => [ Exec['Create Database'] ],
    refreshonly => true,
    path => "/bin:/usr/bin",
    command => "mysql -uroot marco < /vagrant/portal/marco_wordpress.sql",
  }


}

include mysql-server


file {'/etc/apache2/sites-available/default':
  ensure => file,
  content => template("vhost.conf"),
  notify  => Service['apache2']
}

file {'/vagrant/portal/wordpress/wp-config.php':
  ensure => file,
  content => template("wp-config.erb"),
  notify  => Service['apache2']
}

exec { "/usr/sbin/a2enmod rewrite" :
      unless => "/bin/readlink -e /etc/apache2/mods-enabled/rewrite.load",
      notify => Service[apache2],
      subscribe => Package["libapache2-mod-php5"]
}



service { 'apache2':
    ensure => running,
    subscribe => File["/etc/apache2/sites-available/default"],
}





package { "libmapnik":
    ensure => "installed",
    subscribe => Exec['add-apt']
}


package { "mapnik-utils":
    ensure => "installed",
    subscribe => Exec['add-apt']
}


package { "python-mapnik":
    ensure => "latest",
    subscribe => Exec['add-apt']
}

package { "php5-mysql":
    ensure => "installed"
}

package { "libapache2-mod-php5":
    ensure => "installed"

}

package { "build-essential":
    ensure => "installed"

}

package { "libapache2-mod-wsgi":
    ensure => "installed"

}

package { "python-software-properties":
    ensure => "installed"

}

package { "git-core":
    ensure => "latest"
}

package { "subversion":
    ensure => "latest"
}

package { "mercurial":
    ensure => "latest"
}

package { "csstidy":
    ensure => "latest"
}

package { "python-gdal":
    ensure => "latest"
}
package { "vim":
    ensure => "latest"
}

exec { "Add SRID":
  subscribe => Package['python-gdal'] ,
  command => "/bin/echo '<99996> +proj=aea +lat_1=37.25 +lat_2=40.25 +lat_0=36 +lon_0=-72 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs <>' | cat >>/usr/share/proj/epsg"
}

package { "python-imaging":
    ensure => "latest"
}

package { "python-numpy":
    ensure => "latest"
}

package { "python-psycopg2":
    ensure => "latest"
}

package { "python-virtualenv":
    ensure => "latest"
}

package { "python-dev":
    ensure => "latest"
}

package { "inotify-tools":
    ensure => "latest"
}


class { "postgresql::server": version => "9.1",
    listen_addresses => 'localhost',
    max_connections => 100,
    shared_buffers => '24MB',
}

postgresql::database { "marco":
  owner => "vagrant",
}


python::venv::isolate { "/usr/local/venv/marco":
  requirements => "/vagrant/requirements.txt",
  subscribe => [Package['python-mapnik'], Package['build-essential']]
}

