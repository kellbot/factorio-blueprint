import Victor from 'victor';
import Entity from './entity';
import Tile from './tile';
export default class Blueprint {
    name: string;
    description: string;
    icons: string[];
    entities: Entity[];
    tiles: Tile[];
    entityPositionGrid: {
        [location: string]: Entity;
    };
    tilePositionGrid: {
        [location: string]: Tile;
    };
    version: number;
    snapping: {
        grid: Position;
        position: Position;
        absolute: boolean;
    };
    checkWithEntityData: boolean;
    constructor(data?: any, opt?: BlueprintOptions);
    toString(opt: ToObjectOpt): string;
    load(data: any, opt?: BlueprintOptions): this;
    static test(str: any): any;
    fillFromObject(data: any, opt: BlueprintLoadOptions): this;
    placeBlueprint(bp: Blueprint, position: Position, rotations: number, allowOverlap: boolean): this;
    createEntity(name: string, position: Position, direction?: number, allowOverlap?: boolean, noPlace?: boolean, center?: boolean): Entity;
    createEntityWithData(data: any, allowOverlap?: boolean, noPlace?: boolean, center?: boolean): Entity;
    createTile(name: string, position: Position): Tile;
    createTileWithData(data: any): Tile;
    findEntity(pos: Position): Entity;
    findTile(pos: Position): Tile;
    removeEntity(ent: Entity): false | Entity;
    removeTile(tile: Tile): false | Tile;
    removeEntityAtPosition(position: Position): false | Entity;
    removeTileAtPosition(position: Position): false | Tile;
    setIds(): this;
    getPosition(f: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', xcomp: Math['min'] | Math['max'], ycomp: Math['min'] | Math['max']): Victor;
    center(): Victor;
    topLeft(): Victor;
    topRight(): Victor;
    bottomLeft(): Victor;
    bottomRight(): Victor;
    fixCenter(aroundPoint?: Position): this;
    generateIcons(num?: number): this;
    toObject({ autoConnectPoles }?: ToObjectOpt): {
        blueprint: {
            icons: ({
                signal: {
                    type: string;
                    name: string;
                };
                index: number;
            } | null)[];
            entities: {
                name: string;
                position: {
                    x: number;
                    y: number;
                };
                direction: number;
                entity_number: number;
                type: ("input" | "output") | undefined;
                recipe: string | undefined;
                bar: number | undefined;
                station: string | undefined;
                manual_trains_limit: number | undefined;
                filter: string | undefined;
                input_priority: ("left" | "right") | undefined;
                output_priority: ("left" | "right") | undefined;
                items: {
                    [name: string]: number;
                } | undefined;
                filters: any[] | undefined;
                request_filters: any[] | undefined;
                connections: {
                    [side: string]: {
                        [color: string]: {
                            entity_id: number;
                            circuit_id?: string | undefined;
                        }[];
                    };
                } | undefined;
                neighbours: number[] | undefined;
                parameters: {
                    playback_volume: any;
                    playback_globally: any;
                    allow_polyphony: any;
                } | undefined;
                alert_parameters: {
                    show_alert: boolean;
                    show_on_map: boolean;
                    alert_message: string;
                    icon_signal_id: string | {
                        type: string;
                        name: string;
                    } | undefined;
                } | undefined;
                control_behavior: any;
            }[] | undefined;
            tiles: {
                name: string;
                position: {
                    x: number;
                    y: number;
                };
            }[] | undefined;
            item: string;
            version: number;
            label: string;
            description: string | undefined;
            "absolute-snapping": boolean | undefined;
            "snap-to-grid": Position | undefined;
            "position-relative-to-grid": Position | undefined;
        };
    };
    toJSON(opt?: ToObjectOpt): string;
    encode(opt?: EncodeOpt): string;
    static setEntityData(obj: any): void;
    static getEntityData(): {
        [entity_name: string]: import("./defaultentities").EntityDescription;
    };
    static get UP(): number;
    static get RIGHT(): number;
    static get DOWN(): number;
    static get LEFT(): number;
    static get ROTATION_NONE(): number;
    static get ROTATION_90_CW(): number;
    static get ROTATION_180_CW(): number;
    static get ROTATION_270_CW(): number;
    static get ROTATION_270_CCW(): number;
    static get ROTATION_180_CCW(): number;
    static get ROTATION_90_CCW(): number;
    checkName(name: string): string;
    jsName(name: string): string;
    fixName(name: string): string;
    static getBook(str: string, opt?: BlueprintOptions): Blueprint[];
    static toBook(blueprints: (Blueprint | undefined | null)[], activeIndex?: number, opt?: EncodeOpt): string;
    static isBook(str: string): boolean;
}
type Version = '0' | 'latest';
interface Position {
    x: number;
    y: number;
}
interface BlueprintLoadOptions {
    fixEntityData?: boolean;
    allowOverlap?: boolean;
}
export interface BlueprintOptions extends BlueprintLoadOptions {
    checkWithEntityData?: boolean;
}
interface EncodeOpt extends ToObjectOpt {
    version?: Version;
}
interface ToObjectOpt {
    autoConnectPoles?: boolean;
}
export {};
