#ifndef SNMP_MESSAGE_HH
#define SNMP_MESSAGE_HH
#include <string>

class SNMPMessage {
 private:
  std::string oid;

 public:
  SNMPMessage(std::string);
  ~SNMPMessage();
};

#endif  // SNMP_MESSAGE_HH
