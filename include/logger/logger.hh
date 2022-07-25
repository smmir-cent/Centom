#ifndef LOGGER
#define LOGGER
#include <spdlog/spdlog.h>

#include <iostream>

#include "spdlog/sinks/stdout_color_sinks.h"
#include "spdlog/sinks/syslog_sink.h"
class Logger {
 private:
  std::shared_ptr<spdlog::logger> logger;

  Logger() {
    // std::cout << "Called constructor of Logger" << std::endl;
    try {
      this->logger = spdlog::stdout_color_mt("console");
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
      this->logger->set_level(spdlog::level::trace);
    else if (level == "debug")
      this->logger->set_level(spdlog::level::debug);
    else if (level == "info")
      this->logger->set_level(spdlog::level::info);
    else if (level == "warn")
      this->logger->set_level(spdlog::level::warn);
    else if (level == "error")
      this->logger->set_level(spdlog::level::err);
    else if (level == "critical")
      this->logger->set_level(spdlog::level::critical);
    else
      this->logger->set_level(spdlog::level::debug);
  }

  template <typename... Args>
  void trace(const char *fmt, const Args... args) {
    this->logger->trace(fmt, args...);
  }

  template <typename... Args>
  void debug(const char *fmt, const Args... args) {
    this->logger->debug(fmt, args...);
  }

  template <typename... Args>
  void info(const char *fmt, const Args... args) {
    this->logger->info(fmt, args...);
  }

  template <typename... Args>
  void warn(const char *fmt, const Args... args) {
    this->logger->warn(fmt, args...);
  }

  template <typename... Args>
  void error(const char *fmt, const Args... args) {
    this->logger->error(fmt, args...);
  }

  template <typename... Args>
  void critical(const char *fmt, const Args... args) {
    this->logger->critical(fmt, args...);
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
