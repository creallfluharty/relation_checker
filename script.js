class Greeter extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        }
    }
    render() {
        return <div id="Greeter">
            <label htmlFor="name_input">What is your name? </label>
            <input type="text" id="name_input" onChange={event => this.changeInput(event)}></input>
            <button type="button" onClick={event => this.greet(event)}>Submit</button>
        </div>;
    };

    greet() {
        alert("Hello, " + this.state.name);
    }

    changeInput(event) {
        this.setState({
            name: event.target.value,
        });
    }
}

ReactDOM.render(
    <Greeter/>,
    document.getElementById('root'),
);