#ifndef SNMP_GET_HH
#define SNMP_GET_HH

#include "snmp/snmp_message.hh"

class SNMPGet : public SNMPMessage {
 private:
 public:
  SNMPGet();
  ~SNMPGet();
};

#endif  // SNMP_GET_HH