import subprocess
import time

processes = []

# Number of instances to spawn
num_instances = 1
# Command to run
command = "node buyer/client.js"

for i in range(num_instances):
    # Spawn a process
    print(f"Spawning process {i} with command: {command}")
    p = subprocess.Popen(command, stdin=subprocess.PIPE, shell=True)
    p.stdin.write(b"2\n")
    p.stdin.write(b"suresh\n")
    p.stdin.write(b"suresh\n")
    time.sleep(1)
    p.stdin.write(b"8\n")

    p.stdin.flush()
    # p.stdin.write(b"13\n")
    # p.stdin.flush()
    time.sleep(1)
    #processes.append(p)
time.sleep(5)
# Provide input to each process
# for p in processes:
    
#     p.stdin.write(b"2\nsuresh\nsuresh\n8\n")
    # p.stdin.write(b"suresh\n")
    # p.stdin.write(b"suresh\n8\n")
    # p.stdin.write(b"8\n")


    
    # p.stdin.write(b"2\n")
    # p.stdin.write(b"suresh\n")
    # p.stdin.write(b"suresh\n")
    # p.stdin.flush()
    # p.stdin.write(b"5\n")
    # p.stdin.write(b"c2\n")
    # p.stdin.write(b"2\n")

    # time.sleep(1)
    # p.stdin.write(b"6\n")
    # p.stdin.write(b"c2\n")
    # p.stdin.write(b"2\n")

    # time.sleep(1)
    # p.stdin.write(b"8\n")

    # time.sleep(1)
    # p.stdin.write(b"7\n")
    # p.stdin.write(b"13\n")

    # p.stdin.flush()
    # print(f"Sending input to process: {p.pid}")

# Wait for processes to finish
# for p in processes:
#     p.wait()

# Print output of each process
# for p in processes:
#     output = p.stdout.read().decode()
#     print(f"Output from process: {output}")



