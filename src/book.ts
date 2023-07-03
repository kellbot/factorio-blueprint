/**
 * Created by anth on 21.05.2017.
 */

import { Blueprint, BlueprintOptions } from './index';
import util from './util';

export default class Book {
  blueprints: Blueprint[];

  constructor() {
    this.blueprints = [];

  }

  static load(data: string, opt?: BookOptions): Book {
    return new Book().load(data, opt);
  }

  load(data: string, opt?: BookOptions): Book {
    if (typeof data === 'string') {
      const version = data.slice(0, 1);
      if (version !== '0') {
        throw new Error('Cannot find decoder for blueprint version ' + version);
      }
      data = util.decode[version](data);
    }
    return this.fillFromObject(data, opt);
  }

  /**
  * Returns the string for import into Factorio.
  *
  * @returns compressed JSON string
  */
  encode() {
    return 'string'
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
      data.blueprint_book.blueprints.forEach(blueprint => {
        const blueprintData = blueprint;
        if (blueprint.index === undefined) {
          this.blueprints.push(new Blueprint(blueprintData, opt));
        } else {
          this.blueprints[blueprint.index] = new Blueprint(blueprintData, opt);
        }
      });
      return this;

    } else {
      throw new Error("OH NO IT'S NOT A BOOK")
    }
  }

}


export interface BookOptions {
  checkWithEntityData?: boolean; // Should we validate enitity names with entityData? Default true
  fixEntityData?: boolean;
  allowOverlap?: boolean;
}
// export default (str: string, opt?: BlueprintOptions) => {
//   const version = str.slice(0, 1);
//   if (version !== '0') {
//     throw new Error(
//       'Cannot find decoder for blueprint book version ' + version,
//     );
//   }
//   let obj = util.decode[version](str);

//   const blueprints = obj.blueprint_book.blueprints;
//   const blueprintList: Blueprint[] = [];

//   blueprints.forEach((data: any) => {
//     const blueprintData = data.blueprint;

//     if (data.index === undefined) {
//       blueprintList.push(new Blueprint(blueprintData, opt));
//     } else {
//       blueprintList[data.index] = new Blueprint(blueprintData, opt);
//     }
//   });

//   return blueprintList;
// };
