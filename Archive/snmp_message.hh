#ifndef SNMP_MESSAGE_HH
#define SNMP_MESSAGE_HH
#include <string>

#include "snmp/snmp_session.hh"

class SNMPMessage {
 private:
  oid OID[MAX_OID_LEN];
  size_t OID_len;
  netsnmp_pdu *pdu;

 public:
  SNMPMessage(std::string oid);
  SNMPMessage();
  netsnmp_pdu *getPdu();
  ~SNMPMessage();
};

#endif  // SNMP_MESSAGE_HH
