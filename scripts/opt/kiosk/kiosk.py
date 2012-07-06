import pymcu, subprocess, threading, time

STATE = 0 

time.sleep(10)

def initialize():
    while True:
        try:
            b = pymcu.mcuModule('/dev/button')
        except ValueError:
            continue
        if b.active:
            break
    return b

def run_x():
    while True:
        p = subprocess.Popen(['startx'])
        p.wait()

b = initialize()
t = threading.Thread(target=run_x)
t.start()

while True:
    try:
        b_state = b.digitalRead(13)
        if STATE == 0 and b_state == 1:
    	    STATE = 1
    	    subprocess.Popen(['xte', '-x', ':0', 'key Return'])
        elif STATE == 1 and b_state == 0:
           STATE = 0
        time.sleep(0.1)
    except:
        time.sleep(5)
        b = initialize()
