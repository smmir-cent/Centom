import redis
import subprocess
import math
import time
sys.path.insert(1,'./utility/net-config')
from net_config import get_ip_net_config


def extract_snmp_value(output):
    value = output
    return value



def monitoring(ip,network,name,location,description):
    redis_cache = redis.Redis(host='localhost', port=6379, db=0)
    args = ['../build/centom_engine','-get',ip]
    args.append(name)
    name_res = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
    args.pop()

    args.append(location)
    location_res = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
    args.pop()

    args.append(description)
    description_res = subprocess.run(args, stdout=subprocess.PIPE).stdout.decode('utf-8')
    args.pop()
    # todo: send json info first
    {'name_res':extract_snmp_value(name_res),'location_res':extract_snmp_value(location_res),'description_res':extract_snmp_value(description_res)}
    json_config = get_ip_net_config(ip , network)
    params = json_config['params']
    oid_val_rate = {}
    rates = []
    for item in params:
        oid_val_rate[item['name']] = {{
            'oid':item['oid'],
            'rate':item['rate']            
        }}
        rates.append(item['rate'])
    reates_gcd = math.gcd(rates)
    counter = 0
    while True:
        json_data = {}
        for item in params:
            if counter % item['rate'] == 0:
                pass
                ## run snmpcore for each item based on timeline
                ## extract_snmp_value
                # add to json_data
        
        yield f"data:{json_data}\n\n"
        counter += reates_gcd
        time.sleep(reates_gcd)

if __name__ == '__main__':
    pass