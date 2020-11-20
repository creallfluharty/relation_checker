class Greeter extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return <div id="Greeter">
            <label htmlFor="name_input">What is your name? </label>
            <input type="text" id="name_input"></input>
            <button type="button" onClick={this.greet}>Submit</button>
        </div>;
    };

    greet() {
        alert("Hello, " + document.getElementById("name_input").value)
    }
}

ReactDOM.render(
    <Greeter/>,
    document.getElementById('root'),
);