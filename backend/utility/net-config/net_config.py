
import redis
import json

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
#
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


if __name__ == '__main__':
    pass