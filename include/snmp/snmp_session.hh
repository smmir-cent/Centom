#ifndef SNMP_SESSION_HH
#define SNMP_SESSION_HH
extern "C" {
#include <net-snmp/net-snmp-config.h>
#include <net-snmp/net-snmp-includes.h>
}

#include <string>

class SNMPSession {
 private:
  std::string target;
  int snmp_version;
  netsnmp_session session;

 public:
  SNMPSession(std::string target, int snmp_version);
  void initSession();
  ~SNMPSession();
};

#endif  // SNMP_SESSION_HH
