import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import ProcessGoalService from '../apps/services/ProcessGoalService';

export class ProcessGoalManter extends Component {

  constructor(props){
    super(props)
    this.state = {
      processGoals: []
    }
  }

  componentDidMount(){
    this.loadProcessGoals()
  }

  async loadProcessGoals(){
    try {
      let ret = await ProcessGoalService.list()
      this.setState({processGoals: ret.data})
    } catch(error) {
      console.log(error)
      alert("Não foi possível listar")
    }
  }

  async deleteProcessGoals(id){
    try {
      let ret = await ProcessGoalService.delete(id)
      this.props.history.replace('/motiro/process-goal')
    } catch(error) {
      console.log(error)
      alert("Não foi possivel excluir!")
    }
  }

  render() {
    return (
        <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Process Goal</h4>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th> # </th>
                        <th> Name </th>
                        <th> Ações </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.processGoals.map( goal => (
                        <tr>
                          <td> { goal.id } </td>
                          <td> { goal.name } </td>
                          <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                              <button type="button" className="btn btn-primary">
                                <i className="mdi mdi-lead-pencil"></i>
                              </button>
                              <button type="button" className="btn btn-danger" onClick={() => this.deleteProcessGoals(goal.id)}>
                                <i className="mdi mdi-delete-forever"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
    );
  }
}

export default ProcessGoalManter
