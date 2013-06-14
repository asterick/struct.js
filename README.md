struct.js
=========

Struct.js is a strong typed data structure parser for javascript with a C-like syntax. 
It currently works both in browser and with node.js (depends on peg.js build settings)

The structures are bit packed and will allow misaligned values of any type 
(including floating-point).  This allows for very flexible network message decoding.

Building
--------

	npm install pegjs
	./node_modules/.bin/pegjs struct.peg


Usage
-----

### Struct.js Syntax

Struct.js only interprets the characters: A-Z, 0-9 and _ as indentifier characters, and 
identifiers may not begin with a number.  The top level entity must be surrounded with 
curly braces. C style comments are supported.


#### Top level structure (field group)

```[top / bottom]? [FieldGroup]```

The top level structure is simply a field group, with an optional bit packing identifier.

By default bottom up packing is used, implying that the first field is encoded in the least
significant bits of a field first.

Field groups are named identifiers surrounded by parentheses allow you to specify 
multiple fields for the top-level struct, unions and structs.  
Semi-colons are optional for seperating fields.  

	{
		... fields go here ...
	}

#### Bit-field types	

```[endian]? unsigned:[bitsize] [identifer]```

Create an unsigned bit field of n-bits in length.  
These fields are restricted to 32-bits in max length (javascript limitations)

An optional endian parameter may be specified to change byte order: "big" or "little".

*NOTE: little endian is default*

```[endian]? signed:[bitsize] [identifer]```

Create an 2's complement bit field of n-bits in length.  
These fields are restricted to 32-bits in max length (javascript limitations)

An optional endian parameter may be specified to change byte order: "big" or "little".

```[endian]? float:[bitsize] [identifer]```

Create an IEEE floating point field.  
May only be 32 and 64 bits in length.

An optional endian parameter may be specified to change byte order: "big" or "little".

``` void:[bitsize] ```

Create an untyped, unnamed bit field. Useful for aligning bit fields.

#### Grouping types

```struct [identifier] [field group]``` 
Create a structured group of fields.  
The position of each field is equal to the previous field plus it's size in bits.

```union [identifier] [field group]```
Creates an overlaid grouping.  This is much like the ```struct``` type, except 
all the fields share the same bit position.  This structure's size is determined
by the maximum size of it's individual fields.

#### Arrays

All fields my be packed into an array type.  This creates a bit packed grouping of values.

	unsigned:32 myArray[32]

Arrays may also be group by additional array in minor to major order.

 	unsigned:1 bitmap[8][8]

In this case, ```bitmap[1][0]``` falls before ```bitmap[0][1]``` inside of the the low-level
array buffer.

### Example (structure)

	{
		big unsigned:32 	header;
		little float:64 	version;
		unsigned:16 		code;
		unsigned:16			length;

		union operations {
			float:32 float;
			float:64 double;
			struct game_message {
				unsigned:8 length;
				unsigned:8 utf8[255];
			};
			struct position {
				unsigned:16 entity;
				signed:32	_x;
				signed:32	_y;
				signed:32	_z;
			}
		}
	}

### Example (usage)

	var structs = require('./struct.js');
	var fs = require('fs');

	var SomeStruct = structs.parse(fs.readFileSync('someStruct', 'utf-8'));

	var a = new SomeStruct;
	// ArrayBuffer in a._data

	var ab = new ArrayBuffer(100),
		b = new SomeStruct(ab);
	// Write to an existing array buffer! (great with sub-buffers)
	// b._size = the size (in bytes) of the structure.

	b.some_field = 9;
	console.log(b.some_field);
