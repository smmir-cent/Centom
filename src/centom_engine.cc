
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
#include "snmp/trap.hh"
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

// snmpwalk -v2c -c public localhost > output.txt

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
  // std::cout << "log_level: " << log_level << std::endl;
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
  // spdlogTest();
  // spdlog test
  std::vector<const char *> oids;
  bool is_walk = false;
  bool is_get = false;
  bool is_trap = false;
  bool is_sys_test = false;

  if (strcmp(argv[1], "-walk") == 0)
  {
    is_walk = true;
  }
  else if (strcmp(argv[1], "-get") == 0)
  {
    is_get = true;
  }
  else if (strcmp(argv[1], "-trap") == 0)
  {
    is_trap = true;
  }
  else if (strcmp(argv[1], "-systest") == 0)
  {
    is_sys_test = true;
  }
  else
  {
    std::cout << "USAGE: centom_engine [ -walk | -get | -trap | -systest ] [ip] [OIDs]\n";
    return 1;
  }

  if (is_walk)
  {
    std::string ip(argv[2]);
    for (int i = 3; i < argc; ++i)
    {
      oids.push_back(argv[i]);
    }
    if (oids.size() == 0)
    {
      std::cout << "USAGE: centom_engine [ -walk | -get | -trap | -systest ] [ip] [OIDs]\n";
      return 1;
    }
    char *temp0 = (char *)"public";
    init_snmp("snmpapp");
    Session session(ip, "uMD5", "PMD51111");
    session.walkOids(oids);
  }
  else if (is_get)
  {
    std::string ip(argv[2]);
    for (int i = 3; i < argc; ++i)
    {
      oids.push_back(argv[i]);
    }
    if (oids.size() == 0)
    {
      std::cout << "USAGE: centom_engine [ -walk | -get | -trap | -systest ] [ip] [OIDs]\n";
      return 1;
    }
    char *temp0 = (char *)"public";
    init_snmp("snmpapp");
    Session session(ip, "uMD5", "PMD51111");

    session.getOids(oids);
  }
  else if (is_sys_test)
  {

    std::string ip(argv[2]);
    oids.push_back("system");
    char *temp0 = (char *)"public";
    init_snmp("snmpapp");
    Session session(ip, "uMD5", "PMD51111");
    session.walkOids(oids);
  }
  else if (is_trap)
  {
    TrapListener trap_listener;
    trap_listener.listen();

    // todo
  }
}