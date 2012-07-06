if [ "$MAINAPP" = "true" ]
then
    RUNLEVEL="$(runlevel | awk '{ print $2 }')"
    #exec > >(tee /var/log/kiosk)
    #exec 2>&1
    phidgetwebservice21 &
    /opt/kiosk/check_connection &
    while :
    do
        if eval "ping -c 1 8.8.8.8"
        then
            break
        else
            sleep 10
        fi
    done
    autossh -M 0 -f -N -R 6322:localhost:22 -R 6359:localhost:5900 -o ServerAliveInterval=15 nelsonsun@innovative.barkleylabs.com
    while [ $RUNLEVEL -ge 2 -a $RUNLEVEL -le 5 ]
    do
        python /opt/kiosk/kiosk.py
        RUNLEVEL="$(runlevel | awk '{ print $2 }')"
    done
fi
