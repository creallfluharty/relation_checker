function replaceNullWithEmptyList(maybeNull) {
    return (maybeNull === null)? [] : maybeNull;
}

function arrayHasElement(array, element) {
    return _.some(array, item => _.isMatch(item, element));
}

class RelationEntry extends React.Component {
    constructor(props) {
        super(props);

        this.relationRegex = /^(\{(\(\w,\w\),)*(\(\w,\w\))\})|(\{\})$/;

        this.inputId = _.uniqueId("relationEntryInput");

        this.onRelationChange = (props.onRelationChange === undefined)? ()=>{}: this.props.onRelationChange;

        var relationStr = (props.relationStr === undefined)? '{}': props.relationStr;

        this.state = {
            relationStr: relationStr,
            relation: this.deserializeRelationStr(relationStr),
        };

        this.onRelationChange(this.state.relation);
    }

    render() {
        return <div className={`relationEntry ${(this.state.relation === null)? 'in': ''}validRelationEntry`}>
            <label htmlFor={this.inputId}>Enter your relation: </label>
            <textarea type="text" id={this.inputId}
                value={this.state.relationStr} onChange={event => this.changeInput(event)}></textarea>
        </div>;
    };

    componentDidUpdate() {
        this.onRelationChange(this.state.relation);
    }

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

        var pairs = new Array(...new Set(replaceNullWithEmptyList(relationStr.match(/(\(\w,\w\))/g)).map(pairStr =>
            pairStr.match(/\w/g)
        )));

        return pairs;
    }
}

class SetEntry extends React.Component {
    constructor(props) {
        super(props);

        this.inputId = _.uniqueId('SetEntryInput');
        this.setRegex = /(\{(\w,)*\w\})|(\{\})/;

        var setStr = (props.setStr === undefined)? '{}': props.setStr;
        this.onSetChange = (props.onSetChange === undefined)? ()=>{}: this.props.onSetChange;

        this.state = {
            setStr: setStr,
            set: this.deserializeSetStr(setStr),
        };

        this.onSetChange(this.state.set);
    }

    render() {
        return <div className={`SetEntry ${(this.state.set === null)? 'in': ''}validSetEntry`}>
            <label htmlFor={this.inputId}>Enter the set on which this relation occurs: </label>
            <textarea type="text" id={this.inputId} value={this.state.setStr}
                onChange={event => this.changeInput(event)}></textarea>
        </div>;
    }

    componentDidUpdate() {
        this.onSetChange(this.state.set);
    }

    changeInput(event) {
        var set = this.deserializeSetStr(event.target.value);
        this.setState({
            setStr: event.target.value,
            set: set,
        });
    }

    deserializeSetStr(setStr) {
        setStr = setStr.replaceAll(' ', '');

        if (!this.setRegex.test(setStr)) {
            return null;
        }

        var set = new Array(...new Set(setStr.match(/\w/g)));

        return set;
    }
}


class RelationPropertyChecker extends React.Component {
    constructor(props) {
        super(props);

        this.stateSymbols = {
            true: '✅',
            false: '❎',
            undefined: '⍰',
        }
    }

    render() {
        return <div className="RelationPropertyChecker">
            <h3>Relation Properties</h3>
            <div className="RelationProperties">
                <div className="RelationProperty">
                    <p>Reflexive?</p>
                    <p>{this.stateSymbols[this.checkIsReflexive(this.props.relation, this.props.set)]}</p>
                </div>
                <div className="RelationProperty">
                    <p>Symmetric?</p>
                    <p>{this.stateSymbols[this.checkIsSymmetric(this.props.relation, this.props.set)]}</p>
                </div>
                <div className="RelationProperty">
                    <p>Anti-Symmetric?</p>
                    <p>{this.stateSymbols[this.checkIsAntiSymmetric(this.props.relation, this.props.set)]}</p>
                </div>
                <div className="RelationProperty">
                    <p>Transitive?</p>
                    <p>{this.stateSymbols[this.checkIsTransitive(this.props.relation, this.props.set)]}</p>
                </div>
            </div>
        </div>
    }

    checkIsReflexive(relation, set) {
        console.log('checkIsReflexive was called');
        if (relation === null || set === null)
            return undefined;

        for (var element of set) {
            if (!arrayHasElement(relation, [element, element]))
                return false;
        }
        return true;
    }

    checkIsSymmetric(relation, set) {
        if (relation === null)
            return undefined;
    
        for (var [a, b] of relation) {
            if (!arrayHasElement(relation, [b, a])) {
                return false;
            }
        }
        return true;
    }

    checkIsAntiSymmetric(relation, set) {
        if (relation === null)
            return undefined;

        for (var [a, b] of relation) {
            if (arrayHasElement(relation, [b, a]) && a !== b)
            return false
        }

        return true
    }

    checkIsTransitive(relation, set) {
        if (relation == null)
            return undefined;
        
        for (var [a1, b1] of relation) {
            for (var [a2, b2] of relation) {
                if (b1 === a2 && !arrayHasElement(relation, [a1, b2]))
                    return false;
            }
        }

        return true;
    }
}


class RelationChecker extends React.Component {
    constructor(props) {
        super(props);

        this.relationEntry = <RelationEntry onRelationChange={relation => this.handleRelationChange(relation)}/>;
        this.setEntry = <SetEntry onSetChange={set => this.handleSetChange(set)}/>;

        this.state = {
            relation: null,
            set: null,
        };
    }

    render() {
        return <div>
            <div className="Entries">
                {this.relationEntry}
                {this.setEntry}
            </div>
            <RelationPropertyChecker set={this.state.set} relation={this.state.relation} />
        </div>
    }

    handleRelationChange(relation) {
        console.log(`Got relation ${relation}`);
        this.setState({
            relation: relation,
        });
    }

    handleSetChange(set) {
        console.log(`Got set ${set}`);
        this.setState({
            set: set,
        });
    }
}

ReactDOM.render(
    <RelationChecker/>,
    document.getElementById('root'),
);