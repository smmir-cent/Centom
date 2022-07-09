cmake_minimum_required(VERSION 3.10)

project(Centom)

## find net-snmp libraries
FIND_LIBRARY ( NETSNMP_LIBRARY          NAMES netsnmp           )
FIND_LIBRARY ( NETSNMPAGENT_LIBRARY     NAMES netsnmpagent      )
FIND_LIBRARY ( NETSNMPMIBS_LIBRARY      NAMES netsnmpmibs       )
FIND_LIBRARY ( NETSNMPTRAPD_LIBRARY     NAMES netsnmptrapd      )
FIND_LIBRARY ( SNMP_LIBRARY             NAMES snmp              )
SET ( SNMP_LIBRARIES ${NETSNMP_LIBRARY} ${NETSNMPAGENT_LIBRARY} ${NETSNMPHELPERS_LIBRARY} ${NETSNMPMIBS_LIBRARY} ${NETSNMPTRAPD_LIBRARY} ${SNMP_LIBRARY} )

include_directories(./third-party/)
include_directories(./include)

# add_executable(main src/main.cc)
# add_executable(engine src/engine.cc)
add_executable(centom_engine src/centom_engine.cc)
target_link_libraries(centom_engine ${SNMP_LIBRARIES})

# found libraries linked into main 
# target_link_libraries(main ${SNMP_LIBRARIES})
# target_link_libraries(engine ${SNMP_LIBRARIES})