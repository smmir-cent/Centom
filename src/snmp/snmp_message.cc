#include "snmp/snmp_message.hh"

SNMPMessage::SNMPMessage(std::string oid) {
  // set oid of snmp messange
  pdu = snmp_pdu_create(SNMP_MSG_GET);
  OID_len = MAX_OID_LEN;
  if (!snmp_parse_oid(oid.c_str(), OID, &OID_len)) {
    snmp_perror(oid.c_str());
    // logging
  }
  // logging
  snmp_add_null_var(pdu, OID, OID_len);
}
netsnmp_pdu* SNMPMessage::getPdu() { return this->pdu; }
SNMPMessage::~SNMPMessage() {}
