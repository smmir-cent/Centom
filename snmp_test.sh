#!/bin/bash

net-snmp-config --create-snmpv3-user -ro -a MD5 -A "PMD51111" uMD5

snmpwalk -v3 -u uMD5 -l AuthNoPriv -a MD5 -A PMD51111 localhost hrDeviceDescr

snmpwalk -v3 -u uMD5 -l AuthNoPriv -a MD5 -A PMD51111 localhost >> output.txt


## todo