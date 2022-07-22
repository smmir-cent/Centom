
#include "snmp/session.hh"

#include <iostream>

// sets host to scan and OIDs to request
Session::Session(std::string host, std::vector<const char *> oids)
    : requestedOIDs(oids), ip(host) {}

// gets session going
void Session::startSession(std::string community_username, std::string password)
{
  // initializes asynchronous session
  snmp_sess_init(&session);

  // sets IP address of host that is to be scanned
  session.peername = (char *)ip.c_str();

  // sets SNMP version number
#ifdef SNMP_MODE_V1
  session.version = SNMP_VERSION_1;
#elifdef SNMP_MODE_V2C
  session.version = SNMP_VERSION_2c;
#else
  session.version = SNMP_VERSION_3;
#endif
  // session.community = community_username;

  // // sets length of community string
  // session.community_len =
  //     strlen(reinterpret_cast<const char *>(session.community));

  // sets SNMP authentication
  switch (snmpMode)
  {
  case SNMP_MODE_V1:
    session.version = SNMP_VERSION_1;
    session.community = (unsigned char *)community_username.c_str();
    session.community_len = strlen(community_username.c_str());
    break;
  case SNMP_MODE_V2C:
    session.version = SNMP_VERSION_2c;
    session.community = (unsigned char *)community_username.c_str();
    session.community_len = strlen(community_username.c_str());
    break;
  case SNMP_MODE_V3_MD5:
    session.community = NULL;
    session.community_len = 0;
    session.version = SNMP_VERSION_3;
    session.securityLevel = SNMP_SEC_LEVEL_AUTHNOPRIV;
    session.securityAuthProto = usmHMACMD5AuthProtocol;
    session.securityAuthProtoLen = USM_AUTH_PROTO_MD5_LEN;
    session.securityName = strdup(community_username.c_str());
    session.securityNameLen = strlen(community_username.c_str());
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
    // YMI Added 2009.7.31
    break;
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
    break;
  }

  // establishes the session asynchronously
  establishedSession = snmp_sess_open(&session);

  if (!establishedSession)
  {
    // outputs error message and exits if session could not be created
    snmp_sess_perror("Session could not be created", &session);
    exit(1);
  }
  for (int i = 0; i < requestedOIDs.size(); i++)
  {
    // creates the PDU for the data for request by using GETNEXT
    snmpPDU = snmp_pdu_create(SNMP_MSG_GETNEXT);

    // sets OID length
    lenOID = MAX_OID_LEN;
    read_objid(requestedOIDs.at(i), OID, &lenOID);
    // parses OID from vector into OID
    /////////////////////////////////////////////////////////////////////////////
    // if (!snmp_parse_oid(requestedOIDs.at(i), OID, &lenOID)) {
    //   // if there is any error (OID does not exist, OID faulty, ...), outputs
    //   // OID and goes on
    //   snmp_perror(requestedOIDs.at(i));
    // }

    // adds NULL value to end of PDU
    // for SNMPSET PDU put in the value to set the OID to
    snmp_add_null_var(snmpPDU, OID, lenOID);

    // sends the request out asynchronously
    // stores returned data in clientResponse variable
    status =
        snmp_sess_synch_response(establishedSession, snmpPDU, &clientResponse);

    // processes and checks the clientResponse
    if (status == STAT_SUCCESS && nullptr != clientResponse)
    {
      // SUCCESS: Continues with writing clientResponse to UI
      // gets variables from clientResponse and iterates through them as long as
      // they are not NULL
      for (variables = clientResponse->variables; variables;
           variables = variables->next_variable)
      {
        // creates buffer for variable data
        char buf[1024];
        // snprintf -> writes formatted output to sized buffer
        // writes important variable data to sized buffer
        snprint_variable(buf, sizeof(buf), variables->name,
                         variables->name_length, variables);
        // writes host IP at beginning of message for UI
        std::string message = ip;
        message.append(":");
        // appends scanned data to message for UI
        message.append(buf);
        std::cout << "****************\n";
        std::cout << message.c_str() << "\n";
        std::cout << "****************\n";
      }
    }
    else
    {
      // FAILURE: prints what went wrong
      if (status == STAT_SUCCESS)
      {
        // prints out reason for error in packet
        std::cerr << "Error in packet\nReason: "
                  << snmp_errstring(clientResponse->errstat) << std::endl;
      }
      else
      {
        // this section is mostly only called if packet times out
        // section is empty for better performance and less verbose output in
        // CLI
      }
    }
    if (clientResponse)
    {
      // frees clientResponse for next request
      snmp_free_pdu(clientResponse);
    }
  }
  // closes session asynchronously
  snmp_sess_close(establishedSession);
}
