import subprocess
import math
import json
import sys
import time
from datetime import datetime
sys.path.insert(1,'./utility/net-config')
from net_config import get_ip_net_config
format_date = "%m/%d/%Y, %H:%M:%S"



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




def monitoring(ip,network,name,location,description):
    # redis_cache = redis.Redis(host='localhost', port=6379, db=0)
    args = ['../build/centom_engine','-get',ip]
    print("################################################################")
    args.append(name)
    name_res = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
    print(name_res)
    args.pop()

    args.append(location)
    location_res = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
    print(location_res)

    args.pop()

    args.append(description)
    description_res = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
    print(description_res)
    args.pop()
    # send json info first
    info = {'name_res':extract_snmp_value(name_res),'location_res':extract_snmp_value(location_res),'description_res':extract_snmp_value(description_res)}
    yield f"data: {json.dumps(info)} \n\n"
    json_config = get_ip_net_config(ip , network)
    params = json_config['params']
    oid_val_rate = {}
    rates = []
    for item in params:
        oid_val_rate[item['name']] = {
            'oid':item['oid'],
            'rate':item['rate']            
        }
        rates.append(item['rate'])
    print(json.dumps(oid_val_rate, indent=4))
    reates_gcd = math.gcd(*rates)
    print(reates_gcd)
    counter = 0
    params_info = {}
    params_info['params'] = list(oid_val_rate.keys())
    print(list(oid_val_rate.keys()))
    print(json.dumps(params_info, indent=4))
    
    yield f"data: {json.dumps(params_info)} \n\n"

    while True:
        json_data = {}
        for item in params:
            if counter % item['rate'] == 0:
                ## run snmpcore for each item based on timeline
                args.append(item['oid'])
                # print(args)
                output = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
                args.pop()
                ## extract_snmp_value
                value = extract_snmp_value(output)
                # add to json_data
                json_data[item['name']] = {'time':datetime.now().strftime(format_date),'value':value}
        if len(json_data) != 0:
            print("#####################")
            print(json.dumps(json_data, indent=4))
            print("#####################")
            yield f"data:{json.dumps(json_data)}\n\n"
        time.sleep(reates_gcd)
        counter += reates_gcd
        # if counter ==10:
        #     break

if __name__ == '__main__':
    while True:
        print(extract_snmp_value(input()))


'''
{
  "params": [
    {
      "name": "percentages_cpu",
      "oid": "ssCpuSystem.0",
      "rate": 10
    },
    {
      "name": "cpu_load_1min",
      "oid": "laLoad.1",
      "rate": 7
    }
  ]
}
'''        




'''


{"labels":["test","08/22/2022, 10:53:23","08/22/2022, 10:53:23","08/22/2022, 10:53:23","08/22/2022, 10:53:23","08/22/2022, 10:53:30","08/22/2022, 10:53:30","08/22/2022, 10:53:34","08/22/2022, 10:53:34","08/22/2022, 10:53:38","08/22/2022, 10:53:38","08/22/2022, 10:53:44","08/22/2022, 10:53:44","08/22/2022, 10:53:45","08/22/2022, 10:53:45","08/22/2022, 10:53:52","08/22/2022, 10:53:52","08/22/2022, 10:53:54","08/22/2022, 10:53:54"],"datasets":[{"label":"cpu_load_1min","data":[1,0,0.08,0,0.08,0.07,0.07,0,0,0.3,0.3,0,0,0.28,0.28,0.25,0.25,0,0],"fill":true,"backgroundColor":"rgba(75,192,192,0.2)","borderColor":"rgba(75,192,192,1)"}]}







'''