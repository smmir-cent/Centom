
file1 = open('../output.txt', 'r')
count = 0
final = set()
while True:
    count += 1
  
    # Get next line from file
    line = file1.readline()
  
    # if line is empty
    # end of file is reached
    if not line:
        break
    # if line.count('=') > 1:
    # print(line[line.find('='):(line.find(':',line.find('=')))+1])
    final.add(line[line.find('='):(line.find(':',line.find('=')))+2])
        # print("Line{}: {}".format(count, line.strip()))

print(count)
print(final)
file1.close()
