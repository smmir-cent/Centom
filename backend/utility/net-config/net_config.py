
import redis
import json
import ast
## ip_net_username ---> value
## ip_net_password ---> value
## ip_net_engineid ---> value
## ip_net ---> [oids list]
## ip_net_oidname ---> {oid , rate}
## monitoring... ip_net_oidname_time&data ---> value


def save_ip_net_config(config_json):
    redis_cache = redis.Redis(host='localhost', port=6379, db=0)

    ip = config_json['ip']
    network = config_json['network']
    username = config_json['username']
    password = config_json['password']
    engineId = config_json['engineId']
    oid_name = config_json['oid_name']
    oid_location = config_json['oid_location']
    oid_description = config_json['oid_description']
    params = config_json['params']
    key_signature = f'{ip}_{network}'
#
    ## ip_net_username ---> value
    redis_cache.set(key_signature+'_username', username)
    ## ip_net_password ---> value
    redis_cache.set(key_signature+'_password', password)
    ## ip_net_engineid ---> value
    redis_cache.set(key_signature+'_engineId', engineId)
    ## ip_net_oid_name ---> value
    redis_cache.set(key_signature+'_oid_name', oid_name)
    ## ip_net_oid_location ---> value
    redis_cache.set(key_signature+'_oid_location', oid_location)
    ## ip_net_oid_description ---> value
    redis_cache.set(key_signature+'_oid_description', oid_description)    


    ## ip_net_oidname ---> {oid , rate}
    param_list = []
    for param in params:
        param_list.append(param['name'])
        redis_cache.set(
            key_signature+'_'+param['name'],json.dumps({
                'oid':param['oid'],
                'rate':param['rate']
                }))
    ## ip_net ---> [oids list]

    print(param_list)
    redis_cache.set(key_signature+'_oids', str(param_list))

    ## monitoring... ip_net_oidname_time&data ---> value

    return True




def get_ip_net_config(ip , network):
    key_signature = f'{ip}_{network}'
    redis_cache = redis.Redis(host='localhost', port=6379, db=0)
    oids_list = []
    params = []

    username = redis_cache.get(key_signature+'_username').decode('utf-8')
    password = redis_cache.get(key_signature+'_password').decode('utf-8')
    engineId = redis_cache.get(key_signature+'_engineId').decode('utf-8')
    oid_name = redis_cache.get(key_signature+'_oid_name').decode('utf-8')
    oid_location = redis_cache.get(key_signature+'_oid_location').decode('utf-8')
    oid_description = redis_cache.get(key_signature+'_oid_description').decode('utf-8')
    oids = redis_cache.get(key_signature+'_oids').decode('utf-8')
    oids_list = ast.literal_eval(oids)
    for _name in oids_list:
        oid_val_rate = redis_cache.get(key_signature+'_'+_name).decode('utf-8')
        oid_val_rate_json = json.loads(oid_val_rate)
        # print(oid_val_rate)
        params.append({
            'name':_name,
            'oid':oid_val_rate_json['oid'],
            'rate':oid_val_rate_json['rate']
        })
        
    json_config = {}
    json_config['username'] = username
    json_config['password'] = password
    json_config['engineId'] = engineId
    json_config['oid_name'] = oid_name
    json_config['oid_location'] = oid_location
    json_config['oid_description'] = oid_description    
    json_config['params'] = params    
    return json_config

if __name__ == '__main__':
    output = get_ip_net_config('192.168.220.129','simple network')
    print(json.dumps(output, indent=4))