
#include <net-snmp/net-snmp-config.h>
#include <net-snmp/net-snmp-includes.h>

#include <iostream>
#include <string>
#include <vector>
#include "structures.hh"
#include "logger/logger.hh"
#include "rapidjson/document.h"
#include "rapidjson/filereadstream.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include "snmp/session.hh"
namespace rj = rapidjson;

extern Logger &logger;
SnmpMode snmpMode = SNMP_MODE_V2C;

void spdlogTest()
{
  TRACE("TRACE");
  DEBUG("DEBUG");
  INFO("INFO");
  WARN("WARN");
  ERROR("ERROR");
  CRITICAL("CRITICAL");
}

void snmpTest()
{
  netsnmp_session session, *ss;
  netsnmp_pdu *pdu;
  netsnmp_pdu *response;
  oid anOID[MAX_OID_LEN];
  size_t anOID_len;

  netsnmp_variable_list *vars;
  int status;
  int count = 1;

  /*
   * Initialize a "session" that defines who we're going to talk to
   */
  snmp_sess_init(&session); /* set up defaults */
  session.peername = strdup("localhost");
  printf("%s:%d\n", __FILE__, __LINE__);
  // session.version = SNMP_VERSION_1;

  /* set up the authentication parameters for talking to the server */

  /////////////////////////////////////////////////////////////////////////
  // net-snmp-create-v3-user -ro -A STrP@SSWRD -a MD5 MD5User
  // snmpwalk -v3 -u MD5User -l AuthNoPriv -a MD5 -A STrP@SSWRD 192.168.220.129
  /* Use SNMPv3 to talk to the experimental server */

  /* set the SNMP version number */
  // session.community = NULL;
  // session.community_len = 0;
  // session.version = SNMP_VERSION_3;
  // const char *our_v3_passphrase = "PMD51111";

  // /* set the SNMPv3 user name */
  // session.securityName = strdup("uMD5");
  // session.securityNameLen = strlen(session.securityName);

  // /* set the security level to authenticated, but not encrypted */
  // session.securityLevel = SNMP_SEC_LEVEL_AUTHNOPRIV;

  // /* set the authentication method to MD5 */
  // session.securityAuthProto = (oid *)netsnmp_memdup(usmHMACMD5AuthProtocol,
  //                                                   sizeof(usmHMACMD5AuthProtocol));
  // session.securityAuthProtoLen = sizeof(usmHMACMD5AuthProtocol) / sizeof(oid);
  // session.securityAuthKeyLen = USM_AUTH_KU_LEN;

  // /* set the authentication key to a MD5 hashed version of our
  //    passphrase "The Net-SNMP Demo Password" (which must be at least 8
  //    characters long) */
  // if (generate_Ku(session.securityAuthProto,
  //                 session.securityAuthProtoLen,
  //                 (u_char *)our_v3_passphrase, strlen(our_v3_passphrase),
  //                 session.securityAuthKey,
  //                 &session.securityAuthKeyLen) != SNMPERR_SUCCESS)
  // {
  //   // snmp_perror(argv[0]);
  //   snmp_log(LOG_ERR,
  //            "Error generating Ku from authentication pass phrase. \n");
  //   std::cout << "----------------------\n";
  //   exit(1);
  // }

  /////////////////////////////////////////////////////////////////////////
  //#################################################################################################################
  SnmpMode mode = SnmpMode::SNMP_MODE_V3_MD5;
  char *snmp_com = (char *)"public";
  std::string username = "uMD5";
  std::string password = "PMD51111";

  init_snmp("snmpapp");
  switch (mode)
  {
  case SNMP_MODE_V1:
    session.version = SNMP_VERSION_1;
    session.community = (unsigned char *)snmp_com;
    session.community_len = strlen(snmp_com);
    break;
  case SNMP_MODE_V2C:
    session.version = SNMP_VERSION_2c;
    session.community = (unsigned char *)snmp_com;
    session.community_len = strlen(snmp_com);
    break;
  case SNMP_MODE_V3_MD5:
    session.community = NULL;
    session.community_len = 0;
    session.version = SNMP_VERSION_3;
    session.securityLevel = SNMP_SEC_LEVEL_AUTHNOPRIV;
    session.securityAuthProto = usmHMACMD5AuthProtocol;
    session.securityAuthProtoLen = USM_AUTH_PROTO_MD5_LEN;
    session.securityName = strdup(username.c_str());
    session.securityNameLen = strlen(username.c_str());
    session.securityAuthKeyLen = USM_AUTH_KU_LEN;
    if (generate_Ku(session.securityAuthProto,
                    session.securityAuthProtoLen,
                    (u_char *)password.c_str(), strlen(password.c_str()),
                    session.securityAuthKey,
                    &session.securityAuthKeyLen) != SNMPERR_SUCCESS)
    {
      std::cout << "snmp error(generate_Ku)\n";
    }
    break;

  case SNMP_MODE_V3_MD5_DES:
    // session.version = SNMP_VERSION_3;
    // session.securityLevel = SNMP_SEC_LEVEL_AUTHPRIV;
    // session.securityAuthProto = usmHMACMD5AuthProtocol;
    // session.securityAuthProtoLen = USM_AUTH_PROTO_MD5_LEN;
    // session.securityPrivProto = usmDESPrivProtocol;
    // session.securityPrivProtoLen = USM_PRIV_PROTO_DES_LEN;
    // session.securityName = szComOrUser;
    // session.securityNameLen = strlen(szComOrUser);
    // session.securityAuthKeyLen = USM_AUTH_KU_LEN;
    // if (generate_Ku(session.securityAuthProto,
    //                 session.securityAuthProtoLen,
    //                 (u_char *)szPasswd, strlen(szPasswd),
    //                 session.securityAuthKey,
    //                 &session.securityAuthKeyLen) != SNMPERR_SUCCESS)
    // {
    //   std::cout << "snmp error(generate_Ku)\n";

    // }
    // session.securityPrivKeyLen = USM_PRIV_KU_LEN;
    // if (generate_Ku(session.securityAuthProto,
    //                 session.securityAuthProtoLen,
    //                 (u_char *)szPasswd, strlen(szPasswd),
    //                 session.securityPrivKey,
    //                 &session.securityPrivKeyLen) != SNMPERR_SUCCESS)
    // {
    //   m_wRetCode = SNMP_INTERROR;
    //   m_wStatus = SNMP_DONE;
    //   return FALSE;
    // }

    break;
  // YMI Added 2009.7.31
  case SNMP_MODE_V3_SHA:
    // session.version = SNMP_VERSION_3;
    // session.securityLevel = SNMP_SEC_LEVEL_AUTHNOPRIV;
    // session.securityAuthProto = usmHMACSHA1AuthProtocol;
    // session.securityAuthProtoLen = USM_AUTH_PROTO_SHA_LEN;
    // session.securityName = szComOrUser;
    // session.securityNameLen = strlen(szComOrUser);
    // session.securityAuthKeyLen = USM_AUTH_KU_LEN;
    // if (generate_Ku(session.securityAuthProto,
    //                 session.securityAuthProtoLen,
    //                 (u_char *)szPasswd, strlen(szPasswd),
    //                 session.securityAuthKey,
    //                 &session.securityAuthKeyLen) != SNMPERR_SUCCESS)
    // {
    //   m_wRetCode = SNMP_INTERROR;
    //   m_wStatus = SNMP_DONE;
    //   return FALSE;
    // }
    break;
  case SNMP_MODE_V3_SHA_AES:
    // session.version = SNMP_VERSION_3;
    // session.securityLevel = SNMP_SEC_LEVEL_AUTHPRIV;
    // session.securityAuthProto = usmHMACSHA1AuthProtocol;
    // session.securityAuthProtoLen = USM_AUTH_PROTO_SHA_LEN;
    // session.securityPrivProto = usmAESPrivProtocol;
    // session.securityPrivProtoLen = USM_PRIV_PROTO_AES_LEN;
    // session.securityName = szComOrUser;
    // session.securityNameLen = strlen(szComOrUser);
    // session.securityAuthKeyLen = USM_AUTH_KU_LEN;
    // if (generate_Ku(session.securityAuthProto,
    //                 session.securityAuthProtoLen,
    //                 (u_char *)szPasswd, strlen(szPasswd),
    //                 session.securityAuthKey,
    //                 &session.securityAuthKeyLen) != SNMPERR_SUCCESS)
    // {
    //   m_wRetCode = SNMP_INTERROR;
    //   m_wStatus = SNMP_DONE;
    //   return FALSE;
    // }
    // session.securityPrivKeyLen = USM_PRIV_KU_LEN;
    // if (generate_Ku(session.securityAuthProto,
    //                 session.securityAuthProtoLen,
    //                 (u_char *)szPasswd, strlen(szPasswd),
    //                 session.securityPrivKey,
    //                 &session.securityPrivKeyLen) != SNMPERR_SUCCESS)
    // {
    //   m_wRetCode = SNMP_INTERROR;
    //   m_wStatus = SNMP_DONE;
    //   return FALSE;
    // }
    break;
  default:
    break;

    //   m_wRetCode = SNMP_INTERROR;
    //   m_wStatus = SNMP_DONE;
    //   return FALSE;
    // }
    // if (session.version == SNMP_VERSION_3)
    // {
    //   struct snmp_session *pSnmpSession;
    //   session.retries = 1;                     /* Number of retries before timeout. */
    //   session.timeout = 100 * 1000;            /* Number of uS until first timeout, then exponential backoff */
    //   session.flags &= ~SNMP_FLAGS_DONT_PROBE; // YMI Added 2009.8.5
    //   pSnmpSession = snmp_open(&session);
    //   if (pSnmpSession == NULL)
    //   {
    //     m_wRetCode = SNMP_TIMEOUT;
    //     m_wStatus = SNMP_DONE;
    //     return TRUE;
    //   }
    //   snmp_close(pSnmpSession);
    //   session.retries = m_wRetry;          /* Number of retries before timeout. */
    //   session.timeout = m_wTimeOut * 1000; /* Number of uS until first timeout, then exponential backoff */
  }
  //#################################################################################################################

  // char *temp = (char *)"public";
  // session.community = (u_char *)temp;
  // session.community_len = strlen((char *)session.community);
  std::cout << "+++++++++++++++++++++\n";

  SOCK_STARTUP;
  ss = snmp_open(&session); /* establish the session */

  if (!ss)
  {
    snmp_sess_perror("ack", &session);
    SOCK_CLEANUP;
    exit(1);
  }
  std::cout << "///////////////////\n";

  /*
   * Create the PDU for the data for our request.
   *   1) We're going to GET the system.sysDescr.0 node.
   */
  pdu = snmp_pdu_create(SNMP_MSG_GET);
  anOID_len = MAX_OID_LEN;
  if (!snmp_parse_oid(".1.3.6.1.2.1.1.1.0", anOID, &anOID_len))
  {
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

  if (status == STAT_SUCCESS && response->errstat == SNMP_ERR_NOERROR)
  {
    /*
     * SUCCESS: Print the result variables
     */

    for (vars = response->variables; vars; vars = vars->next_variable)
      print_variable(vars->name, vars->name_length, vars);

    /* manipuate the information ourselves */
    for (vars = response->variables; vars; vars = vars->next_variable)
    {
      if (vars->type == ASN_OCTET_STR)
      {
        char *sp = (char *)malloc(1 + vars->val_len);
        memcpy(sp, vars->val.string, vars->val_len);
        sp[vars->val_len] = '\0';
        printf("value #%d is a string: %s\n", count++, sp);
        free(sp);
      }
      else
        printf("value #%d is NOT a string! Ack!\n", count++);
    }
  }
  else
  {
    /*
     * FAILURE: print what went wrong!
     */
    printf("%s:%d\n", __FILE__, __LINE__);

    if (status == STAT_SUCCESS)
    {
      fprintf(stderr, "Error in packet\nReason: %s\n",
              snmp_errstring(response->errstat));
      printf("%s:%d\n", __FILE__, __LINE__);
    }
    else if (status == STAT_TIMEOUT)
    {
      printf("%s:%d\n", __FILE__, __LINE__);

      fprintf(stderr, "Timeout: No response from %s.\n", session.peername);
    }
    else
    {
      printf("%s:%d\n", __FILE__, __LINE__);
      // std::cout << session.peername << std::endl;
      // std::cout << response->command << std::endl;
      // std::cout << response->contextName << std::endl;
      // std::cout << session.peername << std::endl;
      snmp_sess_perror("snmpdemoapp", ss);
      std::cout << status;

      printf("%s:%d\n", __FILE__, __LINE__);
    }
  }

  /*
   * Clean up:
   *  1) free the response.
   *  2) close the session.
   */
  if (response)
    snmp_free_pdu(response);
  snmp_close(ss);

  SOCK_CLEANUP;
}
// snmpwalk -v2c -c public localhost > output.txt

void newSnmpTest()
{
  std::vector<const char *> oids;
  const char *temp = std::string("sysName.0").c_str();
  const char *temp1 = std::string("sysDescr.0").c_str();
  const char *temp2 = std::string("sysLocation.0").c_str();
  // const char* temp = std::string("sysDescr.0").c_str();
  oids.push_back(temp);
  oids.push_back(temp1);
  oids.push_back(temp2);
  Session session("localhost", oids);
  char *temp0 = (char *)"public";
  session.startSession("uMD5", "PMD51111");
}

// snmpget -v 1 -c public localhost .1.3.6.1.2.1.1.1.0
// snmpget -v 1 -c public localhost sysDescr.0
// snmpget -v2c -c public localhost sysName.0

int main(int argc, char **argv)
{
  FILE *fp = fopen("/etc/centom/centom.json", "r");

  char readBuffer[65536];
  rj::FileReadStream is(fp, readBuffer, sizeof(readBuffer));

  rj::Document document;
  document.ParseStream(is);
  std::string log_level = document["log_level"].GetString();
  std::string snmp_version = document["snmp_version"].GetString();
  std::cout << "log_level: " << log_level << std::endl;
  std::cout << "snmp_version: " << snmp_version
            << std::endl;
  fclose(fp);
  logger.setLevel(document["log_level"].GetString());

  if (snmp_version == "SNMP_MODE_V1")
    snmpMode = SnmpMode::SNMP_MODE_V1;
  else if (snmp_version == "SNMP_MODE_V2C")
    snmpMode = SnmpMode::SNMP_MODE_V2C;
  else if (snmp_version == "SNMP_MODE_V3_MD5")
    snmpMode = SnmpMode::SNMP_MODE_V3_MD5;
  else if (snmp_version == "SNMP_MODE_V3_MD5_DES")
    snmpMode = SnmpMode::SNMP_MODE_V3_MD5_DES;
  else if (snmp_version == "SNMP_MODE_V3_SHA")
    snmpMode = SnmpMode::SNMP_MODE_V3_SHA;
  else if (snmp_version == "SNMP_MODE_V3_SHA_AES")
    snmpMode = SnmpMode::SNMP_MODE_V3_SHA_AES;
  else
    snmpMode = SnmpMode::SNMP_MODE_V2C;

  // spdlog test
  spdlogTest();
  // spdlog test
  // snmp hello
  // snmpTest();
  // snmp hello
  init_snmp("snmpapp");

  newSnmpTest();
}