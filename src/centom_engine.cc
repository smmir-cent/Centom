
#include <iostream>

#include "logger/logger.hh"
#include "rapidjson/document.h"
#include "rapidjson/filereadstream.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include "spdlog/sinks/syslog_sink.h"
#include "spdlog/spdlog.h"
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
  spdlogTest();
}