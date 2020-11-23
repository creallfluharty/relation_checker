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

        this.relationRegex = /^(\{(\(\w,\w\),)*(\(\w,\w\))\})|(\{\})$/;

        this.inputId = UniqueIDGenerator.createIdWithPrefix("relationEntryInput");

        var relationStr = (props.relationStr === undefined)? '{}': props.relationStr;

        this.state = {
            relationStr: relationStr,
            relation: this.deserializeRelationStr(relationStr),
        };
    }

    render() {
        return <div className={`relationEntry ${(this.state.relation === null)? 'in': ''}validRelationEntry`}>
            <label htmlFor={this.inputId}>Enter your relation: </label>
            <input type="text" id={this.inputId}
                value={this.state.relationStr} onChange={event => this.changeInput(event)}></input>
        </div>;
    };

    changeInput(event) {
        var relation = this.deserializeRelationStr(event.target.value);

        this.setState({
            relationStr: event.target.value,
            relation: relation,
        });
    }

    deserializeRelationStr(relationStr) {
        relationStr = relationStr.replaceAll(' ', '');

        if (!this.relationRegex.test(relationStr)) {
            return null;
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

class SetEntry extends React.Component {
    constructor(props) {
        super(props);

        this.inputId = UniqueIDGenerator.createIdWithPrefix('SetEntryInput');
        this.setRegex = /(\{(\w,)*\w\})|(\{\})/;

        this.state = {
            setStr: '{}',
            isValidInput: true,
            set: new Set(),
        };
    }

    render() {
        return <div className={`SetEntry ${this.state.isValidInput? '': 'in'}validSetEntry`}>
            <label htmlFor={this.inputId}>Enter the set on which this relation occurs: </label>
            <input type="text" id={this.inputId} value={this.state.setStr}
                onChange={event => this.changeInput(event)}></input>
        </div>;
    }

    changeInput(event) {
        try {
            var set = this.deserializeSetStr(event.target.value);
            var isValidInput = true;
        } catch (error) {
            console.log(error);
            var isValidInput = false;
        }

        this.setState({
            setStr: event.target.value,
            isValidInput: isValidInput,
            set: set,
        });
    }

    deserializeSetStr(setStr) {
        setStr = setStr.replaceAll(' ', '');

        if (!this.setRegex.test(setStr)) {
            throw `Bad Set: Set ${setStr} does not match pattern ${setStr}`;
        }

        var set = new Set(setStr.match(/\w/g));

        return set;
    }

    getSet() {
        return this.state.set;
    }
}


// class RelationChecker extends React.Component {
//     constructor(props) {
//         super(props);

//     }
// }

ReactDOM.render(
    <div>
        <RelationEntry/>
        <SetEntry/>
    </div>,
    document.getElementById('root'),
);