#include <net-snmp/net-snmp-config.h>
#include <net-snmp/net-snmp-includes.h>
#include <string.h>

// #include <string>

/* change the word "define" to "undef" to try the (insecure) SNMPv1 version */
#undef DEMO_USE_SNMP_VERSION_3

#ifdef DEMO_USE_SNMP_VERSION_3
const char *our_v3_passphrase = "The Net-SNMP Demo Password";
#endif

int main(int argc, char **argv) {
  netsnmp_session session, *ss;
  netsnmp_pdu *pdu;
  netsnmp_pdu *response;

  oid anOID[MAX_OID_LEN];
  size_t anOID_len;

  netsnmp_variable_list *vars;
  int status;

  int count = 1;

  /*
   * Initialize the SNMP library
   */
  init_snmp("snmpdemoapp");
  printf("%s:%d\n", __FILE__, __LINE__);

  /*
   * Initialize a "session" that defines who we're going to talk to
   */
  snmp_sess_init(&session); /* set up defaults */
  session.peername = strdup("localhost");
  printf("%s:%d\n", __FILE__, __LINE__);

  /* set up the authentication parameters for talking to the server */

  /* set the SNMP version number */
  session.version = SNMP_VERSION_1;
  printf("%s:%d\n", __FILE__, __LINE__);

  /* set the SNMPv1 community name used for authentication */
  // session.community = "demopublic";reinterpret_cast<const unsigned char *>(
  // "demopublic" ); strcpy( static_cast <char*>( session.community) ,
  // "demopublic" );
  // session.community;
  printf("%s:%d\n", __FILE__, __LINE__);

  // (char *)session.community;
  // u_char *temp =
  // unsigned char *temp =
  // session.community = reinterpret_cast<const unsigned char *>(
  //     std::string("demopublic").c_str());
  // strcpy((char *)session.community, "demopublic");

  char *temp = (char *)"public";
  printf("%s:%d\n", __FILE__, __LINE__);
  session.community = (u_char *)temp;
  printf("%s:%d\n", __FILE__, __LINE__);
  session.community_len = strlen((char *)session.community);

  printf("%s:%d\n", __FILE__, __LINE__);

  /*
   * Open the session
   */
  SOCK_STARTUP;
  ss = snmp_open(&session); /* establish the session */
  printf("%s:%d\n", __FILE__, __LINE__);

  if (!ss) {
    snmp_sess_perror("ack", &session);
    SOCK_CLEANUP;
    exit(1);
  }
  printf("%s:%d\n", __FILE__, __LINE__);

  /*
   * Create the PDU for the data for our request.
   *   1) We're going to GET the system.sysDescr.0 node.
   */
  pdu = snmp_pdu_create(SNMP_MSG_GET);
  anOID_len = MAX_OID_LEN;
  if (!snmp_parse_oid(".1.3.6.1.2.1.1.1.0", anOID, &anOID_len)) {
    snmp_perror(".1.3.6.1.2.1.1.1.0");
    SOCK_CLEANUP;
    exit(1);
  }
  printf("%s:%d\n", __FILE__, __LINE__);

  snmp_add_null_var(pdu, anOID, anOID_len);
  printf("%s:%d\n", __FILE__, __LINE__);

  /*
   * Send the Request out.
   */
  status = snmp_synch_response(ss, pdu, &response);
  printf("%s:%d\n", __FILE__, __LINE__);

  /*
   * Process the response.
   */
  if (status == STAT_SUCCESS && response->errstat == SNMP_ERR_NOERROR) {
    /*
     * SUCCESS: Print the result variables
     */
    printf("%s:%d\n", __FILE__, __LINE__);

    for (vars = response->variables; vars; vars = vars->next_variable)
      print_variable(vars->name, vars->name_length, vars);
    printf("%s:%d\n", __FILE__, __LINE__);

    /* manipuate the information ourselves */
    for (vars = response->variables; vars; vars = vars->next_variable) {
      if (vars->type == ASN_OCTET_STR) {
        printf("%s:%d\n", __FILE__, __LINE__);
        char *sp = (char *)malloc(1 + vars->val_len);
        memcpy(sp, vars->val.string, vars->val_len);
        sp[vars->val_len] = '\0';
        printf("value #%d is a string: %s\n", count++, sp);
        free(sp);
      } else
        printf("value #%d is NOT a string! Ack!\n", count++);
    }
  } else {
    /*
     * FAILURE: print what went wrong!
     */
    printf("%s:%d\n", __FILE__, __LINE__);

    if (status == STAT_SUCCESS)
      fprintf(stderr, "Error in packet\nReason: %s\n",
              snmp_errstring(response->errstat));
    else if (status == STAT_TIMEOUT)
      fprintf(stderr, "Timeout: No response from %s.\n", session.peername);
    else
      snmp_sess_perror("snmpdemoapp", ss);
  }
  printf("%s:%d\n", __FILE__, __LINE__);

  /*
   * Clean up:
   *  1) free the response.
   *  2) close the session.
   */
  if (response) snmp_free_pdu(response);
  snmp_close(ss);

  SOCK_CLEANUP;
  return (0);
} /* main() */

// snmpget -v 1 -c public localhost .1.3.6.1.2.1.1.1.0