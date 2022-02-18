# Centom
<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
```sh
sudo apt-get update
```

* net-snmp
	developed based on net-snmp C library
	```sh
	sudo apt-get install libsnmp-dev
	```

* clang-format
	```sh
	sudo apt-get install clang-format-9
	```

### Executing program

```sh
git clone https://github.com/smmir-cent/Centom.git
mkdir build ; cd build 
cmake .. ; make -j4
./engine
```
