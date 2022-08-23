
import subprocess
import json

def notifying():
    print('notifying')

    args = ['../build/centom_engine','-trap']

    process = subprocess.Popen(args, stdout=subprocess.PIPE)
    print('process')

    output = {'trap':""}
    for line in iter(process.stdout.readline, b""):
        print('line')
        print(line)

        decoded_line = line.decode('utf-8')
        if 'trap --->' in decoded_line:
            output['trap'] = decoded_line
        elif 'end of trap message' in decoded_line:
            print('previous ---->')
            ## send output to client
            yield f"data: {json.dumps(output)} \n\n"
            print(output['trap'])
            print('<--- end')
            pass
        else:
            ## process
            output['trap'] += decoded_line
        

if __name__ == '__main__':
    notifying()