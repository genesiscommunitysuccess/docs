---
id: requirements
sidebar_label: Requirements
sidebar_position: 10
title: Requirements

---
# Server requirements (All environments)

The specifications here are required for setting up the Genesis LCNC platform on a server. They apply to all environments, from development through to production.

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

# Local requirements (Devlopment Only)

The specifications here are required for setting up the Genesis LCNC platform on a local machine. It applies to development only, as these are not the recommended settings to run Genesis in Production. UAT environments should match Production where possible.

## Operating system and packages

Genesis has some development tools that support IDE integration for local deployment. These tools are designed to work for people running on any Linux distribution, or running WSL2 through Windows.
If using WSL, we recommend running a version of CentOS in order to match the recommended Production setup as closely as possible.

# Next Steps

Once you have a server/workstation with the correct operating system, you are ready to install the Genesis platform. By default, this installs FoundationDB as the database. If you need to [use a different database](/getting-started/get-ready-to-develop/database) (such as PostgreSQL), it is easy to change this after the installation process.