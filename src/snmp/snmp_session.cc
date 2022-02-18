#include "snmp/snmp_session.hh"

SNMPSession::SNMPSession(std::string target, int snmp_version) {
  this->target = target;
  this->snmp_version = snmp_version;
  initSession();
}
void SNMPSession::initSession() {
  snmp_sess_init(&session); /* set up defaults */
  strcpy(session.peername, target.c_str());
  session.version = this->snmp_version;
}

SNMPSession::~SNMPSession() {}
