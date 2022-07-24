# Centom
<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
* net-snmp

	developed based on net-snmp C library
	```sh
	sudo apt-get update
	sudo apt-get install clang-format-9
	sudo apt-get install libsnmp-dev
	```

### Executing Backend

```sh
git clone https://github.com/smmir-cent/Centom.git
cd backend
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
sqlite3 project/db.sqlite
```

```sql
CREATE TABLE user (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	surname TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	mobile_number TEXT NOT NULL,
	password TEXT NOT NULL
);
```

```sh
python3 -m project.__init__
```
