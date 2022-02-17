#include "snmp/snmp_message.hh"

SNMPMessage::SNMPMessage(std::string oid) {
  // set oid of snmp messange
  this->oid = oid;
}

SNMPMessage::~SNMPMessage() {}
