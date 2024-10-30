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

    let testBook = new Book([bp1, bp2]);
    const encodedString = testBook.encode();

    it('adds blueprints', () => {
        testBook.addItem(new Blueprint());
        assert.equal(testBook.blueprintData.length, 3);
    })

    it('adds books', () => {
        addedBook = new Book().addItem(new Book());
        assert.equal(addedBook.blueprintData.length, 1);
        assert.notStrictEqual(addedBook.blueprintData[0].blueprint_book, undefined);

    })

    describe('encoding', () => {

        it('has blueprints', () => {
            const obj = testBook.toObject();
            assert.equal(obj.blueprint_book.blueprints.length, 3);
        })

        it('is a string', () => {
            assert.equal(typeof encodedString, 'string');
        });

        it('supports book names', () => {
            testBook.name = 'Test Name';
            const nameObj = testBook.toObject();
            assert.equal(nameObj.blueprint_book.label, 'Test Name')
        });

        it('supports book descriptions', () => {
            testBook.description = 'Test description';
            const nameObj = testBook.toObject();
            assert.equal(nameObj.blueprint_book.description, 'Test description')
        })

        it('supports nested books', () => {
            const subBook = new Book();
            subBook.name = 'Nested Book';
            testBook.addBook(subBook);
            const obj = testBook.toObject();

            assert.equal(obj.blueprint_book.blueprints[3].blueprint_book.label, 'Nested Book');

            console.log(testBook.encode());
        })


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
            '0eNqtkk1uwyAQha9SzRpHGDd/XlY9QPdRZGF70qLagIAktSLfvWBUhUppk1bZ8R4zb4ZPnKDu9qiNkK6qlXqH8nR2LJSbRIY70SgZbSteJe+C5waNUIJw2AMByfugnOHSamVcVmPnYCQgZIsfUObjlgBKJ5zAmDSJoZL7vkbjC37KIKCV9W1Khqk+KmN0UczmBAZ/Liils7mf0wqDTaxiYda0V5k8g0DHfaD3nl5yrw5obCxf5Y/LNVsu1oyuCnbemY7kvxx23LrsHjAuBV0lwv5OhN1EJL+Uk00/KAnzMgBu0TZG6LhBdB+eE4/cjvOoVPuNH7naYvgx2wn7lrRNFLhHcsDqK+mXV4+fymgGIg==';
        const bb = Book.load(importString);

        it('parses book', () => {
            assert.equal(bb.blueprintData.length, 2);
        });

        it('loads book name and description', () => {
            assert.equal(bb.name, 'Book1');
            assert.equal(bb.description, 'Book1 Description');
        })

        it('loads nested books', () => {
            const importString =
                '0eNqtU8tugzAQ/BW0ZxOByZNj1Fyr3KsogrBprIKNbOeBIv69dqw2FJGGRLmxD8/szixnSPM9lpJxvU6F+IL4fM0oiD8aoa2xjeAurdgnT3Kb01WJEAPTWAABnhQ20jLhqhRS+ynmGmoCjGd4gjisVwSQa6YZOqRLUK35vkhRmoZbGARKocwzwS2rgfJpMI4GIwKV+Y6CIBiMDE/GJG5cF7Vcl7nixhoE8sQAmtx8GZrogFK59mk4nMzoZDyjwTSi15mDmjyrwzZR2n+FGF1AdxWhjytCeykS/lHk93TayP6lcIVfFKWuvHdUGjNv7mqJGe2A6x+p+7DTbvaXHC6eSolKvcSzG1hdtkWThm3Ro7YtHJE3X/a85w64tlcNlzz6nE/DPjyWwP6GGaqNZKVb2GW9t0aO9PfwKEQGrWO980QmR3/L1A6aV7Zqbx3+s3X9DZtnul4=';
            const bb = Book.load(importString);
            const nestedBooks = bb.blueprintData.filter(data => (data.blueprint_book));

            assert.equal(nestedBooks.length, 2);
        });

        it('loads names on nested books', () => {
            const importString =
                '0eNqtU8tugzAQ/BW0ZxOByZNj1Fyr3KsogrBprIKNbOeBIv69dqw2FJGGRLmxD8/szixnSPM9lpJxvU6F+IL4fM0oiD8aoa2xjeAurdgnT3Kb01WJEAPTWAABnhQ20jLhqhRS+ynmGmoCjGd4gjisVwSQa6YZOqRLUK35vkhRmoZbGARKocwzwS2rgfJpMI4GIwKV+Y6CIBiMDE/GJG5cF7Vcl7nixhoE8sQAmtx8GZrogFK59mk4nMzoZDyjwTSi15mDmjyrwzZR2n+FGF1AdxWhjytCeykS/lHk93TayP6lcIVfFKWuvHdUGjNv7mqJGe2A6x+p+7DTbvaXHC6eSolKvcSzG1hdtkWThm3Ro7YtHJE3X/a85w64tlcNlzz6nE/DPjyWwP6GGaqNZKVb2GW9t0aO9PfwKEQGrWO980QmR3/L1A6aV7Zqbx3+s3X9DZtnul4=';
            const bb = Book.load(importString);
            const nestedBooks = bb.blueprintData.filter(data => (data.blueprint_book));

            assert.equal(nestedBooks[0].blueprint_book.name, 'Empty Nested Book');
        })

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