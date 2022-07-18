#ifndef SNMP_GET_NEXT_HH
#define SNMP_GET_NEXT_HH

#include "snmp/snmp_message.hh"

class SNMPGetNext : public SNMPMessage {
 private:
 public:
  SNMPGetNext();
  ~SNMPGetNext();
};

#endif