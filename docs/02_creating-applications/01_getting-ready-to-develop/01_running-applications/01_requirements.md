---
id: requirements
sidebar_label: Requirements
sidebar_position: 1
title: Requirements

---

# Options for running a development environment

Developers often want to run the full application they are building to test the functionality they have developed.

The Genesis Low Code Platform needs to run in a linux based environment. Typically CentOS or RedHat

The options we have for doing this are:

* Running in Windows Workstation via WSL2 
* Running in a workstation hosted VM via VMWare
* Running on a cloud based development/sandbox VM

# Requirements

The specifications here are required for setting up the Genesis Low Code Platform to run.

## Minimum hardware requirements

* Architecture: x86
* RAM: 16GB
* CPU: 4 core
* SSD: 120GB
  You should have at least 100GB available on the partition where the platform is to be installed.

## Operating system and packages

Genesis runs on either of the following Linux distributions:
•	CentOS 7
•	Red Hat RHEL 7
The distribution must be 64-bit minimal, with the latest patches applied.
The following additional packages are required:

* **java-11**	Java 11 SDK. The platform is Java-based
* **lsof**	list open files
* **zip**	Compression archiver
* **unzip**	De-compression
* **nginx**	Web server (reverse proxy)
* **firewalld**	Firewall
* **unoconv**	Universal Office Convertor. This is a dependent of the installed Genesis modules

# Local requirements (development only)

The specifications here are required for setting up the Genesis Low Code Platform on a local machine. It applies to development only, as these are not the recommended settings to run Genesis in Production. UAT environments should match Production where possible.

## Operating system and packages

Genesis has some development tools that support IDE integration for local deployment. These tools are designed to work for people running on any Linux distribution, or running WSL2 through Windows.
If using WSL, we recommend running a version of CentOS in order to match the recommended Production setup as closely as possible.

# Next Steps

Once you have a server/workstation with the correct operating system, you are ready to install the Genesis platform. By default, this installs FoundationDB as the database. If you need to [use a different database](/creating-applications/configure-runtime/database/) (such as PostgreSQL), it is easy to change this after the installation process.