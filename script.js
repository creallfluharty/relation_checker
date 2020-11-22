function replaceNullWithEmptyList(maybeNull) {
    return (maybeNull === null)? [] : maybeNull;
}

class UniqueIDGenerator {
    static prefixCounters = new Map();

    static createIdWithPrefix(prefix) {
        if (!this.prefixCounters.has(prefix)) {
            this.prefixCounters.set(prefix, 0);
        }

        var uniqueId = `${prefix}${this.prefixCounters.get(prefix)}`;

        this.prefixCounters.set(prefix, this.prefixCounters.get(prefix)+1); // Honestly, I'd prefer pointers to this

        return uniqueId
    }
}


class RelationEntry extends React.Component {
    constructor(props) {
        super(props);

        this.defaultText = '{}';
        this.relationRegex = /^(\{(\(\w,\w\),)*(\(\w,\w\))\})|(\{\})$/;

        this.input_id = UniqueIDGenerator.createIdWithPrefix("relationEntryInput")

        this.state = {
            relationStr: this.defaultText,
            isValidInput: true,
            relation: [],
        }
    }

    render() {
        return <div className={`relationEntry ${this.state.isValidInput? '': 'in'}validRelationEntry`}>
            <label htmlFor={this.input_id}>Enter your relation: </label>
            <input type="text" id={this.input_id}
                value={this.state.relationStr} onChange={event => this.changeInput(event)}></input>
        </div>;
    };

    changeInput(event) {
        try {
            var relation = this.deserializeRelationStr(event.target.value);
            var isValidInput = true;
            console.log(`Got relation ${Array(...relation)}`);
        } catch (error) {
            console.log(error);
            var relation = [];
            var isValidInput = false;
        }

        this.setState({
            relationStr: event.target.value,
            relation: relation,
            isValidInput: isValidInput,
        });
    }

    deserializeRelationStr(relationStr) {
        relationStr = relationStr.replaceAll(' ', '');

        if (!this.relationRegex.test(relationStr)) {
            throw `Bad Relation: Relation ${relationStr} did not match pattern ${this.relationRegex}`;
        }

        var pairs = new Set(replaceNullWithEmptyList(relationStr.match(/(\(\w,\w\))/g)).map(pairStr =>
            pairStr.match(/\w/g)
        ));

        return pairs;
    }

    getRelation() {
        return this.state.relation;
    }
}

ReactDOM.render(
    <RelationEntry/>,
    document.getElementById('root'),
);