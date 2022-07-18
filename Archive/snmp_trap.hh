#ifndef SNMP_TRAP_HH
#define SNMP_TRAP_HH

#include "snmp/snmp_message.hh"

class SNMPTrap : public SNMPMessage {
 private:
 public:
  SNMPTrap();
  ~SNMPTrap();
};

#endif  // SNMP_TRAP_HH
