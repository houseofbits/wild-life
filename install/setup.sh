 
#!/bin/bash
######################################################################################################
# Kiosk PC setup script for Ubuntu 20.04
#   1) Create user
#   2) Autologin the created user
#   3) Install the startup bash script run by the service
#   4) Enable WOL
#   5) INstall cronjob for scheduled shutdown
#   6) Install/update firefox
#   7) Configure time sync with NTP server
#   8) Configure networking

######################################################################################################
# Functions

function message {
    printf "\033[0;33m$1\033[0m$2\n"
}

function command_exists () {
    type "$1" &> /dev/null ;
}

######################################################################################################
# Variables

USERNAME=application
PASSWORD=dabasmuzejs
SHUTDOWN_CRON_JOB="30 11 * * 1-5 /sbin/shutdown -h now"
NETWORK_DEVICE=wlp2s0 #enp2s0
CONNECTION_NAME=$(nmcli -g GENERAL.CONNECTION dev show $NETWORK_DEVICE)
MAC_ADDRESS=$(nmcli -g GENERAL.HWADDR dev show $NETWORK_DEVICE | sed "s@\\\\@@g")
NTP_SERVER="server 1.2.3.4 iburst"

######################################################################################################
# Prompt to continue

if (( $EUID != 0 )); then
    echo "Has to be run as root. Exiting!"
    exit
fi

read -p "Continue to set up Kiosk configuration (y/n)?" CONT
if [ "$CONT" != "y" ]; then
  echo "Canceled by user. Exiting!"
  exit
fi

# ######################################################################################################
# # 1. Create user
if id "$USERNAME" &>/dev/null; then
    message "User '$USERNAME' already exists. Skipping"enp2s0
else
    message "Creating user '$USERNAME'..."

    adduser --gecos "" --disabled-password $USERNAME
    chpasswd <<<"$USERNAME:$PASSWORD"    
fi

# ######################################################################################################
# # 2. Set as autologin user

message "Setting up automatic login for user '$USERNAME'..." 

GDM3_CONFIG='/etc/gdm3/custom.conf'

sed -i "s/\(#*.*AutomaticLoginEnable *= *\).*/AutomaticLoginEnable = true/" $GDM3_CONFIG
sed -i "s/\(#*.*AutomaticLogin *= *\).*/AutomaticLogin = $USERNAME/" $GDM3_CONFIG

# ######################################################################################################
# # 3. Create startup script

message "Setting up kiosk startup script..."

cp config/kiosk-startup.sh /home/$USERNAME/
cp config/kiosk-startup.service /etc/systemd/user
sed -i "s/{USERNAME}/$USERNAME/" /etc/systemd/user/kiosk-startup.service
systemctl --user enable kiosk-startup.service
sudo chmod 755 /home/$USERNAME/kiosk-startup.sh
sudo chmod 755 /etc/systemd/user/kiosk-startup.service

systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

# ######################################################################################################
# # 4. Enable WOL

message "Enabling WOL..."

nmcli connection modify "$CONNECTION_NAME" 802-3-ethernet.wake-on-lan magic
echo WOL mode: $(nmcli -g 802-3-ethernet.wake-on-lan c show "$CONNECTION_NAME")

# ######################################################################################################
# # 5. Set shutdown cron

message "Setting up shutdown Cron job..."

apt install cron
systemctl enable --now cron
echo $SHUTDOWN_CRON_JOB >> /etc/cron.d/timed-shutdown

# ######################################################################################################
# # 6. Install firefox

if command_exists firefox ; then
    message "Firefox browser is already installed. Updating..."
    sudo apt install -qq firefox
else 
    message "Installing Firefox browser..."
    sudo apt install -qq firefox
fi

# ######################################################################################################
# # 7. NTP

sudo apt-get install -qq ntp

echo $NTP_SERVER >> /etc/ntp.conf

# ######################################################################################################
# # 8. Set up static IP (Prompt for address)

message "Setting up Static IP..."

cp config/01-netcfg.yaml /etc/netplan/
read -p "Enter IP address: " SYSTEM_IP
sed -i "s/{SYSTEM_IP}/$SYSTEM_IP/" /etc/netplan/01-netcfg.yaml
sed -i "s/{SYSTEM_MACADDRESS}/$MAC_ADDRESS/" /etc/netplan/01-netcfg.yaml
netplan apply

# ######################################################################################################
# # Echo IP address and MAC address

message 'IP Address:' $(nmcli -g IP4.ADDRESS dev show $NETWORK_DEVICE)
message 'MAC Address:' $(nmcli -g GENERAL.HWADDR dev show $NETWORK_DEVICE | sed "s@\\\\@@g")


