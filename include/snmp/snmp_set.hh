#ifndef SNMP_SET_HH
#define SNMP_SET_HH

#include "snmp/snmp_message.hh"

class SNMPSet : public SNMPMessage {
 private:
 public:
  SNMPSet();
  ~SNMPSet();
};

#endif  // SNMP_SET_HH
