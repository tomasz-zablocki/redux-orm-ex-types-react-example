import React from 'react';
import ReactDOM from 'react-dom';
import { attr, many, Model, MutableQuerySet, ORM } from 'redux-orm'

interface Book {
    title: string;
    id: number;
    related: MutableQuerySet<Book>
    relating: MutableQuerySet<Book>
}

class Book extends Model<typeof Book> {
    static modelName = 'Book';

    static fields = {
        id: attr(),
        title: attr(),
        related: many('Book', 'relating')
    };
}

const schema = {Book};
const orm = new ORM<typeof schema>();
orm.register(Book);

const session = orm.session(orm.getEmptyState());

session.Book.create({id: 1, title: 'b1'});
session.Book.create({id: 2, title: 'b2'});
session.Book.create({id: 3, title: 'b3'});
session.Book.create({id: 4, title: 'b4'});
session.Book.create({id: 5, title: 'b5', related: [1, 2, 3, 4]});

const b5related = session.Book.withId(5)!.related.toRefArray().map(b => b.title);
const b1relating = session.Book.withId(1)!.relating.toRefArray().map(b => b.title);

ReactDOM.render(<div>b5related: {b5related.toString()}<br/>b1relating: {b1relating}
</div>, document.getElementById('root'));

