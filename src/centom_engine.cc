
#include <net-snmp/net-snmp-config.h>
#include <net-snmp/net-snmp-includes.h>

#include <iostream>

#include "logger/logger.hh"
#include "rapidjson/document.h"
#include "rapidjson/filereadstream.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
namespace rj = rapidjson;
extern Logger& logger;

void spdlogTest() {
  TRACE("TRACE");
  DEBUG("DEBUG");
  INFO("INFO");
  WARN("WARN");
  ERROR("ERROR");
  CRITICAL("CRITICAL");
}

void snmpTest() {
  netsnmp_session session, *ss;
  netsnmp_pdu* pdu;
  netsnmp_pdu* response;
  oid anOID[MAX_OID_LEN];
  size_t anOID_len;

  netsnmp_variable_list* vars;
  int status;
  int count = 1;

  /*
   * Initialize a "session" that defines who we're going to talk to
   */
  snmp_sess_init(&session); /* set up defaults */
  session.peername = strdup("localhost");
  printf("%s:%d\n", __FILE__, __LINE__);

  /* set up the authentication parameters for talking to the server */

  /* set the SNMP version number */
  session.version = SNMP_VERSION_1;

  char* temp = (char*)"public";
  session.community = (u_char*)temp;
  session.community_len = strlen((char*)session.community);

  SOCK_STARTUP;
  ss = snmp_open(&session); /* establish the session */

  if (!ss) {
    snmp_sess_perror("ack", &session);
    SOCK_CLEANUP;
    exit(1);
  }

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

  snmp_add_null_var(pdu, anOID, anOID_len);

  /*
   * Send the Request out.
   */
  status = snmp_synch_response(ss, pdu, &response);

  /*
   * Process the response.
   */

  if (status == STAT_SUCCESS && response->errstat == SNMP_ERR_NOERROR) {
    /*
     * SUCCESS: Print the result variables
     */

    for (vars = response->variables; vars; vars = vars->next_variable)
      print_variable(vars->name, vars->name_length, vars);

    /* manipuate the information ourselves */
    for (vars = response->variables; vars; vars = vars->next_variable) {
      if (vars->type == ASN_OCTET_STR) {
        char* sp = (char*)malloc(1 + vars->val_len);
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

  /*
   * Clean up:
   *  1) free the response.
   *  2) close the session.
   */
  if (response) snmp_free_pdu(response);
  snmp_close(ss);

  SOCK_CLEANUP;
}

void newSnmpTest() {
  // snmpwalk -v2c -c public localhost > output.txt
}

// snmpget -v 1 -c public localhost .1.3.6.1.2.1.1.1.0

int main(int argc, char** argv) {
  FILE* fp = fopen("/etc/centom/centom.json", "r");

  char readBuffer[65536];
  rj::FileReadStream is(fp, readBuffer, sizeof(readBuffer));

  rj::Document document;
  document.ParseStream(is);

  std::cout << "-------------------------------------------------------------"
            << std::endl;
  std::cout << "log_level: " << document["log_level"].GetString() << std::endl;
  std::cout << "snmp_version: " << document["snmp_version"].GetInt()
            << std::endl;
  fclose(fp);
  logger.setLevel(document["log_level"].GetString());
  // spdlog test
  spdlogTest();
  // spdlog test
  // snmp hello
  // snmpTest();
  // snmp hello
  newSnmpTest();
}