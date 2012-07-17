
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

# install mysql server with the following root and wordpress passwords
class mysql-server {
  $root_password = "password"
  $wordpress_password = "password"
  package { "mysql-client": ensure => installed, require => Exec["apt-update"]}
  package { "mysql-server": ensure => installed, require => Exec["apt-update"]}

  exec { "Set MySQL server root password":
    subscribe => [ Package["mysql-server"], Package["mysql-client"] ],
    refreshonly => true,
    unless => "mysqladmin -uroot -p$root_password status",
    path => "/bin:/usr/bin",
    command => "mysqladmin -uroot password $root_password",
  }

  
  exec { "Create Database":
    subscribe => [ Package["mysql-server"], Package["mysql-client"] ],
    refreshonly => true,
    path => "/bin:/usr/bin",
    command => "mysqladmin -u dba_user -p create marco",
  }

}

include mysql-server

# install some packages
package { "php5-mysql":
    ensure => "installed"
}

package { "libapache2-mod-php5":
    ensure => "installed"

}


file {'/etc/apache2/conf.d/vhost.conf':
  ensure => file,
  content => template("vhost.erb"),
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
    subscribe => File["/etc/apache2/conf.d/vhost.conf"],
}
