import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProcessService from '../apps/services/ProcessService';
import AgentService from '../apps/services/AgentService';


export class ProcessDashboard extends Component {

    constructor(props){
        super(props)
        this.state = {
            processName: "",
            agentName: "",
            listProcess: [],
            listAgents: []
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.loadProcess();
        this.loadAgents();
      }
    // ----- PROCESSOS ----

    async loadProcess(){
        try {
            let ret = await ProcessService.list();
            this.setState({listProcess: ret.data});
        } catch(error) {
            console.log(error)
            alert("Não foi possível listar os processos")
        }
    }

    async createSimpleProcess() {
        try {
            let ret = await ProcessService.create({name: this.state.processName})
            if (ret.status == 201) {
                this.setState({processName:""})
                await this.loadProcess()
            }
        } catch (error) {
            console.error(error)
            alert("Não foi possivel criar")
        }
    }

    async deleteProcess(id) {
        try{
            let ret = await ProcessService.delete(id);
            if (ret.status == 204){
                await this.loadProcess()
            }
        } catch (error) {
            console.error(error)
            alert("Não foi possivel apagar processo")
        }
    }

    async renderProcessDetail(id) {
        console.log("Process id: "+id)
    }

    // ---- FIM PROCESSOS ---
    
    // ----- AGENTES ----

    async loadAgents(){
        try {
            let ret = await AgentService.list();
            this.setState({listAgents: ret.data});
        } catch(error) {
            console.log(error)
            alert("Não foi possível listar os agentes")
        }
    }

    async createSimpleaAgent() {
        try {
            let ret = await AgentService.create({name: this.state.agentName})
            if (ret.status == 201) {
                this.setState({agentName:""})
                await this.loadAgents()
            }
        } catch (error) {
            console.error(error)
            alert("Não foi possivel criar")
        }
    }

    async deleteAgent(id) {
        try{
            let ret = await AgentService.delete(id);
            if (ret.status == 204){
                await this.loadAgents()
            }
        } catch (error) {
            console.error(error)
            alert("Não foi possivel apagar o agente")
        }
    }

    handleChange(event) {
        if (event.target.id == "processName") {
            this.setState({ processName: event.target.value })
        }

        if (event.target.id == "agentName") {
            this.setState({ agentName: event.target.value })
        }
        
    }

    render() {
        return (
        <div>
        <div className="page-header">
          <h3 className="page-title"> Motiro Process DashBoard </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">Motiro Process</li>
            </ol>
          </nav>
        </div>
        <div className="row">
            <div className="col-lg-3 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Process</h4>
                <Form>
                <Form.Group>
                  <div className="input-group">
                  <Form.Control  id='processName' name='processName' type="text" className="form-control" 
                                 placeholder="Process Name" aria-label="Process name" 
                                 aria-describedby="basic-addon2"
                                 value={this.state.processName || ''}
                                 onChange={this.handleChange} />
                    <div className="input-group-append">
                      <button className="btn btn-sm btn-success" type="button" onClick={ () => this.createSimpleProcess()}>+</button>
                    </div>
                  </div>
                </Form.Group>
                </Form>
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
                    {this.state.listProcess.map( process => (
                        <tr id={"linha-process-"+process.id} key={"linha-process-"+process.id} onClick={() => this.renderProcessDetail(process.id)}>
                          <td> { process.id } </td>
                          <td> { process.name } </td>
                          <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                              <button type="button" className="btn btn-primary">
                                <i className="mdi mdi-lead-pencil"></i>
                              </button>
                              <button type="button" className="btn btn-danger" onClick={() => this.deleteProcess(process.id)} >
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
            <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Process Details</h4>
                <div className="table-responsive">
                </div>
              </div>
            </div>
            </div>
            <div className="col-lg-3 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Agents</h4>
                <Form>
                <Form.Group>
                  <div className="input-group">
                  <Form.Control  id='agentName' name='agentName' type="text" className="form-control" 
                                 placeholder="Agent Name" aria-label="Agent Name" 
                                 aria-describedby="basic-addon2"
                                 value={this.state.agentName || "" }
                                 onChange={ this.handleChange } />
                    <div className="input-group-append">
                      <button className="btn btn-sm btn-success" type="button" onClick={ () => this.createSimpleaAgent()} >+</button>
                    </div>
                  </div>
                </Form.Group>
                </Form>
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
                    {this.state.listAgents.map( agent => (
                        <tr>
                          <td> { agent.id } </td>
                          <td> { agent.name } </td>
                          <td>
                            <div className="btn-group" role="group" aria-label="Basic example">
                              <button type="button" className="btn btn-primary">
                                <i className="mdi mdi-lead-pencil"></i>
                              </button>
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
    
    )}

}

export default ProcessDashboard;