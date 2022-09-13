import subprocess
import math
import json
import sys
import time
from datetime import datetime
sys.path.insert(1,'./utility/net-config')
sys.path.insert(1,'./utility/data-processing')
from net_config import get_ip_net_config
from net_config import save_oid_value
from net_config import get_oid_value
from net_config import get_uname_passwd
from processing import extract_snmp_value
format_date = "%m/%d/%Y, %H:%M:%S"


def monitoring(ip,network,name,location,description):
    # redis_cache = redis.Redis(host='localhost', port=6379, db=0)
    uname,passwd = get_uname_passwd(ip,network)
    args = ['../build/centom_engine','-uname',uname,'-passwd',passwd,'-get',ip]
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
        oid_val_rate[item['params_name']] = {
            'oid':item['oid'],
            'rate':int(item['rate'])            
        }
        rates.append(int(item['rate']))
    print(json.dumps(oid_val_rate, indent=4))
    reates_gcd = math.gcd(*rates)
    print(reates_gcd)
    counter = 0
    params_info = {}
    params_info['params'] = list(oid_val_rate.keys())
    print(list(oid_val_rate.keys()))
    print(json.dumps(params_info, indent=4))
    
    yield f"data: {json.dumps(params_info)} \n\n"


    un_id,output = get_oid_value(ip,network,params_info['params'])
    
    print("***********************************************")
    print(un_id)
    print(json.dumps(output, indent=4))
    for par in output.keys():
        for item in output[par]:
            yield f"data:{json.dumps(item)}\n\n"
    print("***********************************************")

    while True:
        json_data = {}
        for item in params:
            if counter % int(item['rate']) == 0:
                ## run snmpcore for each item based on timeline
                args.append(item['oid'])
                # print(args)
                output = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
                args.pop()
                ## extract_snmp_value
                value = extract_snmp_value(output)
                # add to json_data
                json_data[item['params_name']] = {'time':datetime.now().strftime(format_date),'value':value}
        if len(json_data) != 0:
            print("#####################")
            print(json.dumps(json_data, indent=4))
            for param in json_data.keys():
                un_id += 1
                save_oid_value(ip,network,param,un_id,json_data[param]['time'],json_data[param]['value'])
                
            print("#####################")
            yield f"data:{json.dumps(json_data)}\n\n"
        time.sleep(reates_gcd)
        counter += reates_gcd
        # if counter ==10:
        #     break

if __name__ == '__main__':
    while True:
        print(extract_snmp_value(input()))
