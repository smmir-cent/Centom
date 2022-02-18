#include "snmp/snmp_message.hh"

SNMPMessage::SNMPMessage(std::string oid) {
  // set oid of snmp messange
  OID_len = MAX_OID_LEN;
  if (!snmp_parse_oid(oid.c_str(), OID, &OID_len)) {
    snmp_perror(oid.c_str());
  }
}

SNMPMessage::~SNMPMessage() {}
