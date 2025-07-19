export function encodeExerciseRecord(message) {
  let bb = popByteBuffer();
  _encodeExerciseRecord(message, bb);
  return toUint8Array(bb);
}

function _encodeExerciseRecord(message, bb) {
  // optional int32 user_id = 1;
  let $user_id = message.user_id;
  if ($user_id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($user_id));
  }

  // optional string date = 2;
  let $date = message.date;
  if ($date !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $date);
  }

  // optional string walking_distance = 3;
  let $walking_distance = message.walking_distance;
  if ($walking_distance !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $walking_distance);
  }

  // optional string walking_time = 4;
  let $walking_time = message.walking_time;
  if ($walking_time !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $walking_time);
  }

  // optional string running_distance = 5;
  let $running_distance = message.running_distance;
  if ($running_distance !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $running_distance);
  }

  // optional string running_time = 6;
  let $running_time = message.running_time;
  if ($running_time !== undefined) {
    writeVarint32(bb, 50);
    writeString(bb, $running_time);
  }

  // optional string push_ups = 7;
  let $push_ups = message.push_ups;
  if ($push_ups !== undefined) {
    writeVarint32(bb, 58);
    writeString(bb, $push_ups);
  }

  // optional string sit_ups = 8;
  let $sit_ups = message.sit_ups;
  if ($sit_ups !== undefined) {
    writeVarint32(bb, 66);
    writeString(bb, $sit_ups);
  }

  // optional string squats = 9;
  let $squats = message.squats;
  if ($squats !== undefined) {
    writeVarint32(bb, 74);
    writeString(bb, $squats);
  }

  // optional string other_exercise_time = 10;
  let $other_exercise_time = message.other_exercise_time;
  if ($other_exercise_time !== undefined) {
    writeVarint32(bb, 82);
    writeString(bb, $other_exercise_time);
  }

  // optional string today_weight = 11;
  let $today_weight = message.today_weight;
  if ($today_weight !== undefined) {
    writeVarint32(bb, 90);
    writeString(bb, $today_weight);
  }

  // optional string exercise_note = 12;
  let $exercise_note = message.exercise_note;
  if ($exercise_note !== undefined) {
    writeVarint32(bb, 98);
    writeString(bb, $exercise_note);
  }

  // repeated bytes today_images = 13;
  let array$today_images = message.today_images;
  if (array$today_images !== undefined) {
    for (let value of array$today_images) {
      writeVarint32(bb, 106);
      writeVarint32(bb, value.length), writeBytes(bb, value);
    }
  }

  // optional bool is_public = 14;
  let $is_public = message.is_public;
  if ($is_public !== undefined) {
    writeVarint32(bb, 112);
    writeByte(bb, $is_public ? 1 : 0);
  }

  // optional bool has_weight_input = 15;
  let $has_weight_input = message.has_weight_input;
  if ($has_weight_input !== undefined) {
    writeVarint32(bb, 120);
    writeByte(bb, $has_weight_input ? 1 : 0);
  }
}

export function decodeExerciseRecord(binary) {
  return _decodeExerciseRecord(wrapByteBuffer(binary));
}

function _decodeExerciseRecord(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 user_id = 1;
      case 1: {
        message.user_id = readVarint32(bb);
        break;
      }

      // optional string date = 2;
      case 2: {
        message.date = readString(bb, readVarint32(bb));
        break;
      }

      // optional string walking_distance = 3;
      case 3: {
        message.walking_distance = readString(bb, readVarint32(bb));
        break;
      }

      // optional string walking_time = 4;
      case 4: {
        message.walking_time = readString(bb, readVarint32(bb));
        break;
      }

      // optional string running_distance = 5;
      case 5: {
        message.running_distance = readString(bb, readVarint32(bb));
        break;
      }

      // optional string running_time = 6;
      case 6: {
        message.running_time = readString(bb, readVarint32(bb));
        break;
      }

      // optional string push_ups = 7;
      case 7: {
        message.push_ups = readString(bb, readVarint32(bb));
        break;
      }

      // optional string sit_ups = 8;
      case 8: {
        message.sit_ups = readString(bb, readVarint32(bb));
        break;
      }

      // optional string squats = 9;
      case 9: {
        message.squats = readString(bb, readVarint32(bb));
        break;
      }

      // optional string other_exercise_time = 10;
      case 10: {
        message.other_exercise_time = readString(bb, readVarint32(bb));
        break;
      }

      // optional string today_weight = 11;
      case 11: {
        message.today_weight = readString(bb, readVarint32(bb));
        break;
      }

      // optional string exercise_note = 12;
      case 12: {
        message.exercise_note = readString(bb, readVarint32(bb));
        break;
      }

      // repeated bytes today_images = 13;
      case 13: {
        let values = message.today_images || (message.today_images = []);
        values.push(readBytes(bb, readVarint32(bb)));
        break;
      }

      // optional bool is_public = 14;
      case 14: {
        message.is_public = !!readByte(bb);
        break;
      }

      // optional bool has_weight_input = 15;
      case 15: {
        message.has_weight_input = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function encodeSaveExerciseRecordRequest(message) {
  let bb = popByteBuffer();
  _encodeSaveExerciseRecordRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeSaveExerciseRecordRequest(message, bb) {
  // optional ExerciseRecord record = 1;
  let $record = message.record;
  if ($record !== undefined) {
    writeVarint32(bb, 10);
    let nested = popByteBuffer();
    _encodeExerciseRecord($record, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeSaveExerciseRecordRequest(binary) {
  return _decodeSaveExerciseRecordRequest(wrapByteBuffer(binary));
}

function _decodeSaveExerciseRecordRequest(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional ExerciseRecord record = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.record = _decodeExerciseRecord(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function encodeSaveExerciseRecordResponse(message) {
  let bb = popByteBuffer();
  _encodeSaveExerciseRecordResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeSaveExerciseRecordResponse(message, bb) {
  // optional bool success = 1;
  let $success = message.success;
  if ($success !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $success ? 1 : 0);
  }

  // optional string message = 2;
  let $message = message.message;
  if ($message !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $message);
  }

  // optional int32 calories_burned = 3;
  let $calories_burned = message.calories_burned;
  if ($calories_burned !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($calories_burned));
  }
}

export function decodeSaveExerciseRecordResponse(binary) {
  return _decodeSaveExerciseRecordResponse(wrapByteBuffer(binary));
}

function _decodeSaveExerciseRecordResponse(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool success = 1;
      case 1: {
        message.success = !!readByte(bb);
        break;
      }

      // optional string message = 2;
      case 2: {
        message.message = readString(bb, readVarint32(bb));
        break;
      }

      // optional int32 calories_burned = 3;
      case 3: {
        message.calories_burned = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function encodeGetExerciseRecordRequest(message) {
  let bb = popByteBuffer();
  _encodeGetExerciseRecordRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetExerciseRecordRequest(message, bb) {
  // optional int32 user_id = 1;
  let $user_id = message.user_id;
  if ($user_id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($user_id));
  }

  // optional string date = 2;
  let $date = message.date;
  if ($date !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $date);
  }
}

export function decodeGetExerciseRecordRequest(binary) {
  return _decodeGetExerciseRecordRequest(wrapByteBuffer(binary));
}

function _decodeGetExerciseRecordRequest(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 user_id = 1;
      case 1: {
        message.user_id = readVarint32(bb);
        break;
      }

      // optional string date = 2;
      case 2: {
        message.date = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function encodeGetExerciseRecordResponse(message) {
  let bb = popByteBuffer();
  _encodeGetExerciseRecordResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeGetExerciseRecordResponse(message, bb) {
  // optional bool found = 1;
  let $found = message.found;
  if ($found !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $found ? 1 : 0);
  }

  // optional ExerciseRecord record = 2;
  let $record = message.record;
  if ($record !== undefined) {
    writeVarint32(bb, 18);
    let nested = popByteBuffer();
    _encodeExerciseRecord($record, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodeGetExerciseRecordResponse(binary) {
  return _decodeGetExerciseRecordResponse(wrapByteBuffer(binary));
}

function _decodeGetExerciseRecordResponse(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool found = 1;
      case 1: {
        message.found = !!readByte(bb);
        break;
      }

      // optional ExerciseRecord record = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        message.record = _decodeExerciseRecord(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

function pushTemporaryLength(bb) {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb, type) {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value) {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value) {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value) {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack = [];

function popByteBuffer() {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb) {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes) {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb) {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb, offset) {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb) {
  return bb.offset >= bb.limit;
}

function grow(bb, count) {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb, count) {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb, count) {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb, buffer) {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb, count) {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2, c3, c4, c;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb, text) {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb, buffer) {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb) {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb, value) {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb) {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb, value) {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb) {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb, value) {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb) {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb, value) {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb, unsigned) {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb, value) {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb) {
  let c = 0;
  let value = 0;
  let b;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb, value) {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb, unsigned) {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb, value) {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb) {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb, value) {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb) {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb, value) {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
