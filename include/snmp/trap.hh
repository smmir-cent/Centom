#ifndef TRAP_HH
#define TRAP_HH

#include <sys/socket.h>
#include <netinet/in.h>
#include <string.h>
#include <stdio.h>
#include <arpa/inet.h>
#include <iostream>

// defines port for sever to listen for traps
#define PORT 162
// sets buffer size for traps
#define BUFFER 1024

#include <mutex>

class TrapListener
{
    int doListen = true;
    // sets variable for server running on socket
    int socketServer;
    // sets buffer where trap data is stored
    char receivedData[BUFFER]{};
    // sets variables for server and client addresses
    sockaddr_in addressServer{}, addressClient{};

private:
    // decodes trap data to human readable form
    std::string decodeData(const char *command, std::string &address);

    // // writes data to list in UI
    // void writeToUI(const std::string &trap_result);

public:
    // constructor that gets pointer to UI list
    TrapListener();

    // listens for new incoming traps
    void listen();
};

#endif // TRAP_HH
