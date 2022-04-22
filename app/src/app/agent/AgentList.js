import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AgentService from '../apps/services/AgentService';
import { Truncate } from '../apps/util/Truncate';
import cogoToast from 'cogo-toast';

export class AgentList extends Component {

    constructor(props){
        super(props)
        this.state = {
          agents: []
        }
    }
    
    componentDidMount(){
       this.loadAgents();
    }

    async loadAgents(){
        try {
          let ret = await AgentService.list();
          if (ret.status === 200){
            this.setState({agents: ret.data});  
          }     
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not list");
        }
    }

    async deleteAgent(id){
        try {
          let ret = await AgentService.delete(id);
          if (ret.status === 204 ){
            this.loadAgents();
            cogoToast.success("The data has been erased");
          } else {
            cogoToast.error("Could not delete");
          }          
        } catch(error) {
          console.error(error);
          cogoToast.error("Could not delete");
        }
    }

    render() {
        return (
        <div>
        <div className="page-header">
            <h3 className="page-title">Agents</h3>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">Agents</li>
                </ol>
            </nav>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
              <div className="card-body">
              <div className="d-flex flex-row justify-content-between">
                  <h4 className="card-title">Agents</h4>
                  <Link to="/agents/0">
                  <button type="button" className="btn btn-success" >
                      <i className="mdi mdi-plus-circle-outline"></i>
                      Add
                  </button>
                  </Link>
              </div>
              <div className="table-responsive">
                  <table className="table table-hover">
                  <thead>
                      <tr>
                      <th> # </th>
                      <th> Name </th>
                      <th> Description </th>
                      <th> Actions </th>
                      </tr>
                  </thead>
                  <tbody>
                      {this.state.agents.map( agent => (
                      <tr key={ "agent-id-"+agent.id } >
                          <td> { agent.id } </td>
                          <td> { agent.name } </td>
                          <td> <Truncate text={agent.description} size={20}/> </td>
                          <td>
                          <div className="btn-group" role="group" aria-label="Basic example">
                              <Link to={ '/agents/'+agent.id }>
                              <button type="button" className="btn btn-primary">
                                  <i className="mdi mdi-lead-pencil"></i>
                              </button>
                              </Link>
                              <button type="button" className="btn btn-danger" onClick={() => this.deleteAgent(agent.id)} >
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
        </div>
        </div>
        );
    }

}

export default AgentList;