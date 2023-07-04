/**
 * Created by anth on 21.05.2017.
 */
import { Blueprint } from './index';
export default class Book {
    blueprintData: {
        blueprint: Blueprint;
        index?: number;
    }[];
    constructor();
    /**
     * Loads an encoded string or JSON object into a book
     *
     * @param data
     * @param opt
     * @returns
     */
    static load(data: string, opt?: BookOptions): Book;
    /**
     * Tests to see if a given string or JSON object is a Book
     *
     * @param data
     * @returns boolean
     */
    static isBook(data: any): boolean;
    load(data: any, opt?: BookOptions): Book;
    /**
    * Returns the string for import into Factorio.
    *
    * @returns compressed JSON string
    */
    encode(): string;
    /**
     * Populate the Book from an object
     *
     * @param data - JSON object of blueprint/book data
     * @param opt
     * @returns
     */
    fillFromObject(data: any, opt?: BookOptions): Book;
    /**
     * Append a blueprint to the book
     *
     * @param bp - Blueprint to add
     * @returns this
     */
    addBlueprint(bp: Blueprint, index?: number): Book;
}
export interface BookOptions {
    checkWithEntityData?: boolean;
    fixEntityData?: boolean;
    allowOverlap?: boolean;
}
