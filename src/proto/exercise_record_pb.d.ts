import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace exercise_record. */
export namespace exercise_record {

    /** Properties of an ExerciseRecord. */
    interface IExerciseRecord {

        /** ExerciseRecord userId */
        userId?: (number|null);

        /** ExerciseRecord date */
        date?: (string|null);

        /** ExerciseRecord walkingDistance */
        walkingDistance?: (string|null);

        /** ExerciseRecord walkingTime */
        walkingTime?: (string|null);

        /** ExerciseRecord runningDistance */
        runningDistance?: (string|null);

        /** ExerciseRecord runningTime */
        runningTime?: (string|null);

        /** ExerciseRecord pushUps */
        pushUps?: (string|null);

        /** ExerciseRecord sitUps */
        sitUps?: (string|null);

        /** ExerciseRecord squats */
        squats?: (string|null);

        /** ExerciseRecord otherExerciseTime */
        otherExerciseTime?: (string|null);

        /** ExerciseRecord todayWeight */
        todayWeight?: (string|null);

        /** ExerciseRecord exerciseNote */
        exerciseNote?: (string|null);

        /** ExerciseRecord todayImages */
        todayImages?: (Uint8Array[]|null);

        /** ExerciseRecord isPublic */
        isPublic?: (boolean|null);

        /** ExerciseRecord hasWeightInput */
        hasWeightInput?: (boolean|null);
    }

    /** Represents an ExerciseRecord. */
    class ExerciseRecord implements IExerciseRecord {

        /**
         * Constructs a new ExerciseRecord.
         * @param [properties] Properties to set
         */
        constructor(properties?: exercise_record.IExerciseRecord);

        /** ExerciseRecord userId. */
        public userId: number;

        /** ExerciseRecord date. */
        public date: string;

        /** ExerciseRecord walkingDistance. */
        public walkingDistance: string;

        /** ExerciseRecord walkingTime. */
        public walkingTime: string;

        /** ExerciseRecord runningDistance. */
        public runningDistance: string;

        /** ExerciseRecord runningTime. */
        public runningTime: string;

        /** ExerciseRecord pushUps. */
        public pushUps: string;

        /** ExerciseRecord sitUps. */
        public sitUps: string;

        /** ExerciseRecord squats. */
        public squats: string;

        /** ExerciseRecord otherExerciseTime. */
        public otherExerciseTime: string;

        /** ExerciseRecord todayWeight. */
        public todayWeight: string;

        /** ExerciseRecord exerciseNote. */
        public exerciseNote: string;

        /** ExerciseRecord todayImages. */
        public todayImages: Uint8Array[];

        /** ExerciseRecord isPublic. */
        public isPublic: boolean;

        /** ExerciseRecord hasWeightInput. */
        public hasWeightInput: boolean;

        /**
         * Creates a new ExerciseRecord instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExerciseRecord instance
         */
        public static create(properties?: exercise_record.IExerciseRecord): exercise_record.ExerciseRecord;

        /**
         * Encodes the specified ExerciseRecord message. Does not implicitly {@link exercise_record.ExerciseRecord.verify|verify} messages.
         * @param message ExerciseRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: exercise_record.IExerciseRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExerciseRecord message, length delimited. Does not implicitly {@link exercise_record.ExerciseRecord.verify|verify} messages.
         * @param message ExerciseRecord message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: exercise_record.IExerciseRecord, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExerciseRecord message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExerciseRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): exercise_record.ExerciseRecord;

        /**
         * Decodes an ExerciseRecord message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExerciseRecord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): exercise_record.ExerciseRecord;

        /**
         * Verifies an ExerciseRecord message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExerciseRecord message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExerciseRecord
         */
        public static fromObject(object: { [k: string]: any }): exercise_record.ExerciseRecord;

        /**
         * Creates a plain object from an ExerciseRecord message. Also converts values to other types if specified.
         * @param message ExerciseRecord
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: exercise_record.ExerciseRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExerciseRecord to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExerciseRecord
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SaveExerciseRecordRequest. */
    interface ISaveExerciseRecordRequest {

        /** SaveExerciseRecordRequest record */
        record?: (exercise_record.IExerciseRecord|null);
    }

    /** Represents a SaveExerciseRecordRequest. */
    class SaveExerciseRecordRequest implements ISaveExerciseRecordRequest {

        /**
         * Constructs a new SaveExerciseRecordRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: exercise_record.ISaveExerciseRecordRequest);

        /** SaveExerciseRecordRequest record. */
        public record?: (exercise_record.IExerciseRecord|null);

        /**
         * Creates a new SaveExerciseRecordRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SaveExerciseRecordRequest instance
         */
        public static create(properties?: exercise_record.ISaveExerciseRecordRequest): exercise_record.SaveExerciseRecordRequest;

        /**
         * Encodes the specified SaveExerciseRecordRequest message. Does not implicitly {@link exercise_record.SaveExerciseRecordRequest.verify|verify} messages.
         * @param message SaveExerciseRecordRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: exercise_record.ISaveExerciseRecordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SaveExerciseRecordRequest message, length delimited. Does not implicitly {@link exercise_record.SaveExerciseRecordRequest.verify|verify} messages.
         * @param message SaveExerciseRecordRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: exercise_record.ISaveExerciseRecordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SaveExerciseRecordRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SaveExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): exercise_record.SaveExerciseRecordRequest;

        /**
         * Decodes a SaveExerciseRecordRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SaveExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): exercise_record.SaveExerciseRecordRequest;

        /**
         * Verifies a SaveExerciseRecordRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SaveExerciseRecordRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SaveExerciseRecordRequest
         */
        public static fromObject(object: { [k: string]: any }): exercise_record.SaveExerciseRecordRequest;

        /**
         * Creates a plain object from a SaveExerciseRecordRequest message. Also converts values to other types if specified.
         * @param message SaveExerciseRecordRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: exercise_record.SaveExerciseRecordRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SaveExerciseRecordRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SaveExerciseRecordRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SaveExerciseRecordResponse. */
    interface ISaveExerciseRecordResponse {

        /** SaveExerciseRecordResponse success */
        success?: (boolean|null);

        /** SaveExerciseRecordResponse message */
        message?: (string|null);

        /** SaveExerciseRecordResponse caloriesBurned */
        caloriesBurned?: (number|null);
    }

    /** Represents a SaveExerciseRecordResponse. */
    class SaveExerciseRecordResponse implements ISaveExerciseRecordResponse {

        /**
         * Constructs a new SaveExerciseRecordResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: exercise_record.ISaveExerciseRecordResponse);

        /** SaveExerciseRecordResponse success. */
        public success: boolean;

        /** SaveExerciseRecordResponse message. */
        public message: string;

        /** SaveExerciseRecordResponse caloriesBurned. */
        public caloriesBurned: number;

        /**
         * Creates a new SaveExerciseRecordResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SaveExerciseRecordResponse instance
         */
        public static create(properties?: exercise_record.ISaveExerciseRecordResponse): exercise_record.SaveExerciseRecordResponse;

        /**
         * Encodes the specified SaveExerciseRecordResponse message. Does not implicitly {@link exercise_record.SaveExerciseRecordResponse.verify|verify} messages.
         * @param message SaveExerciseRecordResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: exercise_record.ISaveExerciseRecordResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SaveExerciseRecordResponse message, length delimited. Does not implicitly {@link exercise_record.SaveExerciseRecordResponse.verify|verify} messages.
         * @param message SaveExerciseRecordResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: exercise_record.ISaveExerciseRecordResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SaveExerciseRecordResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SaveExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): exercise_record.SaveExerciseRecordResponse;

        /**
         * Decodes a SaveExerciseRecordResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SaveExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): exercise_record.SaveExerciseRecordResponse;

        /**
         * Verifies a SaveExerciseRecordResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SaveExerciseRecordResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SaveExerciseRecordResponse
         */
        public static fromObject(object: { [k: string]: any }): exercise_record.SaveExerciseRecordResponse;

        /**
         * Creates a plain object from a SaveExerciseRecordResponse message. Also converts values to other types if specified.
         * @param message SaveExerciseRecordResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: exercise_record.SaveExerciseRecordResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SaveExerciseRecordResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SaveExerciseRecordResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetExerciseRecordRequest. */
    interface IGetExerciseRecordRequest {

        /** GetExerciseRecordRequest userId */
        userId?: (number|null);

        /** GetExerciseRecordRequest date */
        date?: (string|null);
    }

    /** Represents a GetExerciseRecordRequest. */
    class GetExerciseRecordRequest implements IGetExerciseRecordRequest {

        /**
         * Constructs a new GetExerciseRecordRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: exercise_record.IGetExerciseRecordRequest);

        /** GetExerciseRecordRequest userId. */
        public userId: number;

        /** GetExerciseRecordRequest date. */
        public date: string;

        /**
         * Creates a new GetExerciseRecordRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetExerciseRecordRequest instance
         */
        public static create(properties?: exercise_record.IGetExerciseRecordRequest): exercise_record.GetExerciseRecordRequest;

        /**
         * Encodes the specified GetExerciseRecordRequest message. Does not implicitly {@link exercise_record.GetExerciseRecordRequest.verify|verify} messages.
         * @param message GetExerciseRecordRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: exercise_record.IGetExerciseRecordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetExerciseRecordRequest message, length delimited. Does not implicitly {@link exercise_record.GetExerciseRecordRequest.verify|verify} messages.
         * @param message GetExerciseRecordRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: exercise_record.IGetExerciseRecordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetExerciseRecordRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): exercise_record.GetExerciseRecordRequest;

        /**
         * Decodes a GetExerciseRecordRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetExerciseRecordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): exercise_record.GetExerciseRecordRequest;

        /**
         * Verifies a GetExerciseRecordRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetExerciseRecordRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetExerciseRecordRequest
         */
        public static fromObject(object: { [k: string]: any }): exercise_record.GetExerciseRecordRequest;

        /**
         * Creates a plain object from a GetExerciseRecordRequest message. Also converts values to other types if specified.
         * @param message GetExerciseRecordRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: exercise_record.GetExerciseRecordRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetExerciseRecordRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetExerciseRecordRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetExerciseRecordResponse. */
    interface IGetExerciseRecordResponse {

        /** GetExerciseRecordResponse found */
        found?: (boolean|null);

        /** GetExerciseRecordResponse record */
        record?: (exercise_record.IExerciseRecord|null);
    }

    /** Represents a GetExerciseRecordResponse. */
    class GetExerciseRecordResponse implements IGetExerciseRecordResponse {

        /**
         * Constructs a new GetExerciseRecordResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: exercise_record.IGetExerciseRecordResponse);

        /** GetExerciseRecordResponse found. */
        public found: boolean;

        /** GetExerciseRecordResponse record. */
        public record?: (exercise_record.IExerciseRecord|null);

        /**
         * Creates a new GetExerciseRecordResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetExerciseRecordResponse instance
         */
        public static create(properties?: exercise_record.IGetExerciseRecordResponse): exercise_record.GetExerciseRecordResponse;

        /**
         * Encodes the specified GetExerciseRecordResponse message. Does not implicitly {@link exercise_record.GetExerciseRecordResponse.verify|verify} messages.
         * @param message GetExerciseRecordResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: exercise_record.IGetExerciseRecordResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetExerciseRecordResponse message, length delimited. Does not implicitly {@link exercise_record.GetExerciseRecordResponse.verify|verify} messages.
         * @param message GetExerciseRecordResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: exercise_record.IGetExerciseRecordResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetExerciseRecordResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): exercise_record.GetExerciseRecordResponse;

        /**
         * Decodes a GetExerciseRecordResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetExerciseRecordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): exercise_record.GetExerciseRecordResponse;

        /**
         * Verifies a GetExerciseRecordResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetExerciseRecordResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetExerciseRecordResponse
         */
        public static fromObject(object: { [k: string]: any }): exercise_record.GetExerciseRecordResponse;

        /**
         * Creates a plain object from a GetExerciseRecordResponse message. Also converts values to other types if specified.
         * @param message GetExerciseRecordResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: exercise_record.GetExerciseRecordResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetExerciseRecordResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetExerciseRecordResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
