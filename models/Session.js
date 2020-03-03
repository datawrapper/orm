const SQ = require('sequelize');
const { db } = require('../index');

const Session = db.define(
    'session',
    {
        id: {
            type: SQ.STRING(32),
            primaryKey: true,
            autoIncrement: false,
            field: 'session_id'
        },

        user_id: {
            type: SQ.INTEGER,
            allowNull: true
        },

        persistent: SQ.BOOLEAN,

        data: {
            type: SQ.TEXT,
            allowNull: false,
            field: 'session_data',
            get() {
                const d = this.getDataValue('data');
                if (d) {
                    const data = unserializeSession(d);
                    return data;
                }
                return {};
            },
            set(data) {
                // WARNING, this will destroy parts of our sessions
                this.setDataValue('data', serializeSession(data));
            }
        }
    },
    {
        createdAt: 'date_created',
        updatedAt: 'last_updated',
        tableName: 'session'
    }
);

module.exports = Session;

function phpSerialize(mixedValue) {
    //  discuss at: http://locutus.io/php/serialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Dino
    // improved by: Le Torbi (http://www.letorbi.de/)
    // improved by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Andrej Pavlovic
    // bugfixed by: Garagoth
    // bugfixed by: Russell Walker (http://www.nbill.co.uk/)
    // bugfixed by: Jamie Beck (http://www.terabit.ca/)
    // bugfixed by: Kevin van Zonneveld (http://kvz.io/)
    // bugfixed by: Ben (http://benblume.co.uk/)
    // bugfixed by: Codestar (http://codestarlive.com/)
    // bugfixed by: idjem (https://github.com/idjem)
    //    input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
    //    input by: Martin (http://www.erlenwiese.de/)
    //      note 1: We feel the main purpose of this function should be to ease
    //      note 1: the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: serialize(['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
    //   example 2: serialize({firstName: 'Kevin', midName: 'van'})
    //   returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'
    //   example 3: serialize( {'ü': 'ü', '四': '四', '𠜎': '𠜎'})
    //   returns 3: 'a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}'

    var val, key, okey;
    var ktype = '';
    var vals = '';
    var count = 0;

    var _utf8Size = function(str) {
        return ~-encodeURI(str).split(/%..|./).length;
    };

    var _getType = function(inp) {
        var match;
        var key;
        var cons;
        var types;
        var type = typeof inp;

        if (type === 'object' && !inp) {
            return 'null';
        }

        if (type === 'object') {
            if (!inp.constructor) {
                return 'object';
            }
            cons = inp.constructor.toString();
            match = cons.match(/(\w+)\(/);
            if (match) {
                cons = match[1].toLowerCase();
            }
            types = ['boolean', 'number', 'string', 'array'];
            for (key in types) {
                if (cons === types[key]) {
                    type = types[key];
                    break;
                }
            }
        }
        return type;
    };

    var type = _getType(mixedValue);

    switch (type) {
        case 'function':
            val = '';
            break;
        case 'boolean':
            val = 'b:' + (mixedValue ? '1' : '0');
            break;
        case 'number':
            val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue;
            break;
        case 'string':
            val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
            break;
        case 'array':
        case 'object':
            val = 'a';
            /*
            if (type === 'object') {
                var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
                if (objname === undefined) {
                    return;
                }
                objname[1] = serialize(objname[1]);
                val = 'O' + objname[1].substring(1, objname[1].length - 1);
            }
            */

            for (key in mixedValue) {
                /* https://eslint.org/docs/rules/no-prototype-builtins */
                if (Object.prototype.hasOwnProperty.call(mixedValue, key)) {
                    ktype = _getType(mixedValue[key]);
                    if (ktype === 'function') {
                        continue;
                    }

                    okey = key.match(/^[0-9]+$/) ? parseInt(key, 10) : key;
                    vals += phpSerialize(okey) + phpSerialize(mixedValue[key]);
                    count++;
                }
            }
            val += ':' + count + ':{' + vals + '}';
            break;
        case 'undefined':
        default:
            // Fall-through
            // if the JS object has a property which contains a null value,
            // the string cannot be unserialized by PHP
            val = 'N';
            break;
    }
    if (type !== 'object' && type !== 'array') {
        val += ';';
    }

    return val;
}

function phpUnserialize(data) {
    //  discuss at: http://locutus.io/php/unserialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Pedro Tainha (http://www.pedrotainha.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Chris
    // improved by: James
    // improved by: Le Torbi
    // improved by: Eli Skeggs
    // bugfixed by: dptr1988
    // bugfixed by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: philippsimon (https://github.com/philippsimon/)
    //  revised by: d3x
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Martin (http://www.erlenwiese.de/)
    //    input by: kilops
    //    input by: Jaroslaw Czarniak
    //    input by: lovasoa (https://github.com/lovasoa/)
    //      note 1: We feel the main purpose of this function should be
    //      note 1: to ease the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
    //   returns 1: ['Kevin', 'van', 'Zonneveld']
    //   example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
    //   returns 2: {firstName: 'Kevin', midName: 'van'}
    //   example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
    //   returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}

    var $global = typeof window !== 'undefined' ? window : global;

    var utf8Overhead = function(str) {
        var s = str.length;
        for (var i = str.length - 1; i >= 0; i--) {
            var code = str.charCodeAt(i);
            if (code > 0x7f && code <= 0x7ff) {
                s++;
            } else if (code > 0x7ff && code <= 0xffff) {
                s += 2;
            }
            // trail surrogate
            if (code >= 0xdc00 && code <= 0xdfff) {
                i--;
            }
        }
        return s - 1;
    };
    var error = function(type, msg, filename, line) {
        throw new $global[type](msg, filename, line);
    };
    var readUntil = function(data, offset, stopchr) {
        var i = 2;
        var buf = [];
        var chr = data.slice(offset, offset + 1);

        while (chr !== stopchr) {
            if (i + offset > data.length) {
                error('Error', 'Invalid');
            }
            buf.push(chr);
            chr = data.slice(offset + (i - 1), offset + i);
            i += 1;
        }
        return [buf.length, buf.join('')];
    };
    var readChrs = function(data, offset, length) {
        var i, chr, buf;

        buf = [];
        for (i = 0; i < length; i++) {
            chr = data.slice(offset + (i - 1), offset + i);
            buf.push(chr);
            length -= utf8Overhead(chr);
        }
        return [buf.length, buf.join('')];
    };
    function _unserialize(data, offset) {
        var dtype;
        var dataoffset;
        var keyandchrs;
        var keys;
        var contig;
        var length;
        var array;
        var readdata;
        var readData;
        var ccount;
        var stringlength;
        var i;
        var key;
        var kprops;
        var kchrs;
        var vprops;
        var vchrs;
        var value;
        var chrs = 0;
        var typeconvert = function(x) {
            return x;
        };

        if (!offset) {
            offset = 0;
        }
        dtype = data.slice(offset, offset + 1).toLowerCase();

        dataoffset = offset + 2;

        switch (dtype) {
            case 'i':
                typeconvert = function(x) {
                    return parseInt(x, 10);
                };
                readData = readUntil(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case 'b':
                typeconvert = function(x) {
                    return parseInt(x, 10) !== 0;
                };
                readData = readUntil(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case 'd':
                typeconvert = function(x) {
                    return parseFloat(x);
                };
                readData = readUntil(data, dataoffset, ';');
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 1;
                break;
            case 'n':
                readdata = null;
                break;
            case 's':
                ccount = readUntil(data, dataoffset, ':');
                chrs = ccount[0];
                stringlength = ccount[1];
                dataoffset += chrs + 2;

                readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10));
                chrs = readData[0];
                readdata = readData[1];
                dataoffset += chrs + 2;
                if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                    error('SyntaxError', 'String length mismatch');
                }
                break;
            case 'a':
                readdata = {};

                keyandchrs = readUntil(data, dataoffset, ':');
                chrs = keyandchrs[0];
                keys = keyandchrs[1];
                dataoffset += chrs + 2;

                length = parseInt(keys, 10);
                contig = true;

                for (i = 0; i < length; i++) {
                    kprops = _unserialize(data, dataoffset);
                    kchrs = kprops[1];
                    key = kprops[2];
                    dataoffset += kchrs;

                    vprops = _unserialize(data, dataoffset);
                    vchrs = vprops[1];
                    value = vprops[2];
                    dataoffset += vchrs;

                    if (key !== i) {
                        contig = false;
                    }

                    readdata[key] = value;
                }

                if (contig) {
                    array = new Array(length);
                    for (i = 0; i < length; i++) {
                        array[i] = readdata[i];
                    }
                    readdata = array;
                }

                dataoffset += 1;
                break;
            default:
                // error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype)
                break;
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)];
    }

    return _unserialize(data + '', 0)[2];
}

function unserializeSession(input) {
    if (!input) return {};
    return input.split(/\|/).reduce(function(output, part, index, parts) {
        // First part = $key
        if (index === 0) {
            output._currKey = part;
        } else if (index === parts.length - 1) {
            // Last part = $someSerializedStuff
            output[output._currKey] = phpUnserialize(part);
            delete output._currKey;
        } else {
            // Other output = $someSerializedStuff$key
            var repper = part.replace(/(\n|\r)/g, ' ');
            var match = repper.match(/^((?:.*?[;}])+)([^;}]+?)$/);
            if (match) {
                output[output._currKey] = phpUnserialize(match[1]);
                output._currKey = match[2];
            } else {
                throw new Error('Parse error on part "' + part + '"');
            }
        }
        return output;
    }, {});
}

function serializeSession(data) {
    const parts = [];
    Object.keys(data).forEach(k => {
        const s = `${k}|${phpSerialize(data[k])}`;
        if (s) parts.push(s);
    });
    return parts.join('');
}
