# Cisco IOS Device Configuration Backup & Audit Tool

This repository contains a production-ready Python automation tool that connects to multiple Cisco IOS switches/routers via SSH, retrieves the running-configuration, and outputs timestamped backup configurations into organized subfolders.

It solves the manual overhead of saving configs and tracking drift.

## How It Works
1. Reads a local device inventory file (`devices.txt`).
2. Establishes SSH connections in parallel/sequence using **Netmiko**.
3. Elevates execution privilege to `enable` mode.
4. Grabs the configuration data using `show running-config`.
5. Saves timestamped configs to the local `backups/` directory.
6. Generates execution logs detailing failures (timeouts, auth errors) or successes in `backup_execution.log`.

---

## File Structure
```
cisco-backup-automation/
├── backup_script.py        # Core automation script
├── devices.txt.example     # Template inventory file
├── backups/                # Generated backups folder (git ignored)
└── backup_execution.log    # Logs generated during runs
```

---

## Getting Started

### 1. Installation
Clone this repository to your machine, then install the required Python SSH handler module `netmiko`:
```bash
pip install netmiko
```

### 2. Configure Device Inventory
Copy the template file to construct your inventory:
```bash
cp devices.txt.example devices.txt
```
Edit `devices.txt` and append your device credentials using the comma-separated format:
```text
ip_address, username, password, cisco_ios, hostname
```

### 3. Run the Script
Execute the script using Python:
```bash
python backup_script.py
```

---

## Code Highlight
The script features robust exception handling for typical networking environment disruptions (timeout issues, credentials authentication failures):
```python
try:
    connection = ConnectHandler(
        device_type=device["device_type"],
        host=device["ip"],
        username=device["username"],
        password=device["password"]
    )
    connection.enable()
    # ... executes commands and saves config
except NetmikoTimeoutException:
    logging.error("Connection timeout! Device is unreachable.")
except NetmikoAuthenticationException:
    logging.error("Authentication failed. Check credentials.")
```

## Authors
- **Al Hafiz Taufikur Rohman** - *Network Engineer & NetDevOps Enthusiast*
