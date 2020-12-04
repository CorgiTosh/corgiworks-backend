# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # VM hosting Jenkins
  config.vm.define("jenkins") do |jenkins|
    jenkins.vm.box="centos/7"
    jenkins.vm.provider "virtualbox" do |v|
      v.customize ["modifyvm", :id, "--groups", "/vagrant"]
    end
    jenkins.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1"
    jenkins.vm.provision "shell", inline: <<-SHELL
    echo "UPDATING"
    sudo yum -y update
    echo "INSTALLING WGET"
    sudo yum install -y wget
    echo "ADDING JENKINS REPO"
    sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
    echo "ADDING KEY"
    sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
    sudo yum -y upgrade
    echo "INSTALLING JENKINS"
    sudo yum install -y jenkins java-1.8.0-openjdk-devel
    sudo systemctl daemon-reload
    echo "STARTING JENKINS"
    sudo systemctl start jenkins
    SHELL
  end
  # VM hosting Docker
  config.vm.define("docker") do |docker|
    docker.vm.box="centos/7"
    docker.vm.provider "virtualbox" do |v|
      v.customize ["modifyvm", :id, "--groups", "/vagrant"]
    end
    # docker.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1"
    docker.vm.provision "shell", inline: <<-SHELL
    echo "INSTALLING DOCKER"
    sudo yum -y update
    curl -fsSL https://get.docker.com | sh -
    SHELL
  end
  # VM hosting Nginx
  config.vm.define("nginx") do |nginx|
    nginx.vm.box="centos/7"
    nginx.vm.provider "virtualbox" do |v|
      v.customize ["modifyvm", :id, "--groups", "/vagrant"]
    end
    nginx.vm.network "forwarded_port", guest: 80, host: 8081, host_ip: "127.0.0.1"
    nginx.vm.provision "shell", inline: <<-SHELL
    echo "UPDATING"
    sudo yum -y update
    echo "SETTING REPO"
    sudo yum install -y epel-release
    echo "INSTALLING NGINX"
    sudo yum install –y nginx
    echo "STARTING NGINX"
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo "DISABLING FIREWALL"
    firewall-cmd --zone=public --permanent --add-service=https
    firewall-cmd --zone=public --permanent --add-service=http
    firewall-cmd --reload
    SHELL
  end
end
