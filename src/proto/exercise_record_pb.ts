/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const exercise_record = (() => {

    /**
     * Namespace exercise_record.
     * @exports exercise_record
     * @namespace
     */
    const exercise_record: any = {};

    exercise_record.ExerciseRecord = (() => {

        /**
         * Properties of an ExerciseRecord.
         * @memberof exercise_record
         * @interface IExerciseRecord
         * @property {number|null} [userId] ExerciseRecord userId
         * @property {string|null} [date] ExerciseRecord date
         * @property {string|null} [walkingDistance] ExerciseRecord walkingDistance
         * @property {string|null} [walkingTime] ExerciseRecord walkingTime
         * @property {string|null} [runningDistance] ExerciseRecord runningDistance
         * @property {string|null} [runningTime] ExerciseRecord runningTime
         * @property {string|null} [pushUps] ExerciseRecord pushUps
         * @property {string|null} [sitUps] ExerciseRecord sitUps
         * @property {string|null} [squats] ExerciseRecord squats
         * @property {string|null} [otherExerciseTime] ExerciseRecord otherExerciseTime
         * @property {string|null} [todayWeight] ExerciseRecord todayWeight
         * @property {string|null} [exerciseNote] ExerciseRecord exerciseNote
         * @property {Array.<Uint8Array>|null} [todayImages] ExerciseRecord todayImages
         * @property {boolean|null} [isPublic] ExerciseRecord isPublic
         * @property {boolean|null} [hasWeightInput] ExerciseRecord hasWeightInput
         */

        /**
         * Constructs a new ExerciseRecord.
         * @memberof exercise_record
         * @classdesc Represents an ExerciseRecord.
         * @implements IExerciseRecord
         * @constructor
         * @param {exercise_record.IExerciseRecord=} [properties] Properties to set
         */
        function ExerciseRecord(properties: any) {
            this.todayImages = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExerciseRecord userId.
         * @member {number} userId
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.userId = 0;

        /**
         * ExerciseRecord date.
         * @member {string} date
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.date = "";

        /**
         * ExerciseRecord walkingDistance.
         * @member {string} walkingDistance
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.walkingDistance = "";

        /**
         * ExerciseRecord walkingTime.
         * @member {string} walkingTime
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.walkingTime = "";

        /**
         * ExerciseRecord runningDistance.
         * @member {string} runningDistance
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.runningDistance = "";

        /**
         * ExerciseRecord runningTime.
         * @member {string} runningTime
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.runningTime = "";

        /**
         * ExerciseRecord pushUps.
         * @member {string} pushUps
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.pushUps = "";

        /**
         * ExerciseRecord sitUps.
         * @member {string} sitUps
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.sitUps = "";

        /**
         * ExerciseRecord squats.
         * @member {string} squats
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.squats = "";

        /**
         * ExerciseRecord otherExerciseTime.
         * @member {string} otherExerciseTime
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.otherExerciseTime = "";

        /**
         * ExerciseRecord todayWeight.
         * @member {string} todayWeight
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.todayWeight = "";

        /**
         * ExerciseRecord exerciseNote.
         * @member {string} exerciseNote
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.exerciseNote = "";

        /**
         * ExerciseRecord todayImages.
         * @member {Array.<Uint8Array>} todayImages
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.todayImages = $util.emptyArray;

        /**
         * ExerciseRecord isPublic.
         * @member {boolean} isPublic
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.isPublic = false;

        /**
         * ExerciseRecord hasWeightInput.
         * @member {boolean} hasWeightInput
         * @memberof exercise_record.ExerciseRecord
         * @instance
         */
        ExerciseRecord.prototype.hasWeightInput = false;

        /**
         * Creates a new ExerciseRecord instance using the specified properties.
         * @function create
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {exercise_record.IExerciseRecord=} [properties] Properties to set
         * @returns {exercise_record.ExerciseRecord} ExerciseRecord instance
         */
        ExerciseRecord.create = function create(properties: any) {
            return new ExerciseRecord(properties);
        };

        /**
         * Encodes the specified ExerciseRecord message. Does not implicitly {@link exercise_record.ExerciseRecord.verify|verify} messages.
         * @function encode
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {exercise_record.IExerciseRecord} message ExerciseRecord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExerciseRecord.encode = function encode(message: any, writer?: any) {
            if (!writer)
                writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.userId);
            if (message.date != null && Object.hasOwnProperty.call(message, "date"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.date);
            if (message.walkingDistance != null && Object.hasOwnProperty.call(message, "walkingDistance"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.walkingDistance);
            if (message.walkingTime != null && Object.hasOwnProperty.call(message, "walkingTime"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.walkingTime);
            if (message.runningDistance != null && Object.hasOwnProperty.call(message, "runningDistance"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.runningDistance);
            if (message.runningTime != null && Object.hasOwnProperty.call(message, "runningTime"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.runningTime);
            if (message.pushUps != null && Object.hasOwnProperty.call(message, "pushUps"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.pushUps);
            if (message.sitUps != null && Object.hasOwnProperty.call(message, "sitUps"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.sitUps);
            if (message.squats != null && Object.hasOwnProperty.call(message, "squats"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.squats);
            if (message.otherExerciseTime != null && Object.hasOwnProperty.call(message, "otherExerciseTime"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.otherExerciseTime);
            if (message.todayWeight != null && Object.hasOwnProperty.call(message, "todayWeight"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.todayWeight);
            if (message.exerciseNote != null && Object.hasOwnProperty.call(message, "exerciseNote"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.exerciseNote);
            if (message.todayImages != null && message.todayImages.length)
                for (var i = 0; i < message.todayImages.length; ++i)
                    writer.uint32(/* id 13, wireType 2 =*/106).bytes(message.todayImages[i]);
            if (message.isPublic != null && Object.hasOwnProperty.call(message, "isPublic"))
                writer.uint32(/* id 14, wireType 0 =*/112).bool(message.isPublic);
            if (message.hasWeightInput != null && Object.hasOwnProperty.call(message, "hasWeightInput"))
                writer.uint32(/* id 15, wireType 0 =*/120).bool(message.hasWeightInput);
            return writer;
        };

        /**
         * Encodes the specified ExerciseRecord message, length delimited. Does not implicitly {@link exercise_record.ExerciseRecord.verify|verify} messages.
         * @function encodeDelimited
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {exercise_record.IExerciseRecord} message ExerciseRecord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExerciseRecord.encodeDelimited = function encodeDelimited(message: any, writer?: any) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExerciseRecord message from the specified reader or buffer.
         * @function decode
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {exercise_record.ExerciseRecord} ExerciseRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExerciseRecord.decode = function decode(reader: any, length?: number, error?: any) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new ($root as any).exercise_record.ExerciseRecord();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        message.userId = reader.int32();
                        break;
                    }
                    case 2: {
                        message.date = reader.string();
                        break;
                    }
                    case 3: {
                        message.walkingDistance = reader.string();
                        break;
                    }
                    case 4: {
                        message.walkingTime = reader.string();
                        break;
                    }
                    case 5: {
                        message.runningDistance = reader.string();
                        break;
                    }
                    case 6: {
                        message.runningTime = reader.string();
                        break;
                    }
                    case 7: {
                        message.pushUps = reader.string();
                        break;
                    }
                    case 8: {
                        message.sitUps = reader.string();
                        break;
                    }
                    case 9: {
                        message.squats = reader.string();
                        break;
                    }
                    case 10: {
                        message.otherExerciseTime = reader.string();
                        break;
                    }
                    case 11: {
                        message.todayWeight = reader.string();
                        break;
                    }
                    case 12: {
                        message.exerciseNote = reader.string();
                        break;
                    }
                    case 13: {
                        if (!(message.todayImages && message.todayImages.length))
                            message.todayImages = [];
                        message.todayImages.push(reader.bytes());
                        break;
                    }
                    case 14: {
                        message.isPublic = reader.bool();
                        break;
                    }
                    case 15: {
                        message.hasWeightInput = reader.bool();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExerciseRecord message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {exercise_record.ExerciseRecord} ExerciseRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExerciseRecord.decodeDelimited = function decodeDelimited(reader: any) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExerciseRecord message.
         * @function verify
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExerciseRecord.verify = function verify(message: any) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId))
                    return "userId: integer expected";
            if (message.date != null && message.hasOwnProperty("date"))
                if (!$util.isString(message.date))
                    return "date: string expected";
            if (message.walkingDistance != null && message.hasOwnProperty("walkingDistance"))
                if (!$util.isString(message.walkingDistance))
                    return "walkingDistance: string expected";
            if (message.walkingTime != null && message.hasOwnProperty("walkingTime"))
                if (!$util.isString(message.walkingTime))
                    return "walkingTime: string expected";
            if (message.runningDistance != null && message.hasOwnProperty("runningDistance"))
                if (!$util.isString(message.runningDistance))
                    return "runningDistance: string expected";
            if (message.runningTime != null && message.hasOwnProperty("runningTime"))
                if (!$util.isString(message.runningTime))
                    return "runningTime: string expected";
            if (message.pushUps != null && message.hasOwnProperty("pushUps"))
                if (!$util.isString(message.pushUps))
                    return "pushUps: string expected";
            if (message.sitUps != null && message.hasOwnProperty("sitUps"))
                if (!$util.isString(message.sitUps))
                    return "sitUps: string expected";
            if (message.squats != null && message.hasOwnProperty("squats"))
                if (!$util.isString(message.squats))
                    return "squats: string expected";
            if (message.otherExerciseTime != null && message.hasOwnProperty("otherExerciseTime"))
                if (!$util.isString(message.otherExerciseTime))
                    return "otherExerciseTime: string expected";
            if (message.todayWeight != null && message.hasOwnProperty("todayWeight"))
                if (!$util.isString(message.todayWeight))
                    return "todayWeight: string expected";
            if (message.exerciseNote != null && message.hasOwnProperty("exerciseNote"))
                if (!$util.isString(message.exerciseNote))
                    return "exerciseNote: string expected";
            if (message.todayImages != null && message.hasOwnProperty("todayImages")) {
                if (!Array.isArray(message.todayImages))
                    return "todayImages: array expected";
                for (var i = 0; i < message.todayImages.length; ++i)
                    if (!(message.todayImages[i] && typeof message.todayImages[i].length === "number" || $util.isString(message.todayImages[i])))
                        return "todayImages: buffer[] expected";
            }
            if (message.isPublic != null && message.hasOwnProperty("isPublic"))
                if (typeof message.isPublic !== "boolean")
                    return "isPublic: boolean expected";
            if (message.hasWeightInput != null && message.hasOwnProperty("hasWeightInput"))
                if (typeof message.hasWeightInput !== "boolean")
                    return "hasWeightInput: boolean expected";
            return null;
        };

        /**
         * Creates an ExerciseRecord message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {exercise_record.ExerciseRecord} ExerciseRecord
         */
        ExerciseRecord.fromObject = function fromObject(object: any) {
            if (object instanceof ($root as any).exercise_record.ExerciseRecord)
                return object;
            var message = new ($root as any).exercise_record.ExerciseRecord();
            if (object.userId != null)
                message.userId = object.userId | 0;
            if (object.date != null)
                message.date = String(object.date);
            if (object.walkingDistance != null)
                message.walkingDistance = String(object.walkingDistance);
            if (object.walkingTime != null)
                message.walkingTime = String(object.walkingTime);
            if (object.runningDistance != null)
                message.runningDistance = String(object.runningDistance);
            if (object.runningTime != null)
                message.runningTime = String(object.runningTime);
            if (object.pushUps != null)
                message.pushUps = String(object.pushUps);
            if (object.sitUps != null)
                message.sitUps = String(object.sitUps);
            if (object.squats != null)
                message.squats = String(object.squats);
            if (object.otherExerciseTime != null)
                message.otherExerciseTime = String(object.otherExerciseTime);
            if (object.todayWeight != null)
                message.todayWeight = String(object.todayWeight);
            if (object.exerciseNote != null)
                message.exerciseNote = String(object.exerciseNote);
            if (object.todayImages) {
                if (!Array.isArray(object.todayImages))
                    throw TypeError(".exercise_record.ExerciseRecord.todayImages: array expected");
                message.todayImages = [];
                for (var i = 0; i < object.todayImages.length; ++i)
                    if (typeof object.todayImages[i] === "string")
                        $util.base64.decode(object.todayImages[i], message.todayImages[i] = $util.newBuffer($util.base64.length(object.todayImages[i])), 0);
                    else if (object.todayImages[i].length >= 0)
                        message.todayImages[i] = object.todayImages[i];
            }
            if (object.isPublic != null)
                message.isPublic = Boolean(object.isPublic);
            if (object.hasWeightInput != null)
                message.hasWeightInput = Boolean(object.hasWeightInput);
            return message;
        };

        /**
         * Creates a plain object from an ExerciseRecord message. Also converts values to other types if specified.
         * @function toObject
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {exercise_record.ExerciseRecord} message ExerciseRecord
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExerciseRecord.toObject = function toObject(message: any, options?: any) {
            if (!options)
                options = {};
            var object: any = {};
            if (options.arrays || options.defaults)
                object.todayImages = [];
            if (options.defaults) {
                object.userId = 0;
                object.date = "";
                object.walkingDistance = "";
                object.walkingTime = "";
                object.runningDistance = "";
                object.runningTime = "";
                object.pushUps = "";
                object.sitUps = "";
                object.squats = "";
                object.otherExerciseTime = "";
                object.todayWeight = "";
                object.exerciseNote = "";
                object.isPublic = false;
                object.hasWeightInput = false;
            }
            if (message.userId != null && message.hasOwnProperty("userId"))
                object.userId = message.userId;
            if (message.date != null && message.hasOwnProperty("date"))
                object.date = message.date;
            if (message.walkingDistance != null && message.hasOwnProperty("walkingDistance"))
                object.walkingDistance = message.walkingDistance;
            if (message.walkingTime != null && message.hasOwnProperty("walkingTime"))
                object.walkingTime = message.walkingTime;
            if (message.runningDistance != null && message.hasOwnProperty("runningDistance"))
                object.runningDistance = message.runningDistance;
            if (message.runningTime != null && message.hasOwnProperty("runningTime"))
                object.runningTime = message.runningTime;
            if (message.pushUps != null && message.hasOwnProperty("pushUps"))
                object.pushUps = message.pushUps;
            if (message.sitUps != null && message.hasOwnProperty("sitUps"))
                object.sitUps = message.sitUps;
            if (message.squats != null && message.hasOwnProperty("squats"))
                object.squats = message.squats;
            if (message.otherExerciseTime != null && message.hasOwnProperty("otherExerciseTime"))
                object.otherExerciseTime = message.otherExerciseTime;
            if (message.todayWeight != null && message.hasOwnProperty("todayWeight"))
                object.todayWeight = message.todayWeight;
            if (message.exerciseNote != null && message.hasOwnProperty("exerciseNote"))
                object.exerciseNote = message.exerciseNote;
            if (message.todayImages && message.todayImages.length) {
                object.todayImages = [];
                for (var j = 0; j < message.todayImages.length; ++j)
                    object.todayImages[j] = options.bytes === String ? $util.base64.encode(message.todayImages[j], 0, message.todayImages[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.todayImages[j]) : message.todayImages[j];
            }
            if (message.isPublic != null && message.hasOwnProperty("isPublic"))
                object.isPublic = message.isPublic;
            if (message.hasWeightInput != null && message.hasOwnProperty("hasWeightInput"))
                object.hasWeightInput = message.hasWeightInput;
            return object;
        };

        /**
         * Converts this ExerciseRecord to JSON.
         * @function toJSON
         * @memberof exercise_record.ExerciseRecord
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExerciseRecord.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExerciseRecord
         * @function getTypeUrl
         * @memberof exercise_record.ExerciseRecord
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExerciseRecord.getTypeUrl = function getTypeUrl(typeUrlPrefix?: string) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/exercise_record.ExerciseRecord";
        };

        return ExerciseRecord;
    })();

    exercise_record.SaveExerciseRecordRequest = (() => {

        /**
         * Properties of a SaveExerciseRecordRequest.
         * @memberof exercise_record
         * @interface ISaveExerciseRecordRequest
         * @property {exercise_record.IExerciseRecord|null} [record] SaveExerciseRecordRequest record
         */

        /**
         * Constructs a new SaveExerciseRecordRequest.
         * @memberof exercise_record
         * @classdesc Represents a SaveExerciseRecordRequest.
         * @implements ISaveExerciseRecordRequest
         * @constructor
         * @param {exercise_record.ISaveExerciseRecordRequest=} [properties] Properties to set
         */
        function SaveExerciseRecordRequest(properties: any) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SaveExerciseRecordRequest record.
         * @member {exercise_record.IExerciseRecord|null|undefined} record
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @instance
         */
        SaveExerciseRecordRequest.prototype.record = null;

        /**
         * Creates a new SaveExerciseRecordRequest instance using the specified properties.
         * @function create
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {exercise_record.ISaveExerciseRecordRequest=} [properties] Properties to set
         * @returns {exercise_record.SaveExerciseRecordRequest} SaveExerciseRecordRequest instance
         */
        SaveExerciseRecordRequest.create = function create(properties: any) {
            return new SaveExerciseRecordRequest(properties);
        };

        /**
         * Encodes the specified SaveExerciseRecordRequest message. Does not implicitly {@link exercise_record.SaveExerciseRecordRequest.verify|verify} messages.
         * @function encode
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {exercise_record.ISaveExerciseRecordRequest} message SaveExerciseRecordRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SaveExerciseRecordRequest.encode = function encode(message: any, writer?: any) {
            if (!writer)
                writer = $Writer.create();
            if (message.record != null && Object.hasOwnProperty.call(message, "record"))
                ($root as any).exercise_record.ExerciseRecord.encode(message.record, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SaveExerciseRecordRequest message, length delimited. Does not implicitly {@link exercise_record.SaveExerciseRecordRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {exercise_record.ISaveExerciseRecordRequest} message SaveExerciseRecordRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SaveExerciseRecordRequest.encodeDelimited = function encodeDelimited(message: any, writer?: any) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SaveExerciseRecordRequest message from the specified reader or buffer.
         * @function decode
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {exercise_record.SaveExerciseRecordRequest} SaveExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SaveExerciseRecordRequest.decode = function decode(reader: any, length?: number, error?: any) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new ($root as any).exercise_record.SaveExerciseRecordRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        message.record = ($root as any).exercise_record.ExerciseRecord.decode(reader, reader.uint32());
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a SaveExerciseRecordRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {exercise_record.SaveExerciseRecordRequest} SaveExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SaveExerciseRecordRequest.decodeDelimited = function decodeDelimited(reader: any) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SaveExerciseRecordRequest message.
         * @function verify
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SaveExerciseRecordRequest.verify = function verify(message: any) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.record != null && message.hasOwnProperty("record")) {
                var error = ($root as any).exercise_record.ExerciseRecord.verify(message.record);
                if (error)
                    return "record." + error;
            }
            return null;
        };

        /**
         * Creates a SaveExerciseRecordRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {exercise_record.SaveExerciseRecordRequest} SaveExerciseRecordRequest
         */
        SaveExerciseRecordRequest.fromObject = function fromObject(object: any) {
            if (object instanceof ($root as any).exercise_record.SaveExerciseRecordRequest)
                return object;
            var message = new ($root as any).exercise_record.SaveExerciseRecordRequest();
            if (object.record != null) {
                if (typeof object.record !== "object")
                    throw TypeError(".exercise_record.SaveExerciseRecordRequest.record: object expected");
                message.record = ($root as any).exercise_record.ExerciseRecord.fromObject(object.record);
            }
            return message;
        };

        /**
         * Creates a plain object from a SaveExerciseRecordRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {exercise_record.SaveExerciseRecordRequest} message SaveExerciseRecordRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SaveExerciseRecordRequest.toObject = function toObject(message: any, options?: any) {
            if (!options)
                options = {};
            var object: any = {};
            if (options.defaults)
                object.record = null;
            if (message.record != null && message.hasOwnProperty("record"))
                object.record = ($root as any).exercise_record.ExerciseRecord.toObject(message.record, options);
            return object;
        };

        /**
         * Converts this SaveExerciseRecordRequest to JSON.
         * @function toJSON
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SaveExerciseRecordRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SaveExerciseRecordRequest
         * @function getTypeUrl
         * @memberof exercise_record.SaveExerciseRecordRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SaveExerciseRecordRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix?: string) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/exercise_record.SaveExerciseRecordRequest";
        };

        return SaveExerciseRecordRequest;
    })();

    exercise_record.SaveExerciseRecordResponse = (() => {

        /**
         * Properties of a SaveExerciseRecordResponse.
         * @memberof exercise_record
         * @interface ISaveExerciseRecordResponse
         * @property {boolean|null} [success] SaveExerciseRecordResponse success
         * @property {string|null} [message] SaveExerciseRecordResponse message
         * @property {number|null} [caloriesBurned] SaveExerciseRecordResponse caloriesBurned
         */

        /**
         * Constructs a new SaveExerciseRecordResponse.
         * @memberof exercise_record
         * @classdesc Represents a SaveExerciseRecordResponse.
         * @implements ISaveExerciseRecordResponse
         * @constructor
         * @param {exercise_record.ISaveExerciseRecordResponse=} [properties] Properties to set
         */
        function SaveExerciseRecordResponse(properties: any) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SaveExerciseRecordResponse success.
         * @member {boolean} success
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @instance
         */
        SaveExerciseRecordResponse.prototype.success = false;

        /**
         * SaveExerciseRecordResponse message.
         * @member {string} message
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @instance
         */
        SaveExerciseRecordResponse.prototype.message = "";

        /**
         * SaveExerciseRecordResponse caloriesBurned.
         * @member {number} caloriesBurned
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @instance
         */
        SaveExerciseRecordResponse.prototype.caloriesBurned = 0;

        /**
         * Creates a new SaveExerciseRecordResponse instance using the specified properties.
         * @function create
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {exercise_record.ISaveExerciseRecordResponse=} [properties] Properties to set
         * @returns {exercise_record.SaveExerciseRecordResponse} SaveExerciseRecordResponse instance
         */
        SaveExerciseRecordResponse.create = function create(properties: any) {
            return new SaveExerciseRecordResponse(properties);
        };

        /**
         * Encodes the specified SaveExerciseRecordResponse message. Does not implicitly {@link exercise_record.SaveExerciseRecordResponse.verify|verify} messages.
         * @function encode
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {exercise_record.ISaveExerciseRecordResponse} message SaveExerciseRecordResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SaveExerciseRecordResponse.encode = function encode(message: any, writer?: any) {
            if (!writer)
                writer = $Writer.create();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
            if (message.caloriesBurned != null && Object.hasOwnProperty.call(message, "caloriesBurned"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.caloriesBurned);
            return writer;
        };

        /**
         * Encodes the specified SaveExerciseRecordResponse message, length delimited. Does not implicitly {@link exercise_record.SaveExerciseRecordResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {exercise_record.ISaveExerciseRecordResponse} message SaveExerciseRecordResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SaveExerciseRecordResponse.encodeDelimited = function encodeDelimited(message: any, writer?: any) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SaveExerciseRecordResponse message from the specified reader or buffer.
         * @function decode
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {exercise_record.SaveExerciseRecordResponse} SaveExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SaveExerciseRecordResponse.decode = function decode(reader: any, length?: number, error?: any) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new ($root as any).exercise_record.SaveExerciseRecordResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        message.success = reader.bool();
                        break;
                    }
                    case 2: {
                        message.message = reader.string();
                        break;
                    }
                    case 3: {
                        message.caloriesBurned = reader.int32();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a SaveExerciseRecordResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {exercise_record.SaveExerciseRecordResponse} SaveExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SaveExerciseRecordResponse.decodeDelimited = function decodeDelimited(reader: any) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SaveExerciseRecordResponse message.
         * @function verify
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SaveExerciseRecordResponse.verify = function verify(message: any) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            if (message.caloriesBurned != null && message.hasOwnProperty("caloriesBurned"))
                if (!$util.isInteger(message.caloriesBurned))
                    return "caloriesBurned: integer expected";
            return null;
        };

        /**
         * Creates a SaveExerciseRecordResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {exercise_record.SaveExerciseRecordResponse} SaveExerciseRecordResponse
         */
        SaveExerciseRecordResponse.fromObject = function fromObject(object: any) {
            if (object instanceof ($root as any).exercise_record.SaveExerciseRecordResponse)
                return object;
            var message = new ($root as any).exercise_record.SaveExerciseRecordResponse();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.message != null)
                message.message = String(object.message);
            if (object.caloriesBurned != null)
                message.caloriesBurned = object.caloriesBurned | 0;
            return message;
        };

        /**
         * Creates a plain object from a SaveExerciseRecordResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {exercise_record.SaveExerciseRecordResponse} message SaveExerciseRecordResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SaveExerciseRecordResponse.toObject = function toObject(message: any, options?: any) {
            if (!options)
                options = {};
            var object: any = {};
            if (options.defaults) {
                object.success = false;
                object.message = "";
                object.caloriesBurned = 0;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            if (message.caloriesBurned != null && message.hasOwnProperty("caloriesBurned"))
                object.caloriesBurned = message.caloriesBurned;
            return object;
        };

        /**
         * Converts this SaveExerciseRecordResponse to JSON.
         * @function toJSON
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SaveExerciseRecordResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SaveExerciseRecordResponse
         * @function getTypeUrl
         * @memberof exercise_record.SaveExerciseRecordResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SaveExerciseRecordResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix?: string) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/exercise_record.SaveExerciseRecordResponse";
        };

        return SaveExerciseRecordResponse;
    })();

    exercise_record.GetExerciseRecordRequest = (() => {

        /**
         * Properties of a GetExerciseRecordRequest.
         * @memberof exercise_record
         * @interface IGetExerciseRecordRequest
         * @property {number|null} [userId] GetExerciseRecordRequest userId
         * @property {string|null} [date] GetExerciseRecordRequest date
         */

        /**
         * Constructs a new GetExerciseRecordRequest.
         * @memberof exercise_record
         * @classdesc Represents a GetExerciseRecordRequest.
         * @implements IGetExerciseRecordRequest
         * @constructor
         * @param {exercise_record.IGetExerciseRecordRequest=} [properties] Properties to set
         */
        function GetExerciseRecordRequest(properties: any) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetExerciseRecordRequest userId.
         * @member {number} userId
         * @memberof exercise_record.GetExerciseRecordRequest
         * @instance
         */
        GetExerciseRecordRequest.prototype.userId = 0;

        /**
         * GetExerciseRecordRequest date.
         * @member {string} date
         * @memberof exercise_record.GetExerciseRecordRequest
         * @instance
         */
        GetExerciseRecordRequest.prototype.date = "";

        /**
         * Creates a new GetExerciseRecordRequest instance using the specified properties.
         * @function create
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {exercise_record.IGetExerciseRecordRequest=} [properties] Properties to set
         * @returns {exercise_record.GetExerciseRecordRequest} GetExerciseRecordRequest instance
         */
        GetExerciseRecordRequest.create = function create(properties: any) {
            return new GetExerciseRecordRequest(properties);
        };

        /**
         * Encodes the specified GetExerciseRecordRequest message. Does not implicitly {@link exercise_record.GetExerciseRecordRequest.verify|verify} messages.
         * @function encode
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {exercise_record.IGetExerciseRecordRequest} message GetExerciseRecordRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetExerciseRecordRequest.encode = function encode(message: any, writer?: any) {
            if (!writer)
                writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.userId);
            if (message.date != null && Object.hasOwnProperty.call(message, "date"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.date);
            return writer;
        };

        /**
         * Encodes the specified GetExerciseRecordRequest message, length delimited. Does not implicitly {@link exercise_record.GetExerciseRecordRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {exercise_record.IGetExerciseRecordRequest} message GetExerciseRecordRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetExerciseRecordRequest.encodeDelimited = function encodeDelimited(message: any, writer?: any) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetExerciseRecordRequest message from the specified reader or buffer.
         * @function decode
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {exercise_record.GetExerciseRecordRequest} GetExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetExerciseRecordRequest.decode = function decode(reader: any, length?: number, error?: any) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new ($root as any).exercise_record.GetExerciseRecordRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        message.userId = reader.int32();
                        break;
                    }
                    case 2: {
                        message.date = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetExerciseRecordRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {exercise_record.GetExerciseRecordRequest} GetExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetExerciseRecordRequest.decodeDelimited = function decodeDelimited(reader: any) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetExerciseRecordRequest message.
         * @function verify
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetExerciseRecordRequest.verify = function verify(message: any) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId))
                    return "userId: integer expected";
            if (message.date != null && message.hasOwnProperty("date"))
                if (!$util.isString(message.date))
                    return "date: string expected";
            return null;
        };

        /**
         * Creates a GetExerciseRecordRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {exercise_record.GetExerciseRecordRequest} GetExerciseRecordRequest
         */
        GetExerciseRecordRequest.fromObject = function fromObject(object: any) {
            if (object instanceof ($root as any).exercise_record.GetExerciseRecordRequest)
                return object;
            var message = new ($root as any).exercise_record.GetExerciseRecordRequest();
            if (object.userId != null)
                message.userId = object.userId | 0;
            if (object.date != null)
                message.date = String(object.date);
            return message;
        };

        /**
         * Creates a plain object from a GetExerciseRecordRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {exercise_record.GetExerciseRecordRequest} message GetExerciseRecordRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetExerciseRecordRequest.toObject = function toObject(message: any, options?: any) {
            if (!options)
                options = {};
            var object: any = {};
            if (options.defaults) {
                object.userId = 0;
                object.date = "";
            }
            if (message.userId != null && message.hasOwnProperty("userId"))
                object.userId = message.userId;
            if (message.date != null && message.hasOwnProperty("date"))
                object.date = message.date;
            return object;
        };

        /**
         * Converts this GetExerciseRecordRequest to JSON.
         * @function toJSON
         * @memberof exercise_record.GetExerciseRecordRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetExerciseRecordRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetExerciseRecordRequest
         * @function getTypeUrl
         * @memberof exercise_record.GetExerciseRecordRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetExerciseRecordRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix?: string) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/exercise_record.GetExerciseRecordRequest";
        };

        return GetExerciseRecordRequest;
    })();

    exercise_record.GetExerciseRecordResponse = (() => {

        /**
         * Properties of a GetExerciseRecordResponse.
         * @memberof exercise_record
         * @interface IGetExerciseRecordResponse
         * @property {boolean|null} [found] GetExerciseRecordResponse found
         * @property {exercise_record.IExerciseRecord|null} [record] GetExerciseRecordResponse record
         */

        /**
         * Constructs a new GetExerciseRecordResponse.
         * @memberof exercise_record
         * @classdesc Represents a GetExerciseRecordResponse.
         * @implements IGetExerciseRecordResponse
         * @constructor
         * @param {exercise_record.IGetExerciseRecordResponse=} [properties] Properties to set
         */
        function GetExerciseRecordResponse(properties: any) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetExerciseRecordResponse found.
         * @member {boolean} found
         * @memberof exercise_record.GetExerciseRecordResponse
         * @instance
         */
        GetExerciseRecordResponse.prototype.found = false;

        /**
         * GetExerciseRecordResponse record.
         * @member {exercise_record.IExerciseRecord|null|undefined} record
         * @memberof exercise_record.GetExerciseRecordResponse
         * @instance
         */
        GetExerciseRecordResponse.prototype.record = null;

        /**
         * Creates a new GetExerciseRecordResponse instance using the specified properties.
         * @function create
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {exercise_record.IGetExerciseRecordResponse=} [properties] Properties to set
         * @returns {exercise_record.GetExerciseRecordResponse} GetExerciseRecordResponse instance
         */
        GetExerciseRecordResponse.create = function create(properties: any) {
            return new GetExerciseRecordResponse(properties);
        };

        /**
         * Encodes the specified GetExerciseRecordResponse message. Does not implicitly {@link exercise_record.GetExerciseRecordResponse.verify|verify} messages.
         * @function encode
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {exercise_record.IGetExerciseRecordResponse} message GetExerciseRecordResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetExerciseRecordResponse.encode = function encode(message: any, writer?: any) {
            if (!writer)
                writer = $Writer.create();
            if (message.found != null && Object.hasOwnProperty.call(message, "found"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.found);
            if (message.record != null && Object.hasOwnProperty.call(message, "record"))
                ($root as any).exercise_record.ExerciseRecord.encode(message.record, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetExerciseRecordResponse message, length delimited. Does not implicitly {@link exercise_record.GetExerciseRecordResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {exercise_record.IGetExerciseRecordResponse} message GetExerciseRecordResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetExerciseRecordResponse.encodeDelimited = function encodeDelimited(message: any, writer?: any) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetExerciseRecordResponse message from the specified reader or buffer.
         * @function decode
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {exercise_record.GetExerciseRecordResponse} GetExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetExerciseRecordResponse.decode = function decode(reader: any, length?: number, error?: any) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new ($root as any).exercise_record.GetExerciseRecordResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        message.found = reader.bool();
                        break;
                    }
                    case 2: {
                        message.record = ($root as any).exercise_record.ExerciseRecord.decode(reader, reader.uint32());
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetExerciseRecordResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {exercise_record.GetExerciseRecordResponse} GetExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetExerciseRecordResponse.decodeDelimited = function decodeDelimited(reader: any) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetExerciseRecordResponse message.
         * @function verify
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetExerciseRecordResponse.verify = function verify(message: any) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.found != null && message.hasOwnProperty("found"))
                if (typeof message.found !== "boolean")
                    return "found: boolean expected";
            if (message.record != null && message.hasOwnProperty("record")) {
                var error = ($root as any).exercise_record.ExerciseRecord.verify(message.record);
                if (error)
                    return "record." + error;
            }
            return null;
        };

        /**
         * Creates a GetExerciseRecordResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {exercise_record.GetExerciseRecordResponse} GetExerciseRecordResponse
         */
        GetExerciseRecordResponse.fromObject = function fromObject(object: any) {
            if (object instanceof ($root as any).exercise_record.GetExerciseRecordResponse)
                return object;
            var message = new ($root as any).exercise_record.GetExerciseRecordResponse();
            if (object.found != null)
                message.found = Boolean(object.found);
            if (object.record != null) {
                if (typeof object.record !== "object")
                    throw TypeError(".exercise_record.GetExerciseRecordResponse.record: object expected");
                message.record = ($root as any).exercise_record.ExerciseRecord.fromObject(object.record);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetExerciseRecordResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {exercise_record.GetExerciseRecordResponse} message GetExerciseRecordResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetExerciseRecordResponse.toObject = function toObject(message: any, options?: any) {
            if (!options)
                options = {};
            var object: any = {};
            if (options.defaults) {
                object.found = false;
                object.record = null;
            }
            if (message.found != null && message.hasOwnProperty("found"))
                object.found = message.found;
            if (message.record != null && message.hasOwnProperty("record"))
                object.record = ($root as any).exercise_record.ExerciseRecord.toObject(message.record, options);
            return object;
        };

        /**
         * Converts this GetExerciseRecordResponse to JSON.
         * @function toJSON
         * @memberof exercise_record.GetExerciseRecordResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetExerciseRecordResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetExerciseRecordResponse
         * @function getTypeUrl
         * @memberof exercise_record.GetExerciseRecordResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetExerciseRecordResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix?: string) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/exercise_record.GetExerciseRecordResponse";
        };

        return GetExerciseRecordResponse;
    })();

    return exercise_record;
})();

// Set up the $root to use the exercise_record namespace
($root as any).exercise_record = exercise_record;
