const assert = require('assert');
const Blueprint = require('../dist/factorio-blueprint.min.js');
const Victor = require('victor');
const util = require('./util');
const { Book } = Blueprint.Book;

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


        it('encodes with undefined and null values', () => {
            const bookString2 = Blueprint.toBook([undefined, null, bp1]);

            const bb = Book.load(bookString2);
            assert.equal(bb.blueprintData.length, 3);
            assert.equal(bb.blueprintData[0], undefined);
            assert.equal(bb.blueprintData[1], undefined);
            assert.equal(bb.blueprintData[2].blueprint.name, 'First');
        });

    })

    describe('parsing', () => {
        // A simple blueprint book consisting of two blueprints named BP1 and BP2
        const importString =
            '0eNqtkktuwzAMRO/CtRzIcvPTsifovigMOWELoTZlSExQI/DdS9ko4kX6RXcainxDDXSBpj1hHz1x3YTwCvZyrSSwjwuZ7/wh0FxO/oVcm2s89AgWPGMHCsh1WXF0lPoQuWiwZRgVeDriG9hyfFKAxJ49zqRJDDWdugajNHzGUNCHJGOBsqugCqM31WqtYJBzpbVercXn6CMe5i6Tvaa97OIZClonQKndP5SizhjT3L4r77Z7s93sjd5V5rqzHtVfc3h2iYv/COMW6NtEzO8TMT9KpLzFKaYftICJzAE7MT9j/TH6BX98B6371Fo=';
        const bb = Book.load(importString);

        it('parses book', () => {
            assert.equal(bb.blueprintData.length, 2);
        });

        it('has index on each blueprint', () => {
            bb.blueprintData.forEach(entry => {
                assert.equal(Number.isInteger(entry.index), true);
            })
        });

        it('sorts based on index', () => {
            // decode and swap the blueprint from the test book
            const decoded = util.decode[0](importString);
            const [decodedBp1, decodedBp2] = decoded.blueprint_book.blueprints;
            decoded.blueprint_book.blueprints = [decodedBp2, decodedBp1];

            const encoded = util.encode[0](decoded);
            const nb = Book.load(encoded);

            for (let i = 0; i < nb.blueprintData.length; i++) {
                assert.equal(nb.blueprintData[i].index, i);
                assert.equal(nb.blueprintData[i].blueprint.name, 'BP' + (i + 1));
            }
        });

        it('checks bp string type', () => {
            assert.equal(Book.isBook(importString), true);
            assert.equal(Book.isBook(bp1.encode()), false);
        });

    })

    describe('backwards compatibility', () => {
        const bookString = Blueprint.toBook([bp1, bp2]);

        it('parses book - legacy', () => {
            assert.equal(Blueprint.getBook(bookString).length, 2);
        });

        it('has index on each blueprint - legacy', () => {
            const decoded = util.decode[0](bookString);
            assert.equal(decoded.blueprint_book.blueprints[0].index, 0);
            assert.equal(decoded.blueprint_book.blueprints[1].index, 1);
        });

        it('sorts based on index - legacy', () => {
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

        it('checks bp string type - legacy', () => {
            assert.equal(Blueprint.isBook(bookString), true);
            assert.equal(Blueprint.isBook(bp1.encode()), false);
        });

        it('encodes with undefined and null values - legacy', () => {
            const bookString2 = Blueprint.toBook([undefined, null, bp1]);

            const decoded = Blueprint.getBook(bookString2);
            assert.equal(decoded[0], undefined);
            assert.equal(decoded[1], undefined);
            assert.equal(decoded[2].name, 'First');
        });

        it('is a string - legacy', () => {
            assert.equal(typeof bookString, 'string');
        });


    });

});
