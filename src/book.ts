/**
 * Created by anth on 21.05.2017.
 */

import Blueprint, { BlueprintOptions } from './index';
import util from './util';

export default class Book {
  blueprintData: { blueprint_book?: Book, blueprint?: Blueprint, index?: number }[];
  name: string;
  description: string;
  activeIndex: number;

  constructor(blueprints?) {
    this.blueprintData = [];
    if (blueprints) blueprints.forEach(blueprint => {
      this.addItem(blueprint);
    });
  }

  /**
   * Loads an encoded string or JSON object into a book 
   * 
   * @param data 
   * @param opt 
   * @returns 
   */
  static load(data: string, opt?: BookOptions): Book {
    return new Book().load(data, opt);
  }

  /**
   * Tests to see if a given string or JSON object is a Book
   * 
   * @param data 
   * @returns boolean
   */
  static isBook(data: any) {
    const version = data.slice(0, 1);
    if (version !== '0') {
      throw new Error('No decoder found for blueprint book version ' + version);
    }
    let obj = util.decode[version](data);

    return typeof obj.blueprint_book === 'object';
  }

  load(data: any, opt?: BookOptions): Book {
    if (typeof data === 'string') {
      const version = data.slice(0, 1);
      if (version !== '0') {
        throw new Error('Cannot find decoder for blueprint version ' + version);
      }
      data = util.decode[version](data);
    }

    return this.fillFromObject(data, opt);
  }

  toObject() {
    return {
      'blueprint_book': {
        label: this.name || undefined,
        item: 'blueprint-book',
        description: this.description || undefined,
        blueprints: this.blueprintData.map(entry => {
          if (entry.blueprint) return entry.blueprint.toObject();
          if (entry.blueprint_book) return entry.blueprint_book.toObject();
        })
      }
    }
  }

  /**
  * Returns the string for import into Factorio.
  *
  * @returns compressed JSON string
  */
  encode() {
    return util.encode[0](this.toObject())
  }


  /**
   * Populate the Book from an object
   * 
   * @param data - JSON object of blueprint/book data
   * @param opt 
   * @returns 
   */
  fillFromObject(data: any, opt?: BookOptions): Book {

    if (data.hasOwnProperty('blueprint_book')) {
      this.name = data.blueprint_book.label;
      this.description = data.blueprint_book.description
      if (data.blueprint_book.blueprints)
        data.blueprint_book.blueprints
          .sort((a, b) => (a.index - b.index))
          .forEach(blueprintData => {
            this.addItem(blueprintData);
          });

    } else {
      throw new Error("OH NO IT'S NOT A BOOK")
    }
    return this;
  }

  addItem(itemData: any): Book {
    let item, index;
    index = itemData.index;

    if (itemData.hasOwnProperty('blueprint')) {
      item = new Blueprint(itemData);
    } else if (itemData.hasOwnProperty('blueprint_book')) {
      item = new Book().fillFromObject(itemData);
    } else {
      item = itemData;
    }

    if (item instanceof Blueprint) {
      this.addBlueprint(item, index)
    } else if (item instanceof Book) {
      this.addBook(item, index)
    }
    return this;
  }

  /**
   * Append a blueprint to the book
   * 
   * @param bp - Blueprint to add
   * @returns this
   */
  addBlueprint(bp: Blueprint, index?: number): Book {
    if (index === undefined) {
      this.blueprintData.push({ blueprint: bp });
    } else {
      this.blueprintData[index] = { blueprint: bp, index: index };

    }
    return this;
  }

  /**
   * Append a nested book to the existing book
   * 
   * @param bb Book to append
   * @param index Index of appended book
   */
  addBook(bb: Book, index?: number): Book {
    if (index === undefined) {
      this.blueprintData.push({ blueprint_book: bb });
    } else {
      this.blueprintData[index] = { blueprint_book: bb, index: index };

    }
    return this;
  }

}




export interface BookOptions {
  checkWithEntityData?: boolean; // Should we validate enitity names with entityData? Default true
  fixEntityData?: boolean;
  allowOverlap?: boolean;
}
