import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            isSubmitted: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.setState({isSubmitted: true});
    }

    render() {
        return (
          <div>
              {!this.state.isSubmitted && (
                <form onSubmit={this.handleSubmit}>
                    <input type="number" value={this.state.value} onChange={this.handleChange} placeholder="Employee ID "/>
                    <input type="submit" value="Get Employees" />
                </form>
              )}
              {this.state.isSubmitted && <Table value={this.state.value}/>}
          </div>
        );
    }
}

class Table extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            employees: []
        };

        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
    }

    getHeader() {
        if (this.state.employees[0]) {
            let header = Object.keys(this.state.employees[0]);
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            });
        }
    }

    getRowsData() {
        return this.state.employees.map(employee => {
            const { id, name, contractType, roleName, annualSalary } = employee
            return (
              <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{contractType}</td>
                  <td>{roleName}</td>
                  <td>{annualSalary}</td>
              </tr>
            )
        });
    }

    componentDidMount () {
        this.setState({
            isLoaded: true
        });
        if (this.props.value) {
            axios.get(`http://localhost:8080/employees/${this.props.value}`)
              .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        employees: [result.data]
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
              )
        } else {
            axios.get('http://localhost:8080/employees')
              .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        employees: result.data
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
              )
        }
    }

    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return(
              <div>
                  <table id='employees'>
                      <tbody>
                          <tr>{ this.getHeader() }</tr>
                          { this.getRowsData() }
                      </tbody>
                  </table>
              </div>
            );
        }
    }
}

ReactDOM.render(
    <Home />,
    document.getElementById('root')
)
