import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit() {
        this.setState({isSubmitted: true})
    }

    render() {
        return (
          <div>
              <form onSubmit={this.handleSubmit}>
                  <input type="number" value={this.state.value} onChange={this.handleChange} placeholder="Employee ID "/>
                  <input type="submit" value="Get Employees" />
              </form>
              {this.state.isSubmitted && <Table />}
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

    }

    getRowsData() {

    }

    componentDidMount () {
        if (this.state.value) {
            axios.get(`http://localhost:8080/employees/${this.state.value}`)
              .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
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
                        employees: result.employees
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
                  <table>
                      <thead>
                        <tr>{ this.getHeader() }</tr>
                      </thead>
                      <tbody>
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
