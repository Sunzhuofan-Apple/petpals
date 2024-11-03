declare var require: any;

const React = require('react');
const ReactDOM = require('react-dom');

export class Hello extends React.Component {
    render() {
        return <h1>Welcome to React!!</h1>;
    }
}

ReactDOM.render(<Hello />, document.getElementById('root'));
