import subprocess
import sys
import ipaddress
import re
import json

sys.path.insert(1,'../monitoring/monitor')
from monitor import extract_snmp_value

def ip_validation(address):
    try:
        ip_net = ipaddress.IPv4Network(address)

        if isinstance(ip_net, ipaddress.IPv4Network) and ('/' in address):
            # print("{} is an IPv4 network".format(address))
            return True
        else:
            raise ValueError 
    except ValueError:
        print("{} is an invalid IP network".format(address))
        return False

def line_iterator(str): return iter(str.splitlines())

# def vis_graph():
#     G = nx.Graph()
#     G.add_nodes_from([1,2, 3,4,5,6,7,8])
#     G.add_edge(1, 2)
#     G.add_edge(3, 2)
#     G.add_edge(1, 4)
#     G.add_edge(4, 6)
#     G.add_edge(4, 5)
#     G.add_edge(5, 7)
#     G.add_edge(7, 8)
#     pos = nx.spring_layout(G, seed=47)  # Seed layout for reproducibility
#     nx.draw(G, pos=pos, with_labels = True)
#     plt.savefig("G.png")
#     # plt.show()
#     exit()

def device_type(value):
    ## https://oidref.com/1.3.6.1.2.1.1.7
    ## https://knowledge.broadcom.com/external/article/32164/how-are-device-type-values-selected-for.html#:~:text=Determining%20the%20Device%20Type&text=The%20sysServices%20OID%20value%20type,its%20binary%20form%20is%201100101.
    bin_value = int(value)
    types = []
    if bin_value & 0b0000001 == 0b0000001:
      types.append('Repeater')  
    if bin_value & 0b0000010 == 0b0000010:
      types.append('Switch')
    if bin_value & 0b0000100 == 0b0000100:
      types.append('Router')
    if bin_value & 0b0001000 == 0b0001000 or bin_value & 0b1000000 == 0b1000000:
      types.append('Server')
    if len(types) == 0:
      types.append('Other')
    return types

      
def scan_net(net_ip):

    if not ip_validation(net_ip):
        return {}
    targets = {}
    mask = int(str(ipaddress.IPv4Network(net_ip)).split('/',1)[1])
    for ip in ipaddress.IPv4Network(net_ip):
        # print(ip)
        bin_ip = ('.'.join([bin(int(x)+256)[3:] for x in str(ip).split('.')])).replace('.','')
        host_bits = bin_ip[mask-32:]
        if '0' in host_bits and '1' in host_bits:
            uname,passwd = "uMD5","PMD51111"
            args = ['../build/centom_engine','-uname',uname,'-passwd',passwd,'-systest']
            args.extend([str(ip)])
            engine_result = subprocess.run(args, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
            result_out = engine_result.stdout.decode('utf-8')
            result_err = engine_result.stderr.decode('utf-8')

            if "Timeout".lower() in result_out.lower() or "Timeout".lower() in result_err.lower():
                print(f'{str(ip)} is dead')
            else:
                print(f'{str(ip)} is alive')
                targets[str(ip)] = device_type(extract_snmp_value(result_out))

    
    # targets = ['185.13.228.162','127.0.0.1','142.251.36.46']
    print("alive servers/switches/routers")
    print(json.dumps(targets, indent=4))

    paths = {}
    for ip in targets.keys():
        paths[str(ip)] = []
        args = ['traceroute','-I','-d','-m 3',str(ip)]
        trace_result = subprocess.run(args, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        result_out = trace_result.stdout.decode('utf-8')
        result_err = trace_result.stderr.decode('utf-8')


        for line in line_iterator(result_out):
            if 'traceroute'in line:
                continue
            match = re.search(r"\(([\d.]+)\)", line)
            if match:
                current_ip = match.group(1)
                paths[str(ip)].append(current_ip)

    print(paths)
    return paths,targets



if __name__ == "__main__":
    # vis_graph()
    if len(sys.argv) < 2:
        print("not enough args(subnet)")
        print("usage: python3 net-dis/main.py [ip]")
        exit()
    scan_net(sys.argv[1])
