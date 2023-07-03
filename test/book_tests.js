const assert = require('assert');
const { Blueprint, Book } = require('../dist/factorio-blueprint.min.js');
const Victor = require('victor');
const util = require('./util');


describe('Blueprint Books', () => {
    const bp1 = new Blueprint();
    bp1.name = 'First';
    const bp2 = new Blueprint();
    bp2.name = 'Second';

    const encodedString = new Book([bp1, bp2]).encode();

    describe('creation', () => {
        it('is a string', () => {
            assert.equal(typeof encodedString, 'string');
        });

    })

    describe('parsing', () => {
        // A simple blueprint book consisting of two blueprints named BP1 and BP2
        const importString =
            '0eNqtks1qwzAQhN9lz3KQ5eZPxzxB76UYOdkWUXtlpE2oCX73rmxKfCihKb1pRqtvpEFXaNoz9tET100IH2CvNyeBfVnIvOePgWY7+XdybfZ46BEseMYOFJDrsnpziQuOjlIfIhcNtgyjAk8n/ARbjq8KkNizxxk3iaGmc9dglIG7IAV9SHI2UM4XXmH0plqtFQyyrrQ2q7WEnXzE4zxlcuB0Q7t4kILWCVC8w7MRdcGY5vFd+bTdm+1mb/SuMreL61H9tZH/KOPRHvTjPZS/6qH8iVNMP2gBE5lxTsIvWH9XeIc/fgE1XdRZ';
        it('parses book', () => {
            assert.equal(Book.load(importString).blueprints.length, 2);
        });


    })

    describe('backwards compatibility', () => {
        const bookString = Blueprint.toBook([bp1, bp2]);

        it('parses book - legacy', () => {
            assert.equal(Blueprint.getBook(bookString).length, 2);
        });

        it('has index on each blueprint', () => {
            const decoded = util.decode[0](bookString);
            assert.equal(decoded.blueprint_book.blueprints[0].index, 0);
            assert.equal(decoded.blueprint_book.blueprints[1].index, 1);
        });

        it('sorts based on index', () => {
            const decoded = util.decode[0](bookString);
            const [decodedBp1, decodedBp2] = decoded.blueprint_book.blueprints;
            decoded.blueprint_book.blueprints = [decodedBp2, decodedBp1];

            const encoded = util.encode[0](decoded);
            const book = Blueprint.getBook(encoded);
            // Should have looked at blueprint.index
            // and reordered the blueprints accordingly
            assert.equal(book[0].name, 'First');
            assert.equal(book[1].name, 'Second');
        });

        it('checks bp string type', () => {
            assert.equal(Blueprint.isBook(bookString), true);
            assert.equal(Blueprint.isBook(bp1.encode()), false);
        });

        it('encodes with undefined and null values', () => {
            const bookString2 = Blueprint.toBook([undefined, null, bp1]);

            const decoded = Blueprint.getBook(bookString2);
            assert.equal(decoded[0], undefined);
            assert.equal(decoded[1], undefined);
            assert.equal(decoded[2].name, 'First');
        });

        it('is a string', () => {
            assert.equal(typeof bookString, 'string');
        });


    });

});
