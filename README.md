# Centom
<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

```sh
sudo apt-get update
```

* net-snmp
 developed based on net-snmp C library

 ```sh
 sudo apt-get install libsnmp-dev snmp-mibs-downloader
 ```

* clang-format

 ```sh
 sudo apt-get install clang-format-9
 ```

* Agent
<!-- https://kifarunix.com/install-and-configure-snmp-on-ubuntu-debian/ -->
 <!-- cp /usr/bin/net-snmp-create-v3-user ~/
 sed -ie '/prefix=/adatarootdir=${prefix}\/share' /usr/bin/net-snmp-create-v3-user -->
 ```sh
 sudo apt-get install snmpd
 cp /etc/snmp/snmpd.conf /etc/snmp/snmpd.conf.orig
 net-snmp-create-v3-user -ro -A STrP@SSWRD -a SHA -X STr0ngP@SSWRD -x AES snmpadmin
 https://www.sysadmin.md/snmpv3-users-cheatsheet.html
 ```
 <!-- snmpwalk -v3 -a SHA -A STrP@SSWRD -x AES -X STr0ngP@SSWRD -l authPriv -u snmpadmin 192.168.220.129 >> /home/user/Centom/output.txt -->
### Executing program

```sh
git clone https://github.com/smmir-cent/Centom.git
mkdir build ; cd build 
cmake .. ; make -j4
## test:
centom_engine [-walk | -get] [ip] [OIDs]
```
### Executing Backend

```sh
git clone https://github.com/smmir-cent/Centom.git
cd backend
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
sqlite3 project/db.sqlite
```

```sql
CREATE TABLE user (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	surname TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	mobile_number TEXT NOT NULL,
	password TEXT NOT NULL
);
```

```sh
python3 -m project.__init__
```
