#include "snmp/snmp_session.hh"

#include <memory>
SNMPSession::SNMPSession(std::string target, int snmp_version,
                         std::string community) {
  this->target = target;
  this->snmp_version = snmp_version;
  this->community = community;

  // initSession();
}
void SNMPSession::initSession() {
  snmp_sess_init(&(this->session)); /* set up defaults */
  strcpy(this->session.peername, this->target.c_str());
  this->session.version = this->snmp_version;
  // set up the authentication parameters
  char* temp;
  strcpy(temp, this->community.c_str());
  this->session.community = (u_char*)temp;
  this->session.community_len = strlen((char*)session.community);
  SOCK_STARTUP;
  this->ss = snmp_open(&(this->session)); /* establish the session */
  if (!ss) {
    snmp_sess_perror("ack", &(this->session));
    SOCK_CLEANUP;
    // logging
    return;
  }
  // logging
}

void SNMPSession::sendSynchRequest(SNMPMessage snmpMessage) {
  netsnmp_pdu* response;
  // logging
  int status = snmp_synch_response(this->ss, snmpMessage.getPdu(), &response);
  if (status == STAT_SUCCESS && response->errstat == SNMP_ERR_NOERROR) {
    // logging
    int count = 1;
    netsnmp_variable_list* vars;
    for (vars = response->variables; vars; vars = vars->next_variable)
      print_variable(vars->name, vars->name_length, vars);
    for (vars = response->variables; vars; vars = vars->next_variable) {
      if (vars->type == ASN_OCTET_STR) {
        char* sp = (char*)malloc(1 + vars->val_len);
        memcpy(sp, vars->val.string, vars->val_len);
        sp[vars->val_len] = '\0';
        printf("value #%d is a string: %s\n", count++, sp);
        free(sp);
      } else
        printf("value #%d is NOT a string! Ack!\n", count++);
      // logging
    }
  } else {
    // logging
    if (status == STAT_SUCCESS)
      fprintf(stderr, "Error in packet\nReason: %s\n",
              snmp_errstring(response->errstat));
    else if (status == STAT_TIMEOUT)
      fprintf(stderr, "Timeout: No response from %s.\n", session.peername);
    else
      snmp_sess_perror("snmpdemoapp", ss);
  }
  if (response) snmp_free_pdu(response);
}

void SNMPSession::initSession() {
  snmp_close(this->ss);
  // logging
}

SNMPSession::~SNMPSession() {}
