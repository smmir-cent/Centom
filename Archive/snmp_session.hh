#ifndef SNMP_SESSION_HH
#define SNMP_SESSION_HH
extern "C" {
#include <net-snmp/net-snmp-config.h>
#include <net-snmp/net-snmp-includes.h>
}
#include <string>

#include "snmp/snmp_message.hh"

class SNMPSession {
 private:
  std::string target;
  int snmp_version;
  netsnmp_session session, *ss;
  std::string community;

 public:
  SNMPSession(std::string target, int snmp_version, std::string community);
  void initSession();
  void terminateSession();
  void sendSynchRequest(SNMPMessage snmpMessaage);
  void receiveResponse();
  ~SNMPSession();
};

#endif  // SNMP_SESSION_HH
