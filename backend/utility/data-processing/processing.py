


def extract_snmp_value(output):
    final_res = ''
    types = {
        "Hex_STRING":'= Hex-STRING: ',
        "counter32":'= Counter32: ',
        "integer":'= INTEGER: ',
        "string":'= STRING: ',
        "gauge32":'= Gauge32: ',
        "oid":'= OID: ',
        "counter64":'= Counter64: ',
        "timeticks":'= Timeticks: ',
        "ipAddress":'= IpAddress: ',
        "bits":'= BITS: '
        }
    for item in types.keys():
        if types[item] in output :
            res = output.split(types[item], 1)
            final_res = res[1]

    # print(final_res)
    return final_res.strip('\n')



