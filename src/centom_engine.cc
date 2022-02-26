
#include <iostream>

#include "rapidjson/document.h"
#include "rapidjson/filereadstream.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include "spdlog/sinks/syslog_sink.h"
#include "spdlog/spdlog.h"

namespace rj = rapidjson;

int main(int argc, char** argv) {
  // test spdlog
  spdlog::info("Welcome to spdlog!");
  spdlog::error("Some error message with arg: {}", 1);

  spdlog::warn("Easy padding in numbers like {:08d}", 12);
  spdlog::critical(
      "Support for int: {0:d};  hex: {0:x};  oct: {0:o}; bin: {0:b}", 42);
  spdlog::info("Support for floats {:03.2f}", 1.23456);
  spdlog::info("Positional args are {1} {0}..", "too", "supported");
  spdlog::info("{:<30}", "left aligned");

  spdlog::set_level(spdlog::level::debug);  // Set global log level to debug
  spdlog::debug("This message should be displayed..");

  // change log pattern
  spdlog::set_pattern("[%H:%M:%S %z] [%n] [%^---%L---%$] [thread %t] %v");

  // Compile time log levels
  // define SPDLOG_ACTIVE_LEVEL to desired level
  SPDLOG_TRACE("Some trace message with param {}", 42);
  SPDLOG_DEBUG("Some debug message");

  std::string ident = "centom";
  auto syslog_logger = spdlog::syslog_logger_mt("syslog", ident, LOG_PID);
  syslog_logger->warn("This is warning that will end up in syslog.");

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
}