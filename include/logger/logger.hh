#ifndef LOGGER
#define LOGGER
#include <spdlog/spdlog.h>

#include <iostream>

#include "spdlog/sinks/syslog_sink.h"
class Logger {
 private:
  std::shared_ptr<spdlog::logger> syslog_logger;

  Logger() {
    // std::cout << "Called constructor of Logger" << std::endl;
    try {
      this->syslog_logger =
          spdlog::syslog_logger_st("syslog", "centom", LOG_PID);
    } catch (const spdlog::spdlog_ex &ex) {
      std::cout << "Log failed: " << ex.what() << std::endl;
      exit(-1);
    }
  }

  Logger(Logger const &) = delete;
  void operator=(Logger const &) = delete;

 public:
  // ~Logger() { std::cout << "Called destructor of Logger" << std::endl; }

  static Logger &get_logger() {
    static Logger new_loger;
    return new_loger;
  }

  void setLevel(std::string level) {
    if (level == "trace")
      this->syslog_logger->set_level(spdlog::level::trace);
    else if (level == "debug")
      this->syslog_logger->set_level(spdlog::level::debug);
    else if (level == "info")
      this->syslog_logger->set_level(spdlog::level::info);
    else if (level == "warn")
      this->syslog_logger->set_level(spdlog::level::warn);
    else if (level == "error")
      this->syslog_logger->set_level(spdlog::level::err);
    else if (level == "critical")
      this->syslog_logger->set_level(spdlog::level::critical);
    else
      this->syslog_logger->set_level(spdlog::level::debug);
  }

  template <typename... Args>
  void trace(const char *fmt, const Args... args) {
    this->syslog_logger->trace(fmt, args...);
  }

  template <typename... Args>
  void debug(const char *fmt, const Args... args) {
    this->syslog_logger->debug(fmt, args...);
  }

  template <typename... Args>
  void info(const char *fmt, const Args... args) {
    this->syslog_logger->info(fmt, args...);
  }

  template <typename... Args>
  void warn(const char *fmt, const Args... args) {
    this->syslog_logger->warn(fmt, args...);
  }

  template <typename... Args>
  void error(const char *fmt, const Args... args) {
    this->syslog_logger->error(fmt, args...);
  }

  template <typename... Args>
  void critical(const char *fmt, const Args... args) {
    this->syslog_logger->critical(fmt, args...);
  }
};

Logger &logger = Logger::get_logger();

#define TRACE(...) logger.trace(__VA_ARGS__)
#define DEBUG(...) logger.debug(__VA_ARGS__)
#define INFO(...) logger.info(__VA_ARGS__)
#define WARN(...) logger.warn(__VA_ARGS__)
#define ERROR(...) logger.error(__VA_ARGS__)
#define CRITICAL(...) logger.critical(__VA_ARGS__)

#endif
