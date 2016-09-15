#-*-coding:UTF-8-*-

#!/usr/bin/python

import RPi.GPIO as GPIO			# calling for header file which helps us use GPIO’s of PI
import time				# calling for time to provide delays in program
import os
import MySQLdb
from threading import Timer

from Tkinter import *
import tkFont

GPIO.setwarnings(False)			# do not show any warnings

GPIO.setmode (GPIO.BOARD)		# programming the GPIO by BOARD pin numbers. (like PIN29 is ‘GPIO5’)

GPIO.setup(11, GPIO.IN)                 # bit 0 initialize GPIO Pins as input
GPIO.setup(13, GPIO.IN)                 # bit 1
GPIO.setup(15, GPIO.IN)                 # bit 2
GPIO.setup(29, GPIO.IN)                 # bit 3
GPIO.setup(31, GPIO.IN)                 # bit 4
GPIO.setup(33, GPIO.IN)                 # bit 5
GPIO.setup(35, GPIO.IN)                 # bit 6
GPIO.setup(37, GPIO.IN)                 # bit 7

dbl = MySQLdb.connect(host="localhost", user="rasp", passwd="raspberry", db="raspberry")

def savedbs():
    t4 = Timer(3600.0, savedbs)
    t4.start()
    d = dbl.cursor()
    d.execute("INSERT INTO Presure (presure) VALUES (%s)", read_presure())
    dbl.commit()

def quits():
    global windows
    windows.destroy()
    t3.cancel()
    os._exit(0)
    
windows = Tk()
varis = StringVar()
windows.title("Μέτρηση πίεσης από MPX6115A με ADC0805")
windows.geometry("450x120+200+200")
img = PhotoImage(file='/home/pi/Programs/analog.ico')
windows.tk.call('wm', 'iconphoto', windows._w, img)
label5 = Label(windows, text="Η πίεση αυτήν την στιγμή", fg="blue", font=("Helvetica", 18)).pack()
button1 = Button(windows, text="Έξοδος", command=quits, fg="black", font=("Helvetica", 14, "bold")).pack(side=TOP, expand=NO)
label6 = Label(windows, text="Η πίεση:", fg="red", font=("Helvetica", 28, "bold")).pack(side=LEFT, expand=YES)
label7 = Label(windows, textvariable=varis, fg="red", font=("Helvetica", 28, "bold")).pack(side=LEFT, expand=YES)
label8 = Label(windows, text="hPa", fg="red", font=("Helvetica", 28, "bold")).pack(side=LEFT, expand=YES)

def read_presure():
    x = 1 

    b0 = 0				# integers for storing 8 bits
    b1 = 0
    b2 = 0
    b3 = 0
    b4 = 0
    b5 = 0
    b6 = 0
    b7 = 0
    
    if (GPIO.input(37) == True):
        time.sleep(0.01)
        if (GPIO.input(37) == True):
            b7 = 1			# if pin37 is high bit7 is true

    if (GPIO.input(35) == True):
        time.sleep(0.01)
        if (GPIO.input(35) == True):
            b6 = 1			# if pin35 is high bit6 is true

    if (GPIO.input(33) == True):
        time.sleep(0.01)
        if (GPIO.input(33) == True):
            b5 = 1			# if pin33 is high bit5 is true

    if (GPIO.input(31) == True):
        time.sleep(0.01)
        if (GPIO.input(31) == True):
            b4 = 1			# if pin31 is high bit4 is true

    if (GPIO.input(29) == True):
        time.sleep(0.01)
        if (GPIO.input(29) == True):
            b3 = 1			# if pin29 is high bit3 is true

    if (GPIO.input(15) == True):
        time.sleep(0.01)
        if (GPIO.input(15) == True):
            b2 = 1			# if pin15 is high bit2 is true
 
    if (GPIO.input(13) == True):
        time.sleep(0.01)
        if (GPIO.input(13) == True):
            b1 = 1			# if pin13 is high bit1 is true

    if (GPIO.input(11) == True):
        time.sleep(0.01)
        if (GPIO.input(11) == True):
            b0 = 1			# if pin11 is high bit0 is true
    
    x = (1 * b0) + (2 * b1)
    x = x +(4 * b2) + (8 * b3)
    x = x +(16 * b4) + (32 * b5)
    x = x + (64 * b6) + ( 128 * b7)		# representing the bit values from LSB to MSB
    x = x * (3.275 / 255.0) - 0.013
    x = ((x / 3.275) + 0.095) / 0.009
    x = x * 10
    return '%.0f' % x           		# print the ADC value
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = b7 = 0	# reset values

t3 = Timer(3600.0, savedbs)
t3.start()

while True:   
    varis.set(read_presure())
    windows.update()
    time.sleep(1)			        # wait for 1s

windows.mainloop()
