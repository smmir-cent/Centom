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
### Executing program

```sh
git clone https://github.com/smmir-cent/Centom.git
mkdir build ; cd build 
cmake .. ; make -j4
./engine
```
