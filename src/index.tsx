import React from 'react';
import ReactDOM from 'react-dom';
import { Model, attr, ORM } from 'redux-orm'

interface Book {
    title: string;
    id: number
}

class Book extends Model<typeof Book> {
    static modelName = 'Book';

    static fields = {
        id: attr(),
        title: attr()
    };
}

const schema = {Book};
const orm = new ORM<typeof schema>();
orm.register(Book);

const session = orm.session(orm.getEmptyState());

let {title, id}= session.Book.create({id: 1, title: 'foo'});

ReactDOM.render(<div>{id}: {title}</div>, document.getElementById('root'));

