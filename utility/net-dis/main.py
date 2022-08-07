import subprocess
import sys
import ipaddress

system_oid = '1.3.6.1.2.1.1'

def ip_validation(address):
    try:
        ip_net = ipaddress.IPv4Network(address)

        if isinstance(ip_net, ipaddress.IPv4Network) and ('/' in address):
            # print("{} is an IPv4 network".format(address))
            return True
        else:
            raise ValueError 
    except ValueError:
        print("{} is an invalid IP address/or network".format(address))
        exit()



if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("not enough args(subnet)")
        print("usage: python3 net-dis/main.py [ip]")
        exit()

    ip_validation(sys.argv[1])
    targets = []
    mask = int(sys.argv[1].split('/',1)[1])

    for ip in ipaddress.IPv4Network(sys.argv[1]):
        # print(ip)
        bin_ip = ('.'.join([bin(int(x)+256)[3:] for x in str(ip).split('.')])).replace('.','')
        host_bits = bin_ip[mask-32:]
        if '0' in host_bits and '1' in host_bits:
            args = ['../build/centom_engine','-systest']
            args.extend([str(ip)])
            engine_result = subprocess.run(args, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
            result_out = engine_result.stdout.decode('utf-8')
            result_err = engine_result.stderr.decode('utf-8')

            if "Timeout".lower() in result_out.lower() or "Timeout".lower() in result_err.lower():
                print(f'{str(ip)} is dead')
                pass
            else:
                print(f'{str(ip)} is alive')
                targets.append(ip)
    
    print("alive servers/switches/routers")
    print(targets)


