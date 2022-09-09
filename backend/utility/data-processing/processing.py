import subprocess


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



def extract_snmptrap_value(output):

    # print(output["trap"])
    final_res = {'trap':""}
    types = {
        "Hex_STRING":'Hex-STRING',
        "counter32":'Counter32',
        "integer":'INTEGER',
        "string":'STRING',
        "gauge32":'Gauge32',
        "oid":'OID',
        "counter64":'Counter64',
        "timeticks":'Timeticks',
        "ipAddress":'IpAddress',
        "bits":'BITS'
        }
    obj = False
    oid = ''
    result = ''
    for line in output['trap'].splitlines():
        if 'OBJECT' in line:
            obj = True
            res = line.split('OBJECT', 1)
            oid = res[1].split(':', 1)[1]
        elif obj:
            for item in types.keys():
                if types[item] in line:
                    res = line.split(types[item], 1)
                    result = res[1].split(':', 1)[1]
    # print("----------------------------->")
    # print(oid)
    # print(result)
    # print("----------------------------->")
    args = ['snmptranslate',oid]
    snmp_translate = subprocess.run(args, stdout=subprocess.PIPE)
    oid_res = snmp_translate.stdout.decode('utf-8').strip('\n')
    final_res['trap'] = f"Received Trap -----> OID:{oid_res}, value:{result}"
    return final_res

