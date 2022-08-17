import subprocess
import sys
import ipaddress
import re


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


def scan_net(net_ip):

    if not ip_validation(net_ip):
        return {}
    targets = []
    mask = int(net_ip.split('/',1)[1])

    for ip in ipaddress.IPv4Network(net_ip):
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
                # break
    
    # targets = ['185.13.228.162','127.0.0.1','142.251.36.46']
    print("alive servers/switches/routers")
    print(targets)

    paths = {}
    for ip in targets:
        paths[str(ip)] = []
        args = ['traceroute','-I','-d','-m 3',str(ip)]
        trace_result = subprocess.run(args, stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        result_out = trace_result.stdout.decode('utf-8')
        result_err = trace_result.stderr.decode('utf-8')


        for line in line_iterator(result_out):
            if 'traceroute'in line:
                continue
            # if str(ip) in line:
            #     continue
            match = re.search(r"\(([\d.]+)\)", line)
            if match:
                current_ip = match.group(1)
                paths[str(ip)].append(current_ip)

    print(paths)
    return paths



if __name__ == "__main__":
    # vis_graph()
    if len(sys.argv) < 2:
        print("not enough args(subnet)")
        print("usage: python3 net-dis/main.py [ip]")
        exit()
    scan_net(sys.argv[1])
