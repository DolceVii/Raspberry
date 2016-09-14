#-*-coding:UTF-8-*-

#!/usr/bin/python

import MySQLdb
import os
import time
from threading import Timer
from Tkinter import *
import tkFont

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

temp_sensor = '/sys/bus/w1/devices/28-000002bf198c/w1_slave'

db = MySQLdb.connect(host="localhost", user="rasp", passwd="raspberry", db="raspberry")

def savedb():
    t2 = Timer(3600.0, savedb)
    t2.start()
    c = db.cursor()
    c.execute("INSERT INTO Temperature (temperature) VALUES (%s)", read_temp())
    db.commit()

def temp_raw():
    f = open(temp_sensor, 'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp():
    lines = temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = temp_raw()
    temp_output = lines[1].find('t=')

    if temp_output != -1:
        temp_string = lines[1].strip()[temp_output+2:]
        temp_c = float(temp_string) / 1000.0
        return '%.1f' % temp_c

def quit():
    global window
    window.destroy()
    t.cancel()
    os._exit(0)
        
window = Tk()
var = StringVar()
window.title("Θερμοκρασία από το DS18B20+ Δωμάτιο 1ο")
window.geometry("500x120+200+200")
img = PhotoImage(file='/home/pi/Programs/temp.ico')
window.tk.call('wm', 'iconphoto', window._w, img)
label1 = Label(window, text="Η θερμοκρασία αυτήν την στιγμή", fg="blue", font=("Helvetica", 18)).pack()
button = Button(window, text="Έξοδος", command=quit, fg="black", font=("Helvetica", 14, "bold")).pack(side=TOP, expand=NO)
label2 = Label(window, text="Η θερμοκρασία:", fg="red", font=("Helvetica", 28, "bold")).pack(side=LEFT, expand=YES)
label3 = Label(window, textvariable=var, fg="red", font=("Helvetica", 28, "bold")).pack(side=LEFT, expand=YES)
label4 = Label(window, text="°C", fg="red", font=("Helvetica", 28, "bold")).pack(side=LEFT, expand=YES)


t = Timer(3600.0, savedb)
t.start()

while True:
    var.set(read_temp())
    window.update()

    
window.mainloop()
