#!/usr/bin/env python3
"""
Cisco IOS Device Configuration Backup Script
Author: Al Hafiz Taufikur Rohman
Description: Automatically connects to Cisco devices via SSH (using Netmiko),
             retrieves the active running-configuration, and saves it locally
             to a timestamped folder. Logs authentication and connectivity states.
Dependencies: pip install netmiko
"""

import os
import sys
import time
import logging
from datetime import datetime
from netmiko import ConnectHandler
from netmiko.exceptions import NetmikoTimeoutException, NetmikoAuthenticationException

# Configuration Settings
DEVICES_FILE = "devices.txt"
BACKUP_DIR = "backups"
LOG_FILE = "backup_execution.log"

# Set up logging to console and file
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)

def load_devices(filename):
    """
    Reads device definitions from devices.txt.
    Format per line: ip,username,password,device_type,hostname
    """
    devices = []
    if not os.path.exists(filename):
        logging.error(f"Device inventory file '{filename}' not found! Please create it.")
        return devices

    with open(filename, "r") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            # Skip comments and empty lines
            if not line or line.startswith("#"):
                continue
            
            try:
                parts = line.split(",")
                if len(parts) < 5:
                    logging.warning(f"Line {line_num} has invalid format. Skipping: {line}")
                    continue
                
                ip, username, password, device_type, hostname = [p.strip() for p in parts[:5]]
                device_info = {
                    "device_type": device_type,
                    "ip": ip,
                    "username": username,
                    "password": password,
                    "secret": password, # used for enable mode if needed
                    "hostname": hostname
                }
                devices.append(device_info)
            except Exception as e:
                logging.error(f"Error parsing line {line_num}: {e}")
                
    return devices

def backup_device(device):
    """
    Connects to a single Cisco device via Netmiko, fetches running-config,
    and writes it to a file inside the backup folder.
    """
    hostname = device["hostname"]
    ip = device["ip"]
    
    logging.info(f"Connecting to {hostname} ({ip})...")
    
    try:
        # Establish SSH Connection
        connection = ConnectHandler(
            device_type=device["device_type"],
            host=device["ip"],
            username=device["username"],
            password=device["password"]
        )
        
        # Enter privileged enable mode if needed
        connection.enable()
        
        logging.info(f"Connected successfully to {hostname}. Retrieving configuration...")
        
        # Run command to fetch running configuration
        config_data = connection.send_command("show running-config")
        
        # Close connection
        connection.disconnect()
        
        # Generate filename with date
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{hostname}_{timestamp}.cfg"
        file_path = os.path.join(BACKUP_DIR, filename)
        
        # Write configuration to file
        with open(file_path, "w") as f:
            f.write(config_data)
            
        logging.info(f"Backup complete! Saved configuration to: {file_path}")
        return True
        
    except NetmikoTimeoutException:
        logging.error(f"Connection timeout! Device {hostname} ({ip}) is unreachable.")
    except NetmikoAuthenticationException:
        logging.error(f"Authentication failed for device {hostname} ({ip}). Check username/password.")
    except Exception as e:
        logging.error(f"An unexpected error occurred for {hostname} ({ip}): {e}")
        
    return False

def main():
    logging.info("========================================")
    logging.info("Starting Cisco Network Configuration Backup Script")
    logging.info("========================================")
    
    # 1. Create backups output folder if not existing
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        logging.info(f"Created backups folder: {BACKUP_DIR}/")

    # 2. Load device listing
    devices = load_devices(DEVICES_FILE)
    if not devices:
        logging.warning("No devices loaded. Exiting.")
        return
        
    logging.info(f"Successfully loaded {len(devices)} device(s) from inventory.")

    # 3. Perform backups sequentially
    success_count = 0
    failure_count = 0
    
    for device in devices:
        success = backup_device(device)
        if success:
            success_count += 1
        else:
            failure_count += 1
            
    logging.info("========================================")
    logging.info(f"Backup Execution Complete. Summary:")
    logging.info(f"Successful backups: {success_count}")
    logging.info(f"Failed backups: {failure_count}")
    logging.info("========================================")

if __name__ == "__main__":
    main()
